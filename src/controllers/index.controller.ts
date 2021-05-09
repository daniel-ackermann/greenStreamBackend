import { Request, Response } from '../interface/custom.request'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, UserWithPassword } from '../interface/user'
import * as nodemailer from 'nodemailer';
import TokenService from '../services/token.service';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import 'dotenv/config'
import pool from '../lib/db';
import { hasValidToken } from '../middleware';
import { cookieToken } from '../interface/cookieToken';
import { getUserByEmail, getUserByEmailWithPassword, updateUserById } from './user.controller';
import fs from 'fs';
import { promisify } from 'util';
import handlebars from 'handlebars';
const readFile = promisify(fs.readFile);
import juice from 'juice';
import { environment } from '../env/environment';
import { removeUserTopics } from './user.topic.controller';
import { removeUserLanguages } from './user.language.controller';
import { Language } from '../interface/language';
import { Topic } from '../interface/topic';


// import pool from '../lib/db';
// pool.query(...);
// oder:
// import pool from '../lib/db';
// DB.pool.query('asd', []);




const tokenService = new TokenService();
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "465"),
    secure: true,
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
    const passwordHash = bcrypt.hashSync(req.body.password, 10);
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM user WHERE email = ?;', [req.body.email]);
    if (rows.length > 0) {
        console.log("Nutzer existiert bereits");
        return res.status(403).json("Account existiert bereits!");
    }
    const [result] = await pool.query<ResultSetHeader>('INSERT INTO user (`username`, `password`, `email`, `role`) VALUES (?, ?, ?, "member");', [req.body.email.split('@')[0], passwordHash.toString(), req.body.email]);
    updateUserById(result.insertId, {
        id: result.insertId,
        topics:environment.defaultTopics,
        languages: environment.defaultLanguages 
    });
    return res.sendStatus(200);
}

export async function deleteAccount(email: string, token: cookieToken): Promise<boolean> {
    if (email == token.email || token.role == "admin") {
        const user = await getUserByEmail(token.email);
        await removeUserTopics(token.id, user.topics.map((topic:Topic) => {
            return topic.id;
        }));
        await removeUserLanguages(token.id, user.languages.map( (lang:Language) => {
            return lang.code;
        }));
        const [rows] = await (await pool.query<ResultSetHeader>('DELETE FROM user WHERE email = ?;', [token.email]));
        if (rows.affectedRows == 1) {
            return true;
        }
    }
    return false;
}

export async function signIn(req: Request, res: Response): Promise<Response> {
    const user: UserWithPassword = req.body as UserWithPassword;
    try {
        const rows = await getUserByEmailWithPassword(user.email) as any;
        if (await bcrypt.compare(user.password, rows.password)) {
            const accessToken = jwt.sign({
                email: user.email,
                role: rows.role,
                id: rows.id
            }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "6 hours" });
            const expire = new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
            res.cookie('jwt', accessToken, { expires: expire, sameSite: "lax", secure: true, httpOnly: true });
            const result: any = rows;
            delete result.password;
    
            // bad, but the app needs the token.
            result.access_token = accessToken;
            return res.json(result);
        } else {
            return res.status(403).json("Username or password incorrect");
        }
    } catch (e) {
        console.log(e);
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
    const html = await readFile('./src/emails/restorePassword.html', 'utf8');
    const template = handlebars.compile(html);
    const data = {
        username: rows[0].username,
        token: token
    }
    const htmlToSend = template(data);
    const mailOptions = {
        from: process.env.EMAIL_AUTH_USER,
        to: req.query.user as string,
        subject: 'Greenstream Project: Passwort zurücksetzen',
        text: `Bitte folgen Sie folgendem Link: https://appsterdb.ackermann.digital/passwordRestore/${token}`,
        html: juice(htmlToSend)
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