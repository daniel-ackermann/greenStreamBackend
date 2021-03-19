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
import { getUserByEmail } from './user.controller';


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
                await getUserByEmail(token.email)
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
    const rows = await getUserByEmail(user.email) as any;
    
    if (await bcrypt.compare(user.password, rows.password)) {
        const accessToken = jwt.sign({
            email: user.email,
            role: rows.role,
            id: rows.id
        }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "6 hours" });
        const expire = new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
        res.cookie('jwt', accessToken, { expires: expire, sameSite: "lax", secure: true, httpOnly: true });
        delete rows.password;

        // bad, but the app needs the token.
        rows.access_token = accessToken;
        rows.last_db_change = pool.getLastModified().getTime();
        return res.json(rows);
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
        text: '',
        html: `Hallo,
        <br><br>
        Jemand hat für ${req.query.user as string} ein neues Passwort für Greenstream angefordert.
        <br><br>
        Du kannst das Passwort mit folgendem Link ändern:
        <br><br>
        <a href="https://appsterdb.ackermann.digital/passwordRestore/${token}">Passwort ändern</a>
        <br><br>
        Wenn du das nicht warst ignoriere diese Nachricht bitte. Dein Passwort ändert sich dann  nicht.
        <br><br>
        Mit freundlichen Grüßen
        <br><br>
        dein Greenstream-Team
        `
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