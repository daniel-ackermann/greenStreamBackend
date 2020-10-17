"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const import_controller_1 = require("../controllers/import.controller");
const router = express_1.Router();
router.route('/')
    .post(middleware_1.authenticate, import_controller_1.importJSON);
exports.default = router;
