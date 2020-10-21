import { Response } from "express";
import { cookieToken } from "./cookieToken";

export interface User {
    username: string;
    password: string;
    email: string;
    role: string;
}