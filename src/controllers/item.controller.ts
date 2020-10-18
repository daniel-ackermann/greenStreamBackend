import { Request, Response } from 'express'
import DB from '../lib/db'
import { Item } from '../interface/item'
import { ResultSetHeader, RowDataPacket } from 'mysql2';
const pool = new DB().getPool();

export async function getItems(req: Request, res: Response): Promise<Response> {

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
    return res.json(rows);
}

export async function addItem(req: Request, res: Response) {
    storeItem(req.body).then(data => {
        return res.json(data);
    });
}

export async function storeItem(data: Item): Promise<Item> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO item SET ?', [data]);
    data.id = rows.insertId;
    return data;
}

export async function getItem(req: Request, res: Response): Promise<Response> {
    const id = req.params.itemId;
    const [rows] = await pool.query<RowDataPacket[]>("SELECT     item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.type_id, " +
        "item.topic_id, " +
        "topic.name, " +
        "type.name, " +
        "type.view_external FROM item, " +
        "topic, " +
        "type " +
        "WHERE " +
        "item.topic_id = topic.id " +
        "AND item.type_id = type.id " +
        "AND item.id = ?", [id]);
    return res.json(rows);
}

export async function deleteItem(req: Request, res: Response): Promise<Response> {
    const id = req.params.itemId;
    await pool.query('DELETE FROM item WHERE item.id = ?', [id]);
    return res.json({
        message: 'Item deleted'
    });
}

export async function updateItem(req: Request, res: Response): Promise<Response> {
    const id = req.params.itemId;
    const updateItem: Item = req.body as Item;
    await pool.query('UPDATE item set ? WHERE id = ?', [updateItem, id]);
    return res.json({
        message: 'Item Updated'
    });
}