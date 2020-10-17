"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
function authenticate(req, res, next) {
    const authHeader = req.cookies.jwt;
    if (authHeader) {
        const token = authHeader.trim();
        try {
            res.token = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
            // Sollte ich hier prüfen ob der nutzer noch in der db ist? Nee der token läuft schnell genug ab...
            if (res.token.exp > Math.floor(Date.now() / 1000) && res.token.role == "admin") {
                next();
            }
            else {
                return res.send({ message: "Bitte verlängern!" });
            }
        }
        catch (error) {
            return res.status(401).send("401");
        }
    }
    return res.status(401).send("401");
}
exports.authenticate = authenticate;
