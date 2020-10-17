"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.signOut = exports.signIn = exports.deleteAccount = exports.registerAccount = exports.checkStatus = exports.indexWelcome = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer = __importStar(require("nodemailer"));
const token_service_1 = __importDefault(require("../services/token.service"));
require("dotenv/config");
const db_1 = __importDefault(require("../lib/db"));
const pool = new db_1.default().getPool();
// import DB from '../lib/db';
// const pool = new DB().getPool();
// pool.query(...);
// oder:
// import DB from '../lib/db';
// DB.pool.query('asd', []);
const tokenService = new token_service_1.default();
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
    }
});
function indexWelcome(req, res) {
    return res.json('Welcome to the Api');
}
exports.indexWelcome = indexWelcome;
function checkStatus(req, res) {
    return res.status(200).send("true");
}
exports.checkStatus = checkStatus;
async function registerAccount(req, res) {
    const user = {
        username: req.body.username || "",
        password: req.body.password || "",
        email: req.body.email,
        role: req.body.role
    };
    const passwordHash = bcryptjs_1.default.hashSync(user.password, 10);
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?;', [user.email]);
    if (rows.length > 0) {
        console.log("Nutzer existiert bereits");
        return res.status(403).send("Account existiert bereits!");
    }
    await pool.execute('INSERT INTO user (`username`, `password`, `email`, `role`) VALUES (?, ?, ?, ?);', [user.username, passwordHash.toString(), user.email, user.role]).catch(err => {
        console.log(err);
    });
    return res.sendStatus(200);
}
exports.registerAccount = registerAccount;
async function deleteAccount(req, res) {
    try {
        const [rows] = await (await pool.query('DELETE FROM user WHERE email = ?;', [res.token.email]));
        if (rows.affectedRows == 1) {
            return res.sendStatus(200);
        }
        return res.sendStatus(500);
    }
    catch (e) {
        throw {
            error: e,
            message: "deleteAccount error"
        };
    }
}
exports.deleteAccount = deleteAccount;
async function signIn(req, res) {
    const user = req.body;
    // const emailHash =  bcrypt.hashSync(user.email, 10);
    const [rows] = await pool.query('SELECT * FROM user WHERE email = ?;', [user.email]);
    if (rows.length == 1 && await bcryptjs_1.default.compare(user.password, rows[0].password)) {
        const accessToken = jsonwebtoken_1.default.sign({ email: user.email, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "6 hours" });
        const expire = new Date(new Date().getTime() + 1000 * 60 * 60 * 6);
        res.cookie('jwt', accessToken, { expires: expire });
        return res.sendStatus(200);
    }
    else {
        return res.status(403).send("Username or password incorrect");
    }
}
exports.signIn = signIn;
async function signOut(req, res) {
    res.cookie("jwt", "", { expires: new Date() });
    return res.sendStatus(200);
}
exports.signOut = signOut;
async function sendEmail(req, res) {
    const token = tokenService.getNew(req.query.user, 24);
    const [rows] = await pool.query("SELECT * FROM user WHERE email = ?", [req.query.user]);
    if (rows.length == 0) {
        console.log("Emailversand an nicht exixstente Addresse!");
        return res.status(200).send("200");
    }
    const mailOptions = {
        from: process.env.EMAIL_AUTH_USER,
        to: req.query.user,
        subject: 'Passwort vergessen: Greenstream Project',
        text: 'Hier sollte jetzt ein toller Link sein mit dem du dein Passwort zurück setzten können solltest...\n',
        html: `<a href="http://localhost:3000/passwordRestore?token=${token}">http://localhost:3000/passwordRestore?token=${token}</a>"`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
    return res.status(200).send("200");
}
exports.sendEmail = sendEmail;
