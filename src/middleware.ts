import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import "dotenv/config"
import { cookieToken } from "./interface/cookieToken";

export function authenticate(req: Request, res: any, next: NextFunction): any {
    const authHeader = req.cookies.jwt;
    if (authHeader && hasValidToken(authHeader)) {
        next();
    } else {
        return res.status(401).send("401");
    }
}

export function hasValidToken(authHeader: string): boolean{
    try {
        const token = jwt.verify(authHeader.trim(), process.env.ACCESS_TOKEN_SECRET as string) as cookieToken;
        // Sollte ich hier prüfen ob der nutzer noch in der db ist? Nee der token läuft schnell genug ab...
        if (token.exp > Math.floor(Date.now() / 1000) && token.role == "admin") {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}