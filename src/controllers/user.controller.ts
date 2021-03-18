import { RowDataPacket } from "mysql2";
import { UpdateUser, User } from "../interface/user";
import pool from "../lib/db";
import { removeEmptyStrings } from "../lib/helper";

export async function getUser(id: number | string): Promise<RowDataPacket[]> {
    const sql = "SELECT username, " +
        "password, " +
        "id, " +
        "email, " +
        "role, " +
        "show_in_app, " +
        "notification_time, " +
        "topics, " +
        "UNIX_TIMESTAMP(last_change) * 1000 as last_change, " +
        "language " +
        "FROM user, user_topics" +
        "WHERE id = ?;"
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    const [topics] = await pool.query<RowDataPacket[]>("SELECT u.user, t.id, t.name, t.language from user_topics u, topic t WHERE u.topic = t.id AND u.user = ?;", [id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    row[0].topics = topics;
    return row;
}

export async function getUserByEmail(id: string): Promise<RowDataPacket> {
    const sql = "SELECT username, " +
        "password, " +
        "id, " +
        "email, " +
        "role, " +
        "show_in_app, " +
        "notification_time, " +
        "topics, " +
        "UNIX_TIMESTAMP(last_change) * 1000 as last_change, " +
        "language " +
        "FROM user, user_topics" +
        "WHERE email = ?;"
    const [row] = await pool.query<RowDataPacket[]>(sql, [id]);
    const [topics] = await pool.query<RowDataPacket[]>("SELECT u.user, t.id, t.name, t.language from user_topics u, topic t WHERE u.topic = t.id AND u.user = ?;", [row[0].id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    row[0].topics = topics;
    return row[0];
}

export async function getUserWithoutPassword(id: number | string): Promise<RowDataPacket[]> {
    const [row] = await pool.query<RowDataPacket[]>("SELECT username, id, email, role, show_in_app, notification_time, topics, UNIX_TIMESTAMP(last_change) * 1000 as last_change, language FROM user WHERE id = ?;", [id]);
    const [topics] = await pool.query<RowDataPacket[]>("SELECT * from user_topics u, topic t WHERE u.topic = t.id AND u.user = ?;", [id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    row[0].topics = topics;
    return row;
}

/**
 * @deprecated The method should not be used
 */
export async function updateUser(id: string, user: User): Promise<void> {
    await pool.query('UPDATE user SET ? WHERE email = ?', [user, id]);
}


export async function updateUserById(id: number, user: UpdateUser): Promise<void> {
    if(user.topics !== undefined){
        updateUserTopics(id, user.topics);
    }
    await pool.query('UPDATE user SET ? WHERE id = ?', [user, id]);
}

export async function updateUserTopics(user: number, topics: [number]):Promise<void> {
    await pool.query("DELETE FROM user_topics WHERE user = ?", [user]);
    for (const i in topics) {
        await pool.query("INSERT INTO user_topics (user, topic) VALUES (?, ?);", [user, topics[i] ]);
    }
}

export async function updateUserTopic(user: number, topic: number):Promise<void> {
    updateUserTopics(user, [topic]);
}

export async function addUserTopics(user: number, topics: number[]):Promise<void> {
    for (const i in topics) {
        await pool.query("INSERT INTO user_topics (user, topic) VALUES (?, ?);", [user, topics[i] ]);
    }
}

export async function addUserTopic(user: number, topic: number):Promise<void> {
    addUserTopics(user, [topic]);
}

export async function removeUserTopics(user: number, topics: [number]):Promise<void> {
    await pool.query("DELETE FROM user_topics WHERE user = ? AND topic IN ?;", [user, topics]);

}

export async function removeUserTopic(user: number, topic: number):Promise<void> {
    removeUserTopics(user, [topic]);
}
