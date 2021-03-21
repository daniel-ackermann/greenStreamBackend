import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getItems, getReviewedItemsByUser, getItemsByUser, getItemsToReview, getLikedItems, getWatchListItems, getWatchedItems, getItemsWithUserData, getSuggestedItems, getAllItems } from '../controllers/items.controller'
import { authenticate, hasValidToken } from '../middleware';

const router = Router();

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
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if(typeof req.query.topics === "string" && req.query.topics.length > 0){
            req.query.topics = req.query.topics.split(",");
        }
        if (req.cookies.jwt && req.token != false) {
            if (req.query.topics && req.query.topics.length && req.query.topics.length > 0) {
                console.log("auth\ttopics\t => getItemsWithUserData");
                return res.status(200).json(
                    await getItemsWithUserData(parseInt(req.token.id, 10), parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.query.topics as string[], req.headers["accept-language"])
                );
            } else {
                console.log("auth\t\t => getSuggested");
                return res.status(200).json(
                    await getSuggestedItems(parseInt(req.token.id, 10), parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.headers["accept-language"])
                );
            }
        } else {
            console.log("\ttopics\t => getItems\t" + req.query.topics);
            const data = await getItems(parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.headers["accept-language"], req.query.topics as string[])
            return res.status(200).json(data);
        }
    });

export default router;