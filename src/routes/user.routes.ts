import { Request, Response, Router } from "express";
import { updateUserById } from "../controllers/user.controller";
import { UpdateUser } from "../interface/user";
import { authenticate } from "../middleware";


const router = Router();

router.route("/:id")
    .put(authenticate, (req: Request, res: Response) => {
        updateUserById(parseInt(req.params.id), req.body as UpdateUser);
        res.json(200);
    });

export default router;