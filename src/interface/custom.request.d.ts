import { Response, Request } from "express";

export interface Request extends Request {
    token?: false|cookieToken;
}
export interface Response extends Response {
    token?: false|cookieToken;
}