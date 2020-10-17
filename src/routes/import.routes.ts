import { Router } from 'express'
import { authenticate } from '../middleware';
import { importJSON } from '../controllers/import.controller';

const router = Router();

router.route('/')
    .post(authenticate, importJSON);

export default router;