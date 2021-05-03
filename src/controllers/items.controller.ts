import pool from '../lib/db'
import { RowDataPacket } from 'mysql2';
import { parseLanguage } from '../lib/helper';
import { environment } from '../env/environment';

// Designentscheidung: https://mariadb.com/kb/en/pagination-optimization/


export async function getAllItems(lang?: string): Promise<RowDataPacket[]> {
    const languages = parseLanguage(lang);
    const sql = "SELECT  item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "WHERE item.language IN (?) " +
                        "AND item.reviewed > 0 "+
                        "AND item.public = 1 " +
                        "ORDER BY item.pos ASC ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages]);
    return rows;
}

export async function getItems(position:number, limit: number, lang = "", topics: string[]| number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = environment.defaultTopics;
    }
    const languages = parseLanguage(lang);
    const sql = "SELECT  item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "WHERE item.language IN (?) " +
                        "AND item.reviewed > 0 " +
                        "AND item.position > ? " +
                        "AND item.public = 1 " +
                        "AND item.topic_id IN (?) " +
                        "ORDER BY item.position ASC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [languages, position, topics, limit]);
    return rows;
}

export async function getItemsWithUserData(userId: number, position:number, limit: number,topics: string[]|number[],  lang?: string): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = environment.defaultTopics;
    }
    const sql = "SELECT  item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
                        "INNER JOIN language ON language.code IN (SELECT language FROM user_languages WHERE user = user_data.user_id ) AND language.code = item.language " +
                        "WHERE item.topic_id IN (?) " +
                        "AND item.reviewed > 0 " +
                        "AND item.public = 1 " +
                        "AND item.position > ? " +
                        "ORDER BY item.position ASC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, userId, topics, position, limit]);
    return rows;
}

export async function getSuggestedItems(userId: number, position:number, limit: number, lang?:string): Promise<RowDataPacket[]> {
    const sql = "SELECT  item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "INNER JOIN user_topics ON user_topics.topic = item.topic_id AND user_topics.user = ? " +
                        "INNER JOIN language ON language.code IN (SELECT language FROM user_languages WHERE user = user_topics.user ) AND language.code = item.language " +
                        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = user_topics.user " +
                        "WHERE " +
                        "item.reviewed > 0 " +
                        "AND item.created_by_id != user_topics.user " +
                        "AND item.position > ? " +
                        "AND item.public = 1 " +
                        "ORDER BY item.position ASC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, position, limit]);
    return rows;
}

// email oder id?
export async function getItemsByUser(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = environment.defaultTopics;
    }
    const sql = "SELECT  item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.created, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = item.created_by_id " +
                        "WHERE item.created_by_id = ? " +
                        "AND item.created < ? " +
                        "AND item.topic_id IN (?) " +
                        "ORDER BY item.created DESC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [userId, startId, topics, limit]);
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
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "INNER JOIN user_data ON user_data.id = item.id " +
                        "AND user_data.liked " +
                        "AND user_data.user_id = ? " +
                        "WHERE user_data.liked < ? ";
    if(topics.length != 0){
        sql +=          "AND item.topic_id IN (?) ";
        queryData = [userId, startId, topics, limit];
    }
    sql +=              "ORDER BY user_data.liked DESC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getWatchedItems(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "INNER JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? AND user_data.watched IS NOT NULL " +
                        "WHERE user_data.watched < ? ";
    if(topics.length != 0){
        sql +=          "AND item.topic_id IN (?) ";
        queryData = [userId, startId, topics, limit];
    }
    sql +=              "ORDER BY user_data.watched DESC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getWatchListItems(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "INNER JOIN user_data ON user_data.id = item.id AND user_data.watchlist IS NOT NULL AND user_data.user_id = ? " +
                        "WHERE user_data.watchlist < ? ";
    if(topics.length != 0){
        sql +=          "AND item.topic_id IN (?) ";
        queryData = [userId, startId, topics, limit];
    }
    sql +=              "ORDER BY user_data.watchlist DESC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getReviewedItemsByUser(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, userId, startId, limit];
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "WHERE item.reviewed > 0 " +
                        "AND item.reviewed_by_id = ? " +
                        "AND item.position > ? ";
    if(topics.length != 0){
        sql +=          "AND item.topic_id IN (?) ";
        queryData = [userId, userId, startId, topics, limit];
    }
    sql +=              "ORDER BY item.position " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getItemsToReview(userId: number, limit:number, startId: number, topics: string[]|number[]): Promise<RowDataPacket[]> {
    if(!topics || !topics.length){
        topics = [];
    }
    let queryData: (number|number[]|string[])[] = [userId, startId, limit];
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? " +
                        "INNER JOIN language ON language.code IN (SELECT language FROM user_languages WHERE user = user_data.user_id ) AND language.code = item.language " +
                        "WHERE item.reviewed IS NULL OR item.reviewed = 0 " +
                        "AND item.id > ? ";
    if(topics.length != 0){
        sql +=          "AND item.topic_id IN (?) ";
        queryData = [userId, startId, topics, limit];
    }
    sql +=              "ORDER BY item.id " +
                        "LIMIT ? ";
    const [row] = await pool.query<RowDataPacket[]>(sql, queryData);
    return row;
}

export async function getItemsWithFeedback(limit:number, position: number, topics: string[]|number[], userId?: number): Promise<RowDataPacket[]>{
    if(!topics || !topics.length){
        topics = [];
    }
    const queryData: (number|number[]|string[])[] = [position];
    let sql =   "SELECT  item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        " ) as language, ";
    if(userId){
        sql +=          "user_data.liked, " +
                        "user_data.watched, " +
                        "user_data.watchlist, " +
                        "user_data.last_recommended, ";
    }
    sql +=              "count(item.id) as feedback " +
                        "FROM item " +
                        "INNER JOIN type ON type.id = item.type_id " +
                        "INNER JOIN topic ON topic.id = item.topic_id " +
                        "INNER JOIN language ON language.code = item.language " +
                        "INNER JOIN information_feedback ON information_feedback.information_id = item.id ";
    if(userId){
        sql +=          "LEFT JOIN user_data ON user_data.id = item.id AND user_data.user_id = ? ";
        queryData.unshift(userId);
    }
    sql +=              "WHERE item.reviewed > 0 " +
                        "AND item.id > ? ";
    if(topics.length != 0){
    sql +=              "AND item.topic_id IN (?) ";
        queryData.push(topics);
    }
    sql +=              "GROUP BY item.id ";
    if(userId){
        sql +=          ", user_data.liked, user_data.watched, user_data.watchlist, user_data.last_recommended ";
    }
    sql +=              "ORDER BY item.id " +
                        "LIMIT ? ";
    queryData.push(limit);
    const [row] = await pool.query<RowDataPacket[]>(sql, queryData);
    return row;
}

export async function getSearchResult(query: string, limit: number, position: number, topics: string[]|number[], lang?: string): Promise<RowDataPacket[]> {
    const languages = parseLanguage(lang);
    const queryData: (number|number[]|string|string[])[] = [languages, "%" + query + "%", "%" + query + "%", position, limit];
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "WHERE item.language IN (?) ";
if(topics && topics.length){
    sql +=              "AND item.topic_id IN (?) ";
    queryData.splice(1, 0, topics);
}
sql +=                  "AND ( item.title LIKE ? OR item.description LIKE ? ) " +
                        "AND item.reviewed > 0 " +
                        "AND item.public = 1 " +
                        "AND item.position > ? " +
                        "ORDER BY item.position ASC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getSearchResultUser(query: string, limit: number, startId: number, topics: string[]|number[], userId: number, lang?: string): Promise<RowDataPacket[]> {
    const queryData: (number|number[]|string|string[])[] = [userId, "%" + query + "%", "%" + query + "%", startId, limit];
    let sql = "SELECT    item.id, " +
                        "item.likes, " +
                        "item.marked, " +
                        "item.explanation_id, " +
                        "item.url, " +
                        "item.description, " +
                        "item.title, " +
                        "item.simple, " +
                        "item.reviewed, " +
                        "item.public, " +
                        "item.position, " +
                        "item.created_by_id, " +
                        "item.image, " +
                        "item.readingDuration, " +
                        "JSON_OBJECT( "+
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
                        "WHERE item.reviewed > 0 ";
if(topics && topics.length){
    sql +=              "AND item.topic_id IN (?) ";
    queryData.splice(2, 0, topics);
}
sql +=                  "AND ( item.title LIKE ? OR item.description LIKE ? ) " +
                        "AND item.public = 1 " +
                        "AND item.position > ? " +
                        "ORDER BY item.position ASC " +
                        "LIMIT ? ";
    const [rows] = await pool.query<RowDataPacket[]>(sql, queryData);
    return rows;
}

export async function getTrendingItems(limit = 5):Promise<RowDataPacket[]>{
    const sql = "select item.title, item.url, item.id, user_data.score from item inner join (select id, count(liked) + count(watched) as score from user_data group by id order by score desc) as user_data on item.id = user_data.id LIMIT ?;";
    const [rows] = await pool.query<RowDataPacket[]>(sql, [limit]);
    return rows;
}

export async function recalculateItemPositions(): Promise<void>{
    const sql = "UPDATE item, " +
                "(SELECT id, " +
                        "ROW_NUMBER() OVER (PARTITION BY public ORDER BY score + watched * likes * marked + watchlist DESC, id) AS pos " +
                        "FROM item " +
                        "ORDER BY pos ASC " +
                ") AS positions " +
                "SET item.position = positions.pos " +
                "WHERE item.id = positions.id ";
    await pool.query(sql, []);
    console.log("Item Reihenfolge neu berechnet");
}