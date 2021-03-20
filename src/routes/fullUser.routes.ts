import { Router } from 'express'
import { Request, Response } from '../interface/custom.request'
import { getFullUser, saveFullUser } from '../controllers/fullUser.controller';
import { User } from '../interface/user';
import pool from '../lib/db';
import { authenticate } from '../middleware';

const router = Router();

router.route('/')
    .get(authenticate, async (req: Request, res: Response): Promise<Response> => {
        res.setHeader('Last-Modified', pool.getLastModified().toUTCString());

        if (req.headers["if-modified-since"]) {
            if (pool.getLastModified().getTime() < new Date(req.headers["if-modified-since"] as string).getTime()) {
                return res.status(304).send(304);
            }
        }
        return res.status(200).json(
            await getFullUser(parseInt(req.token.id, 10))
        )
    })
    .post(authenticate, async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).json(
            await saveFullUser(parseInt(req.token.id), req.body as User)
        )
    });

export default router;