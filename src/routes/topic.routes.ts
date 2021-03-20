import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getTopic, getTopics, addTopic, deleteTopic, updateTopic } from '../controllers/topic.controller'
import { authenticate } from '../middleware';

const router = Router();

router.route("/")
    .get(async (req: Request, res: Response) => {
        res.json(
            await getTopics(req.headers["accept-language"])
        );
    });

router.route("/:topicId")
    .get(authenticate, getTopic)
    .post(authenticate, addTopic)
    .put(authenticate, updateTopic)
    .delete(authenticate, deleteTopic);

export default router;