import { RowDataPacket } from "mysql2";
import { Language } from "../interface/language";
import pool from '../lib/db';

export async function getLanguages(): Promise<RowDataPacket[]> {
    const sql = "select name, code from language";
    const [rows] = await pool.query<RowDataPacket[]>(sql, []);
    return rows;
}