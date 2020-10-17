import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import ResponseWithUser, { User } from '../interface/user'
import * as nodemailer from 'nodemailer';
import TokenService from '../services/token.service';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import 'dotenv/config'
import DB from '../lib/db';
const pool = new DB().getPool();


// import DB from '../lib/db';
// const pool = new DB().getPool();
// pool.query(...);
// oder:
// import DB from '../lib/db';
// DB.pool.query('asd', []);




const tokenService = new TokenService();
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    }
});

export function indexWelcome(req: Request, res: Response): Response {
    return res.json('Welcome to the Api');
}

export function checkStatus(req: Request, res: Response): Response {
    return res.status(200).send("true");
}

export async function registerAccount(req: Request, res: Response): Promise<Response> {
    const user: User = {
        username: req.body.username || "",
        password: req.body.password || "",
        email: req.body.email,
        role: req.body.role
    }
    const passwordHash = bcrypt.hashSync(user.password, 10);
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user WHERE email = ?;', [user.email]);
    if (rows.length > 0) {
        console.log("Nutzer existiert bereits");
        return res.status(403).send("Account existiert bereits!");
    }
    await pool.execute('INSERT INTO user (`username`, `password`, `email`, `role`) VALUES (?, ?, ?, ?);', [user.username, passwordHash.toString(), user.email, user.role]).catch(err => {
        console.log(err);
    })
    return res.sendStatus(200);
}

export async function deleteAccount(req: Request, res: any): Promise<Response> {
    try {
        const [rows] = await (await pool.query<ResultSetHeader>('DELETE FROM user WHERE email = ?;', [res.token.email]));
        if (rows.affectedRows == 1) {
            return res.sendStatus(200);
        }
        return res.sendStatus(500);
    } catch (e) {
        throw {
            error: e,
            message: "deleteAccount error"
        }
    }
}

export async function signIn(req: Request, res: Response): Promise<Response> {
    const user: User = req.body as User;
    // const emailHash =  bcrypt.hashSync(user.email, 10);
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user WHERE email = ?;', [user.email]);
    if (rows.length == 1 && await bcrypt.compare(user.password, rows[0].password)) {
        const accessToken = jwt.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "6 hours" });
        const expire = new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
        res.cookie('jwt', accessToken, { expires: expire });
        return res.sendStatus(200);
    } else {
        return res.status(403).send("Username or password incorrect");
    }
}

export async function signOut(req: Request, res: Response): Promise<Response> {
    res.cookie("jwt", "", { expires: new Date() });
    return res.sendStatus(200);
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
        html: `<a href="http://localhost:3000/passwordRestore?token=${token}">http://localhost:3000/passwordRestore?token=${token}</a>"`
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