import pool from '../lib/db'
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Collection } from '../interface/collection';

export async function deleteCollection(id: number):Promise<ResultSetHeader> {
    const sql = "DELETE FROM collections WHERE id = ? ";
    const [result] = await pool.execute<ResultSetHeader>(sql, [id]);
    if(result.affectedRows > 0 ){
        const sql = "DELETE FROM collection_items WHERE collection = ? ";
        await pool.execute<ResultSetHeader>(sql, [id]);
    } 
    return result; 
}

export async function updateCollection(collection:Collection):Promise<ResultSetHeader> {
    const [rows] = await pool.query<ResultSetHeader>('UPDATE collection SET title = ?, language = ?, created_by = ? WHERE id = ? ', [collection.title, collection.language, collection.owner.id, collection.id]);
    return rows;
}

export async function addCollection(collection:Collection):Promise<Collection> {
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO collection SET title = ?, language = ?, created_by = ? ', [collection.title, collection.language, collection.owner.id]);
    collection.id = rows.insertId;
    return collection;
}

export async function getCollection(id:number):Promise<RowDataPacket> {
    const sql = " SELECT id, " +
                        "title, " +
                        "language, " +
                        "JSON_OBJECT( " +
                            "'name', username, " +
                            "'id', user.id, " +
                        ") as owner " +
                        "FROM collection, user " +
                        "WHERE collection.id = ? ";
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    return row[0];
}


export async function getCollectionItems(id: number, user: number, start: number, limit = 0): Promise<RowDataPacket[]> {
    const queryData =  [id, start, limit];
    let sql = "SELECT  item.title, " +
                        "item.url, " +
                        "item.id, " +
                        "item.likes ";
if(user !== undefined){
    sql +=              ", user_data.liked, user_data.watchlist ";
}
sql +=                 "FROM item ";
if(user !== undefined){
    sql +=      "INNER JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? ";
    queryData.unshift(user);
}
sql +=          "INNER JOIN collection_items ON (item.id = collection_items.item AND collection_items.collection = ? ) " +
                "WHERE id > ? " +
                "ORDER BY collection_items.item " +
                "LIMIT ? ";
    const [row] = await pool.query<RowDataPacket[]>(sql, queryData);
    return row; 
}

export async function deleteCollectionItem(collection: number, item: number): Promise<number>{
    const sql = "DELETE FROM collection_items WHERE collection = ? AND item = ? ";
    const [row] = await pool.query<ResultSetHeader>(sql, [collection, item]);
    return row.serverStatus;
}

export async function addCollectionItem(collection:number, item:number): Promise<number> {
    const sql = "INSERT INTO collection_items SET item = ?, collection = ?; ";
    const [row] = await pool.query<ResultSetHeader>(sql, [item, collection]);
    return row.serverStatus;
}