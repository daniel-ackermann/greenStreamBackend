import { Request, Response, Router } from 'express'
import { updateStatus, getItem, deleteItem, updateItem, getItemWithUserData, reviewItem } from '../controllers/item.controller';
import { Item } from '../interface/item';
import { authenticate, hasValidToken } from '../middleware';

const router = Router();

router.route('/review/:id')
    .get(authenticate, async (req: Request, res: Response) => {
        res.json(
            await reviewItem(parseInt(req.params.id), parseInt(req.token.id, 10))
        );
    })

router.route('/:itemId')
    .get(async (req: Request, res: Response) => {
        req.token = hasValidToken(req.cookies.jwt);
        if (req.cookies.jwt && req.token != false) {
            updateStatus(req.token.id, { id: parseInt(req.params.itemId, 10), watched: true });
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