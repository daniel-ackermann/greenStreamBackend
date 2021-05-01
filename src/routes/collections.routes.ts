import { Router } from 'express'
import { getCollectionsByUser, getCollections } from '../controllers/collections.controller';
import { Request, Response } from '../interface/custom.request'
import { authenticate } from '../middleware';


const router = Router();

router.route('/user/:userId/:limit/:startId')
    .get(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await getCollectionsByUser(parseInt(req.params.userId), parseInt(req.params.limit), parseInt(req.params.startId))
            )
        } catch (e) {
            return res.status(422).send();
        }
    })

router.route('/:limit/:startId')
    .get(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await getCollections(parseInt(req.params.limit), parseInt(req.params.startId))
            )
        } catch (e) {
            return res.status(422).send();
        }
    })

export default router;