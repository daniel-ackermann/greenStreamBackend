import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getLanguages } from '../controllers/language.controller';

const router = Router();

router.route('/')
    .get(async (req: Request, res: Response) => {
        res.json(await getLanguages());
    });

export default router;