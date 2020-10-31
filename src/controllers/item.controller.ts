import pool from '../lib/db'
import { Item } from '../interface/item'
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { parseLanguage } from '../lib/helper';

export async function getItems(lang?: string): Promise<RowDataPacket[]> {
    const languages = parseLanguage(lang);
    const sql = "SELECT  item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.created_by_id, " +
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
        "AND item.reviewed = 1 " +
        "AND item.type_id = type.id " +
        "AND item.language IN (?);";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages]);
    return rows;
}

// email oder id?
export async function getItemsByUser(userId: number): Promise<RowDataPacket[]>{
    const sql = "SELECT  item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.created_by_id, " +
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
        "AND item.type_id = type.id " +
        "AND item.created_by_id = ?";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId]);
    return rows;
}

export async function getReviewedItemsByUser(userId: number): Promise<RowDataPacket[]>{
    const sql = "SELECT  item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.created_by_id, " +
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
        "AND item.type_id = type.id " +
        "AND item.reviewed = 1 " +
        "AND item.reviewed_by_id = ?";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId]);
    return rows;
}

export async function getItemsToReview(): Promise<RowDataPacket[]> {
    const sql = "SELECT  item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
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
        "AND item.type_id = type.id " +
        "AND item.reviewed = 0";
    const [row] = await pool.query<RowDataPacket[]>(sql);
    return row;
}

export async function addItem(item: Item): Promise<Item> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO item SET ?', [item]);
    item.id = rows.insertId;
    return item;
}

export async function getItem(id: number): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT     item.id, " +
        "item.likes, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
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
    return rows;
}

export async function deleteItem(id: number): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM item WHERE item.id = ?', [id]);
    return result;
}

export async function updateItem(id: number, updateItem: Item): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>('UPDATE item set ? WHERE id = ?', [updateItem, id]);
    return result;
}

export async function reviewItem(id:number, userId:number): Promise<RowDataPacket[]> {
    const [result] = await pool.execute<RowDataPacket[]>('UPDATE item set reviewed=1, reviewed_by_id=? WHERE id = ?', [userId, id]);
    return result;
}