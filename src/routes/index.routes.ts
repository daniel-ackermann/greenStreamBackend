
import { Router } from 'express'
import { checkStatus, deleteAccount, registerAccount, sendEmail, signIn, signOut } from '../controllers/index.controller'
import { passwordRestoreRequest, passwordRestore } from '../controllers/password.controller';
import { authenticate } from '../middleware';

const router = Router();

router.route("/account")
    .get(sendEmail)
    .delete(authenticate, deleteAccount)
    .post(registerAccount);

router.route("/login")
    .get(checkStatus)
    .post(signIn)
    .delete(signOut);

router.route("/passwordRestore")
    .get(passwordRestoreRequest)
    .post(passwordRestore);

export default router;