import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2';
import pool from '../lib/db'
import { Item } from '../interface/item'
import { parseLanguage } from '../lib/helper';


export async function getType(req: Request, res: Response): Promise<Response> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type " +
        "WHERE " +
        "type.id = ?;", [req.params.typeId]);
    return res.json(rows[0]);
}

export async function addType(req: Request, res: Response): Promise<Response> {
    await pool.query('INSERT INTO item SET ?', [req.body]);
    return res.json({
        message: 'New Item Created'
    });
}

export async function getTypes(language?: string): Promise<RowDataPacket[]> {
    const languages = parseLanguage(language);
    const sql = "SELECT  type.id, " +
        "type.name, " +
        "type.view_external " +
        "FROM " +
        "type " +
        "WHERE language IN (?) ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages]);
    return rows;
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