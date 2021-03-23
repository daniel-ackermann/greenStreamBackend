import pool from '../lib/db'
import { RowDataPacket } from 'mysql2';
import { parseLanguage } from '../lib/helper';
import { environment } from '../env/environment';

// Designentscheidung: https://mariadb.com/kb/en/pagination-optimization/


export async function getAllItems(lang?: string): Promise<RowDataPacket[]> {
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
        "AND item.reviewed = 1 "+
        "ORDER BY item.id ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages]);
    return rows;
}

export async function getItems(id:number, limit: number, lang = "", topics: string[]| number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = environment.defaultTopics;
    }
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
        "AND item.reviewed = 1 " +
        "AND item.id > ? " +
        "AND item.topic_id IN (?) " +
        "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages, id, topics, limit]);
    return rows;
}

export async function getItemsWithUserData(userId: number, id:number, limit: number,topics: string[]|number[],  lang?: string): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = environment.defaultTopics;
    }
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
        "WHERE item.language IN (?) " +
        "AND item.topic_id IN (?) " +
        "AND item.reviewed = 1 " +
        "AND item.id > ? " +
        "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, languages, topics, id, limit]);
    return rows;
}

export async function getSuggestedItems(userId: number, id:number, limit: number, lang?:string): Promise<RowDataPacket[]> {
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
        "INNER JOIN user_topics ON user_topics.topic = item.topic_id " +
        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
        "WHERE item.language IN (?) " +
        "AND item.reviewed = 1 " +
        "AND item.id > ? " +
        "AND user_topics.user = ? " +
        "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, languages, id, userId, limit]);
    return rows;
}

// email oder id?
export async function getItemsByUser(userId: number, limit:number, startId: number,topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = environment.defaultTopics;
    }
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
        "WHERE item.created_by_id = ? " +
        "AND item.topic_id = topic.id " +
        "AND type.id = item.type_id " +
        "AND item.id > ? " +
        "AND item.topic_id IN (?) " +
        "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, userId, startId,  topics, limit]);
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

export async function getLikedItems(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT  item.id, " +
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
        "INNER JOIN user_data ON user_data.id = item.id " +
            "AND user_data.liked = 1 " +
            "AND user_data.user_id = ? " +
        "WHERE item.id > ? ";
        if(topics.length != 0){
            sql += "AND item.topic_id IN (?) ";
            queryData = [userId, startId, topics, limit];
        }
        sql += "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getWatchedItems(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT item.id, " +
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
    "AND item.id > ? ";
    if(topics.length != 0){
        sql += "AND item.topic_id IN (?) ";
        queryData = [userId, startId, topics, limit];
    }
    sql += "ORDER BY item.id " +
    "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getWatchListItems(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT   item.id, " +
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
        "AND item.id > ? ";
        if(topics.length != 0){
            sql += "AND item.topic_id IN (?) ";
            queryData = [userId, startId, topics, limit];
        }
        sql += "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getReviewedItemsByUser(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, userId, startId, limit];
    let sql = "SELECT  item.id, " +
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
        "AND item.reviewed_by_id = ? " +
        "AND item.id > ? ";
        if(topics.length != 0){
            sql += "AND item.topic_id IN (?) ";
            queryData = [userId, userId, startId, topics, limit];
        }
        sql += "ORDER BY item.id " +
        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getItemsToReview(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT  item.id, " +
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
        "WHERE item.reviewed = 0 " +
        "AND item.id > ? ";
        if(topics.length != 0){
            sql += "AND item.topic_id IN (?) ";
            queryData = [userId, startId, topics, limit];
        }
        sql += "ORDER BY item.id " +
        "LIMIT ? ";
    const [row] = await pool.query<RowDataPacket[]>(sql, queryData);
    return row;
}
