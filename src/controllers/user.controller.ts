import { RowDataPacket } from "mysql2";
import { User } from "../interface/user";
import pool from "../lib/db";
import { removeEmptyStrings } from "../lib/helper";

export async function getUsers(){}
export async function getUser(id: number|string): Promise<RowDataPacket[]>{
    const [row] = await pool.query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?;", [id]);
    row[0].language = row[0].language.split(',').filter(removeEmptyStrings);
    row[0].topics = row[0].topics.split(',').filter(removeEmptyStrings);
    return row;
}

export async function updateUser(id: string, user: User): Promise<void>{
    await pool.query('UPDATE user SET ? WHERE email = ?', [user, id]);
}