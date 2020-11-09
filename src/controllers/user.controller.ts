import { RowDataPacket } from "mysql2";
import { UpdateUser, User, UserWithoutPassword } from "../interface/user";
import pool from "../lib/db";
import { removeEmptyStrings } from "../lib/helper";

export async function getUsers(){}
export async function getUser(id: number|string): Promise<RowDataPacket[]>{
    const [row] = await pool.query<RowDataPacket[]>("SELECT username, password, id, email, role, show_in_app, notification_time, topics, UNIX_TIMESTAMP(last_change) * 1000 as last_change, language FROM user WHERE id = ?;", [id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    row[0].topics = row[0].topics.split(',').filter(removeEmptyStrings);
    return row;
}

export async function getUserWithoutPassword(id: number|string): Promise<RowDataPacket[]> {
    const [row] = await pool.query<RowDataPacket[]>("SELECT username, id, email, role, show_in_app, notification_time, topics, UNIX_TIMESTAMP(last_change) * 1000 as last_change, language FROM user WHERE id = ?;", [id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    row[0].topics = row[0].topics.split(',').filter(removeEmptyStrings);
    return row;
}

export async function updateUser(id: string, user: User): Promise<void>{
    await pool.query('UPDATE user SET ? WHERE email = ?', [user, id]);
}

export async function updateUserById(id: number, user: UpdateUser): Promise<void>{
    await pool.query('UPDATE user SET ? WHERE id = ?', [user, id]);
    
}