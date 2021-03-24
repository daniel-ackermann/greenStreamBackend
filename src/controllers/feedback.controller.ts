import pool from '../lib/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Feedback } from '../interface/feedback';

export async function addFeedback(feedback: Feedback): Promise<ResultSetHeader> {
    const sql = `INSERT INTO information_feedback SET information_id = ?, feedback = ?, created_by_id = ?`;
    const [rows] = await pool.query<ResultSetHeader>(sql, [feedback.information_id, feedback.feedback, feedback.created_by_id]);
    return rows;
}

export async function removeFeedback(feedbackId: number): Promise<ResultSetHeader> {
    const sql = `DELETE FROM information_feedback WHERE id=?`;
    const [rows] = await pool.execute<ResultSetHeader>(sql, [feedbackId]);
    return rows;
}

export async function getFeedbacks(): Promise<RowDataPacket[]> {
    const sql = `SELECT f.*, user.username, item.* FROM information_feedback f, user, item WHERE user.id = f.created_by_id AND item.id = f.information_id;`;
    const [row] = await pool.query<RowDataPacket[]>(sql);
    return row;
}

export async function getFeedback(id:number): Promise<RowDataPacket[]> {
    const sql = `f.*, user.username FROM information_feedback f, user WHERE user.id = f.created_by_id AND id=?;`;
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    return row;
}

export async function getFeedbackByItem(id:number): Promise<RowDataPacket[]> {
    const sql = `SELECT f.*, user.username FROM information_feedback f, user WHERE user.id = f.created_by_id AND information_id=?;`;
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    return row;
}