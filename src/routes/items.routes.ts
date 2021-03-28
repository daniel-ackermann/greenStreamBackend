import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getItems, getReviewedItemsByUser, getItemsByUser, getItemsToReview, getLikedItems, getWatchListItems, getWatchedItems, getItemsWithUserData, getSuggestedItems, getItemsWithFeedback, getSearchResult, getSearchResultUser } from '../controllers/items.controller'
import { authenticate, hasValidToken } from '../middleware';

const router = Router();

router.route('/reviewed/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        return res.json(
            await getReviewedItemsByUser(parseInt(req.token.id, 10), parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
        );
    });

router.route('/review/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        res.json(
            await getItemsToReview(req.token.id, parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
        );
    })

router.route('/created/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        return res.json(
            await getItemsByUser(parseInt(req.token.id, 10), parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
        )
    })

router.route('/liked/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        return res.json(
            await getLikedItems(parseInt(req.token.id, 10), parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
        )
    })

router.route('/watched/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        return res.json(
            await getWatchedItems(parseInt(req.token.id, 10), parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
        )
    })

router.route('/watchlist/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        return res.json(
            await getWatchListItems(parseInt(req.token.id, 10), parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
        )
    })

router.route('/feedbacks/:limit/:startId?')
    .get(authenticate, async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (req.cookies.jwt && req.token != false) {
            return res.json(
                await getItemsWithFeedback(parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[], parseInt(req.token.id))
            );
        } else {
            return res.json(
                await getItemsWithFeedback(parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[])
            );
        }
    });

router.route('/search/:limit/:startId/:query?')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
            req.query.topics = req.query.topics.split(",");
        }
        let result;
        if (req.cookies.jwt && req.token != false) {
            console.log(req.params.query);
            if(req.params.query === undefined ){
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
            }else{
                result = await getSearchResultUser(req.params.query, parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[],  parseInt(req.token.id), req.headers["accept-language"])
            }
        } else {
            if(req.params.query === undefined){
                result = await getItems(parseInt(req.params.startId) || 0, parseInt(req.params.limit), req.headers["accept-language"], req.query.topics as string[]);
            }else{
                result = await getSearchResult(req.params.query, parseInt(req.params.limit), parseInt(req.params.startId), req.query.topics as string[], req.headers["accept-language"])
            }
        }
        return res.json(result);
    });

router.route('/:limit/:startId?')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (typeof req.query.topics === "string" && req.query.topics.length > 0) {
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