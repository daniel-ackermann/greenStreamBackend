import pool from '../lib/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Feedback } from '../interface/feedback';

export async function addFeedback(feedback: Feedback): Promise<ResultSetHeader> {
    const sql = `INSERT INTO information_feedback SET ?`;
    const [rows] = await pool.query<ResultSetHeader>(sql, [feedback]);
    return rows;
}

export async function removeFeedback(feedbackId: number): Promise<ResultSetHeader> {
    const sql = `DELETE FROM information_feedback WHERE id=?`;
    const [rows] = await pool.execute<ResultSetHeader>(sql, [feedbackId]);
    return rows;
}

export async function getFeedbacks(): Promise<RowDataPacket[]> {
    const sql = `SELECT * FROM information_feedback;`;
    const [row] = await pool.query<RowDataPacket[]>(sql);
    return row;
}

export async function getFeedback(id:number): Promise<RowDataPacket[]> {
    const sql = `SELECT * FROM information_feedback where id=?;`;
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    return row;
}

export async function getFeedbackByItem(id:number): Promise<RowDataPacket[]> {
    const sql = `SELECT * FROM information_feedback WHERE information_id=?;`;
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    return row;
}