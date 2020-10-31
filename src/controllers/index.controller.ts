import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../interface/user'
import * as nodemailer from 'nodemailer';
import TokenService from '../services/token.service';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import 'dotenv/config'
import pool from '../lib/db';
import { hasValidToken } from '../middleware';
import { cookieToken } from '../interface/cookieToken';


// import pool from '../lib/db';
// pool.query(...);
// oder:
// import pool from '../lib/db';
// DB.pool.query('asd', []);




const tokenService = new TokenService();
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    }
});

export async function checkStatus(req: Request, res: Response): Promise<Response> {
    const authHeader = req.cookies.jwt;
    if (authHeader) {
        const token: false | cookieToken = hasValidToken(authHeader);
        if (token != false) {
            return res.status(200).json(
                await getUser(token.email)
            );
        }
    }
    return res.status(200).json(false);
}

export async function registerAccount(req: Request, res: Response): Promise<Response> {
    const user: User = {
        username: req.body.username || "",
        password: req.body.password || "",
        email: req.body.email,
        role: req.body.role,
        id: req.body.id || 0
    }
    const passwordHash = bcrypt.hashSync(user.password, 10);
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user WHERE email = ?;', [user.email]);
    if (rows.length > 0) {
        console.log("Nutzer existiert bereits");
        return res.status(403).json("Account existiert bereits!");
    }
    await pool.execute('INSERT INTO user (`username`, `password`, `email`, `role`) VALUES (?, ?, ?, ?);', [user.username, passwordHash.toString(), user.email, user.role]).catch(err => {
        console.log(err);
    })
    return res.sendStatus(200);
}

export async function deleteAccount(email: string, token: cookieToken): Promise<boolean> {
    if (email == token.email || token.role == "admin") {
        const [rows] = await (await pool.query<ResultSetHeader>('DELETE FROM user WHERE email = ?;', [token.email]));
        if (rows.affectedRows == 1) {
            return true;
        }
    }
    return false;
}

export async function signIn(req: Request, res: Response): Promise<Response> {
    const user: User = req.body as User;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT username, password, id, email, role, language, show_in_app, notification_time, topics, UNIX_TIMESTAMP(last_change) * 1000 as last_change FROM user WHERE email = ?;', [user.email]);
    if (rows.length == 1 && rows[0].email == user.email && await bcrypt.compare(user.password, rows[0].password)) {
        const accessToken = jwt.sign({
            email: user.email,
            role: rows[0].role,
            id: rows[0].id
        }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "6 hours" });
        const expire = new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
        res.cookie('jwt', accessToken, { expires: expire, sameSite: "lax", secure: true, httpOnly: true });
        delete rows[0].password;
        return res.json(rows[0]);
    } else {
        return res.status(403).json("Username or password incorrect");
    }
}

export async function signOut(req: Request, res: Response): Promise<Response> {
    res.cookie("jwt", "", { expires: new Date(), httpOnly: true });
    return res.json(200);
}

export async function sendEmail(req: Request, res: Response): Promise<Response> {
    const token = tokenService.getNew(req.query.user as string, 24);
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM user WHERE email = ?", [req.query.user as string]);
    if (rows.length == 0) {
        console.log("Emailversand an nicht exixstente Addresse!");
        return res.status(200).send("200");
    }
    const mailOptions = {
        from: process.env.EMAIL_AUTH_USER,
        to: req.query.user as string,
        subject: 'Passwort vergessen: Greenstream Project',
        text: 'Hier sollte jetzt ein toller Link sein mit dem du dein Passwort zurück setzten können solltest...\n',
        html: `<a href="http://appsterdb.ackermann.digital:3000/passwordRestore?token=${token}">http://appsterdb.ackermann.digital:3000/passwordRestore?token=${token}</a>"`
    };
    transporter.sendMail(mailOptions, function (error: Error | null, info: any) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    return res.status(200).send("200");
}

async function getUser(email: string): Promise<RowDataPacket> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT username, id, email, role, language FROM user WHERE email = ?;', [email]);
    return rows[0];
}