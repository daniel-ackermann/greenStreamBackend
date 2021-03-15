import pool from '../lib/db'
import { Item } from '../interface/item'
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { parseLanguage } from '../lib/helper';
import { UserData } from '../interface/userdata';

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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "WHERE item.language IN (?) " +
        "AND item.reviewed = 1  ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages]);
    return rows;
}

export async function getItemsWithUserData(userId: number, lang?: string): Promise<RowDataPacket[]> {
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended, " +
        "type.view_external " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.language IN (?) AND topic.id = item.topic_id AND type.id = item.type_id " +
        "AND item.reviewed = 1 ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, languages]);
    return rows;
}

export async function getSuggestedItems(userId: number, page:number, lang?:string): Promise<RowDataPacket[]> {
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended, " +
        "type.view_external " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.language IN (?) AND topic.id = item.topic_id AND type.id = item.type_id " +
        "AND item.reviewed = 1 ORDER BY item.id " +
        "AND item.id > " + page * 10 +
        "LIMIT 10";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, languages]);
    return rows;
}

// email oder id?
export async function getItemsByUser(userId: number): Promise<RowDataPacket[]> {
    const sql = "SELECT  item.id, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.created_by_id, " +
        "item.topic_id, " +
        "item.type_id, " +
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended " +
        "FROM item " +
        "INNER JOIN type ON type.id = item.type_id " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.created_by_id = ? AND item.topic_id = topic.id AND type.id = item.type_id ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, userId]);
    return rows;
}

export async function getInteractedItemsByUser(userId: number): Promise<RowDataPacket[]> {
    const sql = "SELECT  item.id, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended " +
        "FROM item " +
        "INNER JOIN user_data ON user_data.id = item.id " +
        "WHERE item.created_by_id = ? AND user_data.user_id = ?  ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, userId]);
    return rows;
}

export async function getLikedItems(id: number): Promise<RowDataPacket[]> {
    const sql = "SELECT  item.id, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.language, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.created_by_id, " +
        "item.topic_id, " +
        "item.type_id, " +
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended " +
        "FROM item " +
        "INNER JOIN type ON type.id = item.type_id " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN user_data ON user_data.id = item.id AND user_data.liked = 1 AND user_data.user_id = ?  ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows;
}

export async function getWatchedItems(id: number): Promise<RowDataPacket[]> {
    const sql = "SELECT item.id, " +
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
    "topic.name as topic_name, " +
    "type.name as type_name, " +
    "type.icon, " +
    "type.view_external, " +
    "user_data.liked, " +
    "user_data.watched, " +
    "user_data.watchlist, " +
    "user_data.id as d_id, " +
    "user_data.last_recommended " +
    "FROM item " +
    "INNER JOIN type ON type.id = item.type_id " +
    "INNER JOIN topic ON topic.id = item.topic_id " +
    "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
    "WHERE user_data.watched=1 " +
    "ORDER BY d_id desc;";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows;
}

export async function getWatchListItems(id: number): Promise<RowDataPacket[]> {
    const sql = "SELECT   item.id, " +
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "user_data.id as d_id, " +
        "user_data.last_recommended " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE user_data.watchlist=1 " +
        "ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows;
}

export async function getReviewedItemsByUser(userId: number): Promise<RowDataPacket[]> {
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.reviewed=1 " +
        "AND item.reviewed_by_id = ?  ORDER BY item.id";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, userId]);
    return rows;
}

export async function getItemsToReview(userId: number): Promise<RowDataPacket[]> {
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) * 1000 as last_recommended " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.reviewed = 0  ORDER BY item.id";
    const [row] = await pool.query<RowDataPacket[]>(sql, [userId]);
    return row;
}

export async function addItem(item: Item): Promise<Item> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO item SET ?', [item]);
    item.id = rows.insertId;
    return item;
}

export async function getItem(id: number): Promise<RowDataPacket[]> {
    const sql = "SELECT     item.id, " +
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "WHERE item.id=?;";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows;
}

export async function getItemWithUserData(id: number, userId: number): Promise<RowDataPacket[]> {
    const sql = "SELECT     item.id, " +
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
        "topic.name as topic_name, " +
        "type.name as type_name, " +
        "type.icon, " +
        "type.view_external, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "UNIX_TIMESTAMP(user_data.last_recommended) as last_recommended " +
        "FROM item " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN type ON type.id = item.type_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.id=?;";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, id]);
    return rows;
}

export async function updateStatus(userId: number, data: UserData): Promise<number> {
    let sql = "SELECT EXISTS (SELECT * FROM user_data  WHERE user_id = ? AND id = ?) as value;";
    const [result] = await pool.query<RowDataPacket[]>(sql, [userId, data.id]);
    data.user_id = userId;
    // does any entry exists in the database?
    if (result[0].value) {
        if (!data.watched && !data.liked && !data.watchlist) {
            // delete if not longer needed => all are false
            sql = "DELETE FROM user_data WHERE user_id = ? AND id = ?";
            pool.query(sql, [userId, data.id]);
        } else {
            // update entry
            sql = "UPDATE user_data SET ? WHERE user_id = ? AND id = ?";
            pool.query(sql, [data, userId, data.id]);
        }
    } else {
        // create entry
        sql = "INSERT INTO user_data SET ?";
        pool.query(sql, [data]);
    }
    return 200;
}

export async function deleteItem(id: number): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM item WHERE item.id = ?', [id]);
    return result;
}

export async function updateItem(id: number, updateItem: Item): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>('UPDATE item set ? WHERE id = ?', [updateItem, id]);
    return result;
}

export async function reviewItem(id: number, userId: number): Promise<RowDataPacket[]> {
    const [result] = await pool.execute<RowDataPacket[]>('UPDATE item set reviewed=1, reviewed_by_id=? WHERE id = ?', [userId, id]);
    return result;
}