import { Request, Response } from "express";
import { pipeline } from "nodemailer/lib/xoauth2";
import { storeItem } from "../controllers/item.controller"
import { Item } from "../interface/item";

import { ResultSetHeader, RowDataPacket } from 'mysql2';
import DB from "../lib/db";
const pool = new DB().getPool();

export async function responseAll(req: Request, res: Response): Promise<Response> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT  item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.topic_id, " +
        "item.type_id, " +
        "topic.name, " +
        "type.name, " +
        "type.view_external " +
        "FROM item, " +
        "topic, " +
        "type " +
        "WHERE " +
        "item.topic_id = topic.id " +
        "AND item.type_id = type.id;");
    const [topics] = await pool.query<RowDataPacket[]>("SELECT  id, " +
        "name " +
        "FROM " +
        "topic;");
    const [types] = await pool.query<RowDataPacket[]>("SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type;");
    return res.json({
        type: types,
        information_data: rows,
        topic: topics
    });
}