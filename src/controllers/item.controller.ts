import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Item } from '../interface/item';
import { UserData } from '../interface/userdata';
import pool from '../lib/db';

export async function addItem(item: Item): Promise<Item> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO item SET ?', [item]);
    item.id = rows.insertId;
    return item;
}

export async function getItem(id: number): Promise<RowDataPacket> {
    const sql = "SELECT     item.id, " +
        "item.likes, " +
        "item.marked, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.public, " +
        "item.score, " +
        "item.readingDuration, " +
        "JSON_OBJECT( " +
            "'id', type.id, " +
            "'name', type.name, " +
            "'icon', type.icon, " +
            "'view_external', type.view_external " +
        " ) as type, " +
        "JSON_OBJECT( " +
            "'name', topic.name, " +
            "'id', topic.id, " +
            "'language', topic.language " +
        " ) as topic, " +
        "JSON_OBJECT( " +
            "'code', language.code, " +
            "'name', language.name " +
        " ) as language " +
        "FROM item " +
        "INNER JOIN type ON type.id = item.type_id " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN language ON language.code = item.language " +
        "WHERE item.id=?;";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [id]);
    return rows[0];
}

export async function setItemStatus(user: number, item: number, type: string, value: number | null): Promise<number> {
    let sql = "SELECT * FROM user_data  WHERE user_id = ? AND id = ?;";
    const [result] = await pool.query<RowDataPacket[]>(sql, [user, item]);
    if (result.length > 0) {
        result[0][type] = value;
        if (result[0].liked === null && result[0].watchlist === null && result[0].watched === null) {
            // delete if not longer needed => all are NULL
            sql = "DELETE FROM user_data WHERE user_id = ? AND id = ?;";
            pool.query(sql, [user, item]);
        } else {
            sql = "UPDATE user_data SET " + type + " = ? WHERE user_id = ? AND id = ?;";
            const queryData = [
                value,
                user,
                item
            ];
            pool.query(sql, queryData);
        }
    } else {
        sql = "INSERT INTO user_data (user_id, id, " + type + ") VALUES (?, ?, ?)";
        const queryData = [
            user,
            item,
            value
        ];
        pool.query(sql, queryData);
    }
    return 200;
}

export async function getItemWithUserData(id: number, userId: number): Promise<RowDataPacket> {
    const sql = "SELECT     item.id, " +
        "item.likes, " +
        "item.marked, " +
        "item.explanation_id, " +
        "item.url, " +
        "item.description, " +
        "item.title, " +
        "item.simple, " +
        "item.reviewed, " +
        "item.public, " +
        "item.score, " +
        "item.readingDuration, " +
        "JSON_OBJECT( " +
            "'id', type.id, " +
            "'name', type.name, " +
            "'icon', type.icon, " +
            "'view_external', type.view_external " +
        " ) as type, " +
        "JSON_OBJECT( " +
            "'name', topic.name, " +
            "'id', topic.id, " +
            "'language', topic.language " +
        " ) as topic, " +
        "JSON_OBJECT( " +
            "'code', language.code, " +
            "'name', language.name " +
        " ) as language, " +
        "user_data.liked, " +
        "user_data.watched, " +
        "user_data.watchlist, " +
        "user_data.last_recommended " +
        "FROM item " +
        "INNER JOIN type ON type.id = item.type_id " +
        "INNER JOIN topic ON topic.id = item.topic_id " +
        "INNER JOIN language ON language.code = item.language " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.id=?;";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, id]);
    return rows[0];
}


export async function deleteItem(id: number): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>('DELETE FROM item WHERE item.id = ?', [id]);
    return result;
}

export async function updateItem(id: number, updateItem: Item): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>('UPDATE item set explanation_id = ?, type_id = ?, url = ?, description = ?, title = ?, topic_id = ?, simple = ?, public=?, score = ?, readingDuration = ? WHERE id = ?', [updateItem.explanation_id, updateItem.type.id, updateItem.url, updateItem.description, updateItem.title, updateItem.topic.id, updateItem.simple, updateItem.public, updateItem.score, updateItem.readingDuration, id]);
    return result;
}

export async function reviewItem(id: number, userId: number): Promise<RowDataPacket[]> {
    const [result] = await pool.execute<RowDataPacket[]>('UPDATE item set reviewed=UNIX_TIMESTAMP(NOW()), reviewed_by_id=? WHERE id = ?', [userId, id]);
    return result;
}