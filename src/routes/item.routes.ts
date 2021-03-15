import { Request, Response, Router } from 'express'
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

router.route('/status')
    .post(authenticate, async (req: Request, res: Response) => {
        updateStatus(parseInt(req.token.id, 10), req.body as UserData)
        return res.json(200)
    })

export default router;