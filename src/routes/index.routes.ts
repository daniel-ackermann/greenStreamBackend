
import { Request, Response, Router } from 'express'
import { checkStatus, deleteAccount, registerAccount, sendEmail, signIn, signOut } from '../controllers/index.controller'
import { saveNewPassword } from '../controllers/password.controller';
import { cookieToken } from '../interface/cookieToken';
import { authenticate } from '../middleware';
import TokenService from '../services/token.service';

const router = Router();
const tokenService = new TokenService();

router.route("/account")
    .get(sendEmail)
    .post(registerAccount)

router.route("/account/:email")
    .delete(authenticate, (req: Request, res: Response) => {
        if(deleteAccount(req.params.email, req.token as cookieToken)){
            return res.json(200);
        }else{
            return res.json(500);
        }
    })

router.route("/login")
    .get(checkStatus)
    .post(signIn)
    .delete(signOut);

router.route("/passwordRestore")
    .post((req: Request, res: Response) => {
        const token = tokenService.valid(req.body.token as string);
        if(token.valid === true){
            saveNewPassword(req.body.password, token.owner);
            res.status(200).send("Erfolgreich gespeichert!");
        }else{
            return res.status(401).send({text:"Ein Fehler ist aufgetreten!", data: JSON.stringify(req.body) });
        }
    });

export default router;