import { Request, Response, Router } from 'express'
import { fullUser } from '../controllers/fullUser.controller';
import pool from '../lib/db';

const router = Router();

router.route('/:userId')
    .get(async ( req: Request, res: Response): Promise<Response> => {

        res.setHeader('Last-Modified', pool.getLastModified().toUTCString());

        if (req.headers["if-modified-since"]) {
            if (pool.getLastModified().getTime() < new Date(req.headers["if-modified-since"] as string).getTime()) {
                return res.status(304).send(304);
            }
        }
        return res.json(
            await fullUser(parseInt(req.params.userId, 10))
        )
    });

export default router;