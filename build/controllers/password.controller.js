"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordRestore = exports.passwordRestoreRequest = void 0;
const path_1 = __importDefault(require("path"));
const token_service_1 = __importDefault(require("../services/token.service"));
const db_1 = __importDefault(require("../lib/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pool = new db_1.default().getPool();
const tokenService = new token_service_1.default();
async function passwordRestoreRequest(req, res) {
    const token = tokenService.valid(req.query.token);
    if (token.valid) {
        res.cookie('tk', tokenService.getNew(token.owner, 1), { expires: new Date(new Date().getTime() + 1000 * 60 * 60) });
        return res.sendFile('doofeStruktur/index.html', { root: path_1.default.resolve(__dirname, '../../html') });
    }
    else {
        return res.send("Something went wrong!");
    }
}
exports.passwordRestoreRequest = passwordRestoreRequest;
async function passwordRestore(req, res) {
    const token = tokenService.valid(req.cookies.tk);
    if (token.valid) {
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 10);
        await pool.execute(`UPDATE user SET password=? WHERE email=?`, [passwordHash.toString(), token.owner]);
        return res.send("Erfolgreich gespeichert!");
    }
    else {
        return res.send("Ein Fehler ist aufgetreten!");
    }
}
exports.passwordRestore = passwordRestore;
