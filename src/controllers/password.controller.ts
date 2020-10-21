import { Request, Response } from "express";
import path from "path";
import TokenService from "../services/token.service";
import pool from '../lib/db'
import bcrypt from 'bcryptjs'

const tokenService = new TokenService();

export async function passwordRestoreRequest(req: Request, res: Response): Promise<Response | void> {
    const token = tokenService.valid(req.query.token as string);
    if (token.valid) {
        res.cookie('tk', tokenService.getNew(token.owner, 1), { expires: new Date(new Date().getTime() + 1000 * 60 * 60) });
        return res.sendFile('doofeStruktur/index.html', { root: path.resolve(__dirname, '../../html') });
    } else {
        return res.send("Something went wrong!");
    }
}

export async function saveNewPassword(password: string, owner: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.execute(`UPDATE user SET password=? WHERE email=?`, [passwordHash.toString(), owner]);
}