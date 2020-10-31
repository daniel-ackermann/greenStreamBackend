import jwt from "jsonwebtoken"
import "dotenv/config"
import { Response, NextFunction, Request } from "express";
import { cookieToken } from "./interface/cookieToken";

export function authenticate(req: Request, res: Response, next: NextFunction): void|Response{
    const authHeader = req.cookies.jwt;
    req.token = hasValidToken(authHeader);
    if (authHeader &&  req.token != false ) {
        next();
    } else {
        return res.status(401).send("401");
    }
}

export function hasValidToken(authHeader: string): false|cookieToken{
    try {
        const token = jwt.verify(authHeader.trim(), process.env.ACCESS_TOKEN_SECRET as string) as cookieToken;
        // Sollte ich hier prüfen ob der nutzer noch in der db ist? Nee der token läuft schnell genug ab...
        if (token.exp > Math.floor(Date.now() / 1000) && token.role === "admin" || token.role === "member") {
            return token;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}