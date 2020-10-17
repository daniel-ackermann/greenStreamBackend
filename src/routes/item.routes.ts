import { Router } from 'express'
import { getItems, addItem, getItem, deleteItem, updateItem } from '../controllers/item.controller'
import { authenticate } from '../middleware';

const router = Router();

router.route('/')
    .get(getItems)
    .post(authenticate, addItem);

router.route('/:itemId')
    .get(getItem)
    .delete(authenticate, deleteItem)
    .put(authenticate, updateItem);

export default router;