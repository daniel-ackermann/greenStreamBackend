import { RowDataPacket } from "mysql2";
import { UpdateUser, User } from "../interface/user";
import pool from "../lib/db";
import { removeEmptyStrings } from "../lib/helper";



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
    await pool.query('UPDATE user SET username = ? WHERE id = ?', [user.username, id]);
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
