import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2';
import DB from '../lib/db'
import { Item } from '../interface/item'
const pool = new DB().getPool();

export async function getType(req: Request, res: Response): Promise<Response> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type " +
        "WHERE " +
        "type.id = ?;", [req.params.typeId]);
    return res.json(rows);
}

export async function addType(req: Request, res: Response): Promise<Response> {
    await pool.query('INSERT INTO item SET ?', [req.body]);
    return res.json({
        message: 'New Item Created'
    });
}

export async function getTypes(req: Request, res: Response): Promise<Response> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type;");
    return res.json(rows);
}

export async function deleteType(req: Request, res: Response): Promise<Response> {
    await pool.query('DELETE FROM type WHERE type.id = ?', [req.params.typeId]);
    return res.json({
        message: 'Item deleted'
    });
}

export async function updateType(req: Request, res: Response): Promise<Response> {
    const id = req.params.typeId;
    const updateItem: Item = req.body;
    await pool.query('UPDATE type SET ? WHERE id = ?', [updateItem, id]);
    return res.json({
        message: 'Item Updated'
    });
}