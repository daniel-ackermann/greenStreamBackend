import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getFeedbackByItem, getFeedbacks, setDoneByLabel } from '../controllers/feedback.controller';
import { authenticate } from '../middleware';


const router = Router();

router.route('/item/:id')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getFeedbackByItem(parseInt(req.params.id))
        )
    })

router.route('/status')
    .post(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await setDoneByLabel(parseInt(req.body.item), parseInt(req.body.label))
        );
    });

router.route('/:limit/:startId')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getFeedbacks()
        )
    })

export default router;