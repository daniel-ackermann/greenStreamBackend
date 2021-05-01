import pool from '../lib/db'
import { RowDataPacket } from 'mysql2';

export async function getCollections(limit: number, startId = 0): Promise<RowDataPacket[]> {
    const sql = " SELECT id, " +
                        "title, " +
                        "language, " +
                        "JSON_OBJECT( " +
                            "'name', username, " +
                            "'id', user.id, " +
                        ") as owner " +
                        "FROM collection, user " +
                        "WHERE user.id = collection.created_by " +
                        "AND collection.id > ? " +
                        "ORDER BY collection.id " +
                        "LIMIT ? ";
    const [row] = await pool.query<RowDataPacket[]>(sql, [startId, limit]);
    return row;
}

export async function getCollectionsByUser(userId:number, limit: number, startId = 0): Promise<RowDataPacket[]> {
    const sql = " SELECT id, " +
                        "title, " +
                        "language, " +
                        "JSON_OBJECT( " +
                            "'name', username, " +
                            "'id', user.id, " +
                        ") as owner " +
                        "FROM collection, user " +
                        "WHERE user.id = collection.created_by " +
                        "AND user.id = ? " +
                        "AND collection.id > ? " +
                        "ORDER BY collection.id " +
                        "LIMIT ? ";
    const [row] = await pool.query<RowDataPacket[]>(sql, [userId, startId, limit]);
    return row;
}