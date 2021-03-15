import { Request, Response } from "express";
import pool from "../lib/db";
import { getAllItems } from "./items.controller";
import { getTopics } from "./topic.controller";
import { getTypes } from "./type.controller";
import { getLanguages } from "./language.controller";

export async function responseAll(req: Request, res: Response): Promise<Response> {

    res.setHeader('Last-Modified', pool.getLastModified().toUTCString());

    if (req.headers["if-modified-since"]) {
        if (pool.getLastModified().getTime() < new Date(req.headers["if-modified-since"] as string).getTime()) {
            return res.status(304).send(304);
        }
    }
    const rows = await getAllItems(req.headers["accept-language"]);
    const topics = await getTopics(req.headers["accept-language"]);
    const types = await getTypes(req.headers["accept-language"]);
    return res.json({
        type: types,
        information_data: rows,
        topic: topics,
        languages: getLanguages()
    });
}