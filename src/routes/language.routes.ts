import { Request, Response, Router } from 'express'
import { getLanguages } from '../controllers/language.controller';

const router = Router();

router.route('/')
    .get((req: Request, res: Response) => {
        res.json(getLanguages());
    });

export default router;