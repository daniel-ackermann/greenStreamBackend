import { Request, Response, Router } from 'express'
import { getItems, getReviewedItemsByUser, getItemsByUser, getItemsToReview, getLikedItems, getWatchListItems, getWatchedItems, getItemsWithUserData, getSuggestedItems, getAllItems } from '../controllers/items.controller'
import { authenticate, hasValidToken } from '../middleware';

const router = Router();

router.route('/')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (req.cookies.jwt && req.token != false) {
            const data = await getItemsWithUserData(req.token.id, req.headers["accept-language"]);
            return res.status(200).json(data)
        } else {
            const data = await getAllItems(req.headers["accept-language"])
            return res.status(200).json(data);
        }
    })

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

router.route('/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (req.cookies.jwt && req.token != false) {
            return res.status(200).json(
                await getSuggestedItems(parseInt(req.token.id, 10), parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.headers["accept-language"])
            )
        } else {
            const data = await getItems(parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.headers["accept-language"])
            return res.status(200).json(data);
        }
    });

export default router;