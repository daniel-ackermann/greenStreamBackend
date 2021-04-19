import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { updateStatus, getItem, deleteItem, updateItem, getItemWithUserData, reviewItem, addItem } from '../controllers/item.controller';
import { Item } from '../interface/item';
import { UserData } from '../interface/userdata';
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

router.route('/status/:id/:type')
    .put(authenticate, async (req: Request, res: Response) => {
        try {
            const value: UserData = { id: parseInt(req.params.id) };
            value[req.params.type as "liked" | "watched" | "watchlist" | "last_recommended"] = req.body.value;
            updateStatus(parseInt(req.token.id, 10), value);
            return res.json(200);
        } catch (e) {
            return res.status(422).send();
        }
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
            updateStatus(req.token.id, { id: id, watched: Math.floor(new Date().getTime() / 1000) });
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

router.route('/status')
    .post(authenticate, async (req: Request, res: Response) => {
        try {
            updateStatus(parseInt(req.token.id, 10), req.body as UserData)
            return res.json(200)
        } catch (e) {
            return res.status(422).send();
        }
    })

export default router;