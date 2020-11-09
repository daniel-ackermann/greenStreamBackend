import { Request, Response, Router } from 'express'
import { getFullUser, saveFullUser } from '../controllers/fullUser.controller';
import { UserWithoutPassword } from '../interface/user';
import pool from '../lib/db';
import { authenticate } from '../middleware';

const router = Router();

router.route('/:userId')
    .get(async ( req: Request, res: Response): Promise<Response> => {
        // .get(authenticate, async ( req: Request, res: Response): Promise<Response> => {
        res.setHeader('Last-Modified', pool.getLastModified().toUTCString());

        if (req.headers["if-modified-since"]) {
            if (pool.getLastModified().getTime() < new Date(req.headers["if-modified-since"] as string).getTime()) {
                return res.status(304).send(304);
            }
        }
        return res.status(200).json(
            await getFullUser(parseInt(req.params.userId, 10))
        )
    })
    .post(authenticate, async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).json(
            await saveFullUser(parseInt(req.params.userId), req.body as UserWithoutPassword)
        )
    });

export default router;