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

export async function updateStatus(userId: number, data: UserData): Promise<number> {
    let sql = "SELECT * FROM user_data  WHERE user_id = ? AND id = ?;";
    const [result] = await pool.query<RowDataPacket[]>(sql, [userId, data.id]);
    data.user_id = userId;
    // does any entry exists in the database?
    if (result.length > 0) {
        if(data.watched !== undefined){
            result[0].watched = Math.floor( new Date().getTime() / 1000 );
        }
        if(data.liked !== undefined ){
            result[0].liked = data.liked;
        }
        if(data.watchlist !== undefined){
            result[0].watchlist = data.watchlist;
        }
        if(data.last_recommended !== undefined){
            result[0].last_recommended = data.last_recommended;
        }

        if (result[0].watched === null && result[0].liked === null && result[0].watchlist === null && result[0].last_recommended === null) {
            // delete if not longer needed => all are false
            sql = "DELETE FROM user_data WHERE user_id = ? AND id = ?;";
            pool.query(sql, [userId, data.id]);
        } else {
            // update entry
            sql = "UPDATE user_data SET watched=?, liked=? , watchlist=?, last_recommended=? WHERE user_id = ? AND id = ?;";
            const queryData = [
                result[0].watched,
                result[0].liked,
                result[0].watchlist,
                result[0].last_recommended,
                userId,
                data.id
            ];
            pool.query(sql, queryData);
        }
    } else {
        // create entry
        sql = "INSERT INTO user_data (user_id, id, watched, liked, watchlist, last_recommended) VALUES (?, ?, ?, ?, ?, ?)";
        const queryData = [
            data.user_id,
            data.id,
            data.watched,
            data.liked,
            data.watchlist,
            data.last_recommended
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
    const [result] = await pool.query<ResultSetHeader>('UPDATE item set explanation_id = ?, type_id = ?, url = ?, description = ?, title = ?, topic_id = ?, simple = ?, public=?, score = ? WHERE id = ?', [updateItem.explanation_id, updateItem.type.id, updateItem.url, updateItem.description, updateItem.title, updateItem.topic.id, updateItem.simple, updateItem.public, updateItem.score, id]);
    return result;
}

export async function reviewItem(id: number, userId: number): Promise<RowDataPacket[]> {
    const [result] = await pool.execute<RowDataPacket[]>('UPDATE item set reviewed=UNIX_TIMESTAMP(NOW()), reviewed_by_id=? WHERE id = ?', [userId, id]);
    return result;
}