import { Request, Response, Router } from 'express'
import { resolve } from 'path';
import { getItems, addItem, getItem, deleteItem, updateItem } from '../controllers/item.controller'
import { Item } from '../interface/item';
import { authenticate } from '../middleware';

const router = Router();

router.route('/')
    .get(async (req: Request, res: Response) => {
        const data = await getItems(req.headers["accept-language"])
        return res.json(data);
    })
    .post(authenticate, async (req: Request, res: Response) => {
        const data = await addItem(req.body as Item)
        return res.json(data);
    });

router.route('/:itemId')
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getItem(
                parseInt(req.params.itemId)
            )
        );
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