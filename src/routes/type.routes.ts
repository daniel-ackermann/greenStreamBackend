import { Router } from 'express'
import { getType, getTypes, addType, deleteType, updateType } from '../controllers/type.controller'
import { authenticate } from '../middleware';

const router = Router();

router.route("/")
    .get(getTypes);

router.route("/:typeId")
    .get(authenticate, getType)
    .post(authenticate, addType)
    .put(authenticate, updateType)
    .delete(authenticate, deleteType);

export default router;