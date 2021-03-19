import { RowDataPacket } from "mysql2";
import { UpdateUser, User } from "../interface/user";
import pool from "../lib/db";
import { removeEmptyStrings } from "../lib/helper";
import { updateUserLanguages } from "./user.language.controller";
import { updateUserTopics } from "./user.topic.controller";



export async function getUser(id: number): Promise<RowDataPacket> {
    const user = await getUserWithPassword(id);
    delete user.password;
    return user;
}

export async function getUserWithPassword(id: number): Promise<RowDataPacket> {
    const sql = "SELECT username, " +
        "password, " +
        "id, " +
        "email, " +
        "role, " +
        "show_in_app, " +
        "notification_time, " +
        "UNIX_TIMESTAMP(last_change) * 1000 as last_change, " +
        "language " +
        "FROM user " +
        "WHERE id = ?;"
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    const query = "SELECT topic.*, " +
        "case when u.topic = topic.id then true else false end as selected " +
        "from user_topics u " +
        "RIGHT JOIN topic ON (u.topic = topic.id AND u.user = ?) ";
    const [topics] = await pool.query<RowDataPacket[]>(query, [id]);
    row[0].topics = topics;
    const lang = "select l.name, l.code, case when l.code = u.language then true else false end as selected from language l left join user_languages u on (l.code = u.language AND u.user = ?);";
    const [languages] = await pool.query<RowDataPacket[]>(lang, [id]);
    row[0].languages = languages;
    return row[0];
}

export async function getUserByEmail(email: string): Promise<RowDataPacket> {
    const user = await getUserByEmailWithPassword(email);
    delete user.password;
    return user as RowDataPacket;
}

export async function getUserByEmailWithPassword(email: string): Promise<RowDataPacket> {
    const sql = "SELECT username, " +
        "password, " +
        "id, " +
        "email, " +
        "role, " +
        "show_in_app, " +
        "notification_time, " +
        "UNIX_TIMESTAMP(last_change) * 1000 as last_change, " +
        "language " +
        "FROM user " +
        "WHERE email = ?;"
    const [row] = await pool.query<RowDataPacket[]>(sql, [email]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    const query = "SELECT topic.*, " +
        "case when u.topic = topic.id then true else false end as selected " +
        "from user_topics u " +
        "RIGHT JOIN topic ON (u.topic = topic.id AND u.user = ?)";
    const [topics] = await pool.query<RowDataPacket[]>(query, [row[0].id]);
    row[0].topics = topics;
    const lang = "select l.name, l.code, case when l.code = u.language then true else false end as selected from language l left join user_languages u on (l.code = u.language AND u.user = ?);";
    const [languages] = await pool.query<RowDataPacket[]>(lang, [row[0].id]);
    row[0].languages = languages;
    return row[0];
}

/**
 * @deprecated The method should not be used
 */
export async function updateUser(id: string, user: User): Promise<void> {
    await pool.query('UPDATE user SET username = ? WHERE email = ?', [user.username, id]);
}


export async function updateUserById(id: number, user: UpdateUser): Promise<void> {
    if(user.topics !== undefined){
        updateUserTopics(id, user.topics);
    }
    if(user.languages !== undefined){
        updateUserLanguages(id, user.languages);
    }
    await pool.query('UPDATE user SET username = ? WHERE id = ?', [user.username, id]);
}
