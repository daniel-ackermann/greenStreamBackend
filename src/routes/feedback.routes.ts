import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { addFeedback, getFeedback, getFeedbackByItem, getFeedbacks, removeFeedback } from '../controllers/feedback.controller';
import { authenticate } from '../middleware';


const router = Router();

router.route('')
    .post(authenticate, async (req: Request, res: Response) => {
        req.body.created_by_id = req.token.id;
        return res.json(
            await addFeedback(req.body)
        );
    })
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

router.route('/:id')
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getFeedback(parseInt(req.params.id))
        )
    })
    .delete(async (req: Request, res: Response) => {
        console.log("delete");
        await removeFeedback(parseInt(req.params.id));
        return res.json(200);
    })



export default router;