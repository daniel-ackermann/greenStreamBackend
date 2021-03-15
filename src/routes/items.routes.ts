import { Request, Response, Router } from 'express'
import { addItem } from '../controllers/item.controller';
import { getItems, getReviewedItemsByUser, getItemsByUser, getItemsToReview, getLikedItems, getWatchListItems, getWatchedItems, getItemsWithUserData, getSuggestedItems } from '../controllers/items.controller'
import { Item } from '../interface/item';
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

router.route('/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getSuggestedItems(parseInt(req.token.id, 10), parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.headers["accept-language"])
        )
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

export default router;