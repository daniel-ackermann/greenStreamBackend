import { Router } from 'express'
import { getTopic, getTopics, addTopic, deleteTopic, updateTopic } from '../controllers/topic.controller'
import { authenticate } from '../middleware';

const router = Router();

router.route("/")
    .get(getTopics);

router.route("/:topicId")
    .get(authenticate, getTopic)
    .post(authenticate, addTopic)
    .put(authenticate, updateTopic)
    .delete(authenticate, deleteTopic);

export default router;