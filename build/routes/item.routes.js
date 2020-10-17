"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const item_controller_1 = require("../controllers/item.controller");
const middleware_1 = require("../middleware");
const router = express_1.Router();
router.route('/')
    .get(item_controller_1.getItems)
    .post(middleware_1.authenticate, item_controller_1.addItem);
router.route('/:itemId')
    .get(item_controller_1.getItem)
    .delete(middleware_1.authenticate, item_controller_1.deleteItem)
    .put(middleware_1.authenticate, item_controller_1.updateItem);
exports.default = router;
