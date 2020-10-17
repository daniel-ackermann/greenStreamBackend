"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const type_controller_1 = require("../controllers/type.controller");
const middleware_1 = require("../middleware");
const router = express_1.Router();
router.route("/")
    .get(type_controller_1.getTypes);
router.route("/:typeId")
    .get(middleware_1.authenticate, type_controller_1.getType)
    .post(middleware_1.authenticate, type_controller_1.addType)
    .put(middleware_1.authenticate, type_controller_1.updateType)
    .delete(middleware_1.authenticate, type_controller_1.deleteType);
exports.default = router;
