import { RowDataPacket } from 'mysql2';
import db from '../lib/db';

export async function getLabelsOfItem(itemId: number):Promise<RowDataPacket[]> {
    const sql = "SELECT count(label) as count, label.name, label.color FROM information_feedback f, label WHERE f.information_id = ? AND f.label = label.id GROUP BY label ";
    const [row] = await db.query<RowDataPacket[]>(sql, [itemId]);
    return row;
}

export async function getLabels():Promise<RowDataPacket[]>{
    const sql = "SELECT label.language, label.name, label.color, label.id FROM label ";
    const [row] = await db.query<RowDataPacket[]>(sql);
    return row;
}