import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getLanguages } from '../controllers/language.controller';

const router = Router();

router.route('/')
    .get((req: Request, res: Response) => {
        res.json(getLanguages());
    });

export default router;