import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { addFeedback, getFeedback, removeFeedback } from '../controllers/feedback.controller';
import { authenticate } from '../middleware';


const router = Router();

router.route('')
    .post(authenticate, async (req: Request, res: Response) => {
        req.body.created_by_id = req.token.id;
        return res.json(
            await addFeedback(req.body)
        );
    })

router.route('/:id')
    .get(authenticate, async (req: Request, res: Response) => {
        return res.json(
            await getFeedback(parseInt(req.params.id))
        )
    })
    .delete(authenticate, async (req: Request, res: Response) => {
        console.log("delete");
        await removeFeedback(parseInt(req.params.id));
        return res.json(200);
    })



export default router;