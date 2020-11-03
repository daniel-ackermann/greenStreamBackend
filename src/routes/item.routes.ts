import { Request, Response, Router } from 'express'
import { getItems, addItem, getItem, deleteItem, updateItem, getReviewedItemsByUser, getItemsByUser, getItemsToReview, reviewItem, getLikedItems, getWatchListItems, getWatchedItems, updateStatus, getItemsWithUserData, getItemWithUserData } from '../controllers/item.controller'
import { Item } from '../interface/item';
import { UserData } from '../interface/userdata';
import { authenticate, hasValidToken } from '../middleware';

const router = Router();

router.route('/')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (req.cookies.jwt && req.token != false) {
            const data = await getItemsWithUserData(req.token.id, req.headers["accept-language"]);
            return res.status(200).json(data)
        } else {
            const data = await getItems(req.headers["accept-language"])
            return res.status(200).json(data);
        }
    })
    .post(authenticate, async (req: Request, res: Response) => {
        req.body.created_by_id = req.token.id;
        const data = await addItem(req.body as Item)
        return res.json(data);
    });

router.route('/reviewed')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getReviewedItemsByUser(parseInt(req.token.id, 10))
        );
    });

router.route('/review')
    .get(authenticate, async (req: Request, res: Response) => {
        res.json(
            await getItemsToReview(req.token.id)
        );
    })

router.route('/review/:id')
    .get(authenticate, async (req: Request, res: Response) => {
        res.json(
            await reviewItem(parseInt(req.params.id), parseInt(req.token.id, 10))
        );
    })

router.route('/created')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getItemsByUser(parseInt(req.token.id, 10))
        )
    })

router.route('/liked')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getLikedItems(parseInt(req.token.id, 10))
        )
    })

router.route('/watched')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getWatchedItems(parseInt(req.token.id, 10))
        )
    })

router.route('/watchlist')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getWatchListItems(parseInt(req.token.id, 10))
        )
    })

router.route('/status')
    .post(authenticate, async (req: Request, res: Response) => {
        updateStatus(parseInt(req.token.id, 10), req.body as UserData)
        return res.json(200)
    })

router.route('/:itemId')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (req.cookies.jwt && req.token != false) {
            updateStatus(req.token.id, { item_id: parseInt(req.params.itemId, 10), watched: true });
            return res.json(
                await getItemWithUserData(
                    parseInt(req.params.itemId),
                    req.token.id
                )
            );
        } else {
            return res.json(
                await getItem(
                    parseInt(req.params.itemId)
                )
            );
        }
    })
    .delete(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await deleteItem(
                parseInt(req.params.itemId)
            )
        )
    })
    .put(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await updateItem(
                parseInt(req.params.itemId),
                req.body as Item
            )
        )
    });


export default router;