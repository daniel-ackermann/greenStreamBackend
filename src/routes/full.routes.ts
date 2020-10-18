import { Router } from 'express'
import { authenticate } from '../middleware';
import { responseAll } from '../controllers/full.controller';

const router = Router();

router.route('/')
    .get(responseAll);

export default router;