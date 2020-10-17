import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"
import { cookieToken } from "./interface/cookieToken";

export function authenticate(req: Request, res: any, next: NextFunction): any {
    const authHeader = req.cookies.jwt;
    if (authHeader) {
        const token: string = authHeader.trim();
        try {
            res.token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as cookieToken;
            // Sollte ich hier prüfen ob der nutzer noch in der db ist? Nee der token läuft schnell genug ab...
            if (res.token.exp > Math.floor(Date.now() / 1000) && res.token.role == "admin") {
                next();
            } else {
                return res.send({ message: "Bitte verlängern!" });
            }
        } catch (error) {
            return res.status(401).send("401");
        }
    }
    return res.status(401).send("401");
}