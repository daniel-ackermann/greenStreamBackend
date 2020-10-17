import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2';
import DB from '../lib/db'
import { Item } from '../interface/item'
const pool = new DB().getPool();

export async function getTopic(req: Request, res: Response): Promise<Response> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT  id, " +
        "name " +
        "FROM " +
        "topic " +
        "WHERE " +
        "id = ?;", [req.params.typeId]);
    return res.json(rows);
}

export async function addTopic(req: Request, res: Response): Promise<Response> {
    await pool.query('INSERT INTO topic SET ?', [req.body]);
    return res.json({
        message: 'New Topic Created'
    });
}

export async function getTopics(req: Request, res: Response): Promise<Response> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT  id, " +
        "name " +
        "FROM " +
        "topic;");
    return res.json(rows);
}

export async function deleteTopic(req: Request, res: Response): Promise<Response> {
    const id = req.params.topicId;
    await pool.query('DELETE FROM topic WHERE topic.id = ?', [id]);
    return res.json({
        message: 'Topic deleted'
    });
}

export async function updateTopic(req: Request, res: Response): Promise<Response> {
    const id = req.params.topicId;
    const updateItem: Item = req.body;
    await pool.query('UPDATE topic SET ? WHERE id = ?', [updateItem, id]);
    return res.json({
        message: 'Topic Updated'
    });
}