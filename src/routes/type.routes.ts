import { Request, Response, Router } from 'express'
import { getType, getTypes, addType, deleteType, updateType } from '../controllers/type.controller'
import { authenticate } from '../middleware';

const router = Router();

router.route("/")
    .get(async (req: Request, res: Response) => {
        return res.json(
            await getTypes(req.headers["accept-language"])
        )
    });

router.route("/:typeId")
    .get(authenticate, getType)
    .post(authenticate, addType)
    .put(authenticate, updateType)
    .delete(authenticate, deleteType);

export default router;