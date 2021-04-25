import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { setItemStatus, getItem, deleteItem, updateItem, getItemWithUserData, reviewItem, addItem, getRecommendedItem } from '../controllers/item.controller';
import { Item } from '../interface/item';
import { authenticate, hasValidToken } from '../middleware';

const router = Router();

router.route('/')
    .post(authenticate, async (req: Request, res: Response) => {
        req.body.created_by_id = req.token.id;
        const data = await addItem(req.body as Item)
        return res.json(data);
    });

router.route('/review/:id')
    .get(authenticate, async (req: Request, res: Response) => {
        try {
            res.json(
                await reviewItem(parseInt(req.params.id), parseInt(req.token.id, 10))
            );
        } catch (e) {
            return res.status(422).send();
        }
    })

router.route('/status/:type/:id')
    .put(authenticate, async (req: Request, res: Response) => {
        try {
            const item = parseInt(req.params.id, 10);
            const user = parseInt(req.token.id);
            return res.status(
                await setItemStatus(user, item, req.params.type, Math.floor(new Date().getTime() / 1000) )
            ).send();
        } catch (e) {
            return res.status(422).send();
        }
    })
    .delete(authenticate, async (req: Request, res: Response) => {
        try {
            const item = parseInt(req.params.id, 10);
            const user = parseInt(req.token.id);
            return res.status(
                await setItemStatus(user, item, req.params.type, null)
            ).send();
        } catch (e) {
            return res.status(422).send();
        }
    });

router.route('/recommended')
    .get(authenticate, async (req: Request, res: Response) => {
        const item = await getRecommendedItem(req.token.id);
        setItemStatus(req.token.id, item.id, "last_recommended", Math.floor(new Date().getTime() / 1000))
        return res.json(item);
    });

router.route('/:itemId')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        let id;
        try {
            id = parseInt(req.params.itemId, 10);
        } catch (e) {
            return res.status(422).send();
        }
        if (req.cookies.jwt && req.token != false) {
            setItemStatus(req.token.id, id, "watched", Math.floor(new Date().getTime() / 1000) );
            return res.json(
                await getItemWithUserData(id, req.token.id)
            );
        } else {
            return res.json(
                await getItem(id)
            );
        }
    })
    .delete(authenticate, async (req: Request, res: Response) => {
        let id;
        try {
            id = parseInt(req.params.itemId);
        } catch (e) {
            return res.status(422).send();
        }
        return res.json(
            await deleteItem(id)
        )
    })
    .put(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await updateItem(
                    parseInt(req.params.itemId),
                    req.body as Item
                )
            )
        } catch (e) {
            return res.status(422).send();
        }
    });

export default router;