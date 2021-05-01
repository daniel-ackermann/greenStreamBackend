import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { addFeedback, getFeedback, removeFeedback, toggleStatus } from '../controllers/feedback.controller';
import { authenticate } from '../middleware';


const router = Router();

router.route('')
    .post(authenticate, async (req: Request, res: Response) => {
        req.body.created_by_id = req.token.id;
        try {
            return res.json(
                await addFeedback(req.body)
            );
        } catch (e) {
            console.log(e);
            return res.status(422).send();
        }
    })

router.route('/status')
    .post(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await toggleStatus(parseInt(req.body.id), req.body.status as boolean)
            );
        } catch (e) {
            console.log(e);
            return res.status(422).send();
        }
    });

router.route('/:id')
    .get(authenticate, async (req: Request, res: Response) => {
        try {
            return res.json(
                await getFeedback(parseInt(req.params.id))
            )
        } catch (e) {
            console.log(e);
            return res.status(422).send();
        }
    })
    .delete(authenticate, async (req: Request, res: Response) => {
        try {
            await removeFeedback(parseInt(req.params.id))
            return res.status(200).send();
        } catch (e) {
            console.log(e);
            return res.status(422).send();
        }
    })



export default router;