import { Router } from 'express'
import { responseAll } from '../controllers/full.controller';

const router = Router();

router.route('/')
    .get(responseAll);

export default router;