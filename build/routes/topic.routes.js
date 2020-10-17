"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topic_controller_1 = require("../controllers/topic.controller");
const middleware_1 = require("../middleware");
const router = express_1.Router();
router.route("/")
    .get(topic_controller_1.getTopics);
router.route("/:topicId")
    .get(middleware_1.authenticate, topic_controller_1.getTopic)
    .post(middleware_1.authenticate, topic_controller_1.addTopic)
    .put(middleware_1.authenticate, topic_controller_1.updateTopic)
    .delete(middleware_1.authenticate, topic_controller_1.deleteTopic);
exports.default = router;
