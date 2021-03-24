import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { addFeedback, getFeedback, getFeedbackByItem, getFeedbacks, removeFeedback } from '../controllers/feedback.controller';
import { authenticate } from '../middleware';


const router = Router();

router.route('/:limit/:startId')
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getFeedbacks()
        )
    })

router.route('/item/:id')
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getFeedbackByItem(parseInt(req.params.id))
        )
    })


export default router;