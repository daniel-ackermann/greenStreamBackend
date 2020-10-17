"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../controllers/index.controller");
const password_controller_1 = require("../controllers/password.controller");
const middleware_1 = require("../middleware");
const router = express_1.Router();
router.route("/account")
    .get(index_controller_1.sendEmail)
    .delete(middleware_1.authenticate, index_controller_1.deleteAccount)
    .post(index_controller_1.registerAccount);
router.route("/login")
    .get(middleware_1.authenticate, index_controller_1.checkStatus)
    .post(index_controller_1.signIn)
    .delete(index_controller_1.signOut);
router.route("/passwordRestore")
    .get(password_controller_1.passwordRestoreRequest)
    .post(password_controller_1.passwordRestore);
exports.default = router;
