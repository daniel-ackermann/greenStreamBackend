import { RowDataPacket } from "mysql2";
import { User } from "../interface/user";
import pool from "../lib/db";

export async function getUsers(){}
export async function getUser(id: number|string): Promise<RowDataPacket[]>{
    const [row] = await pool.query<RowDataPacket[]>("SELECT * FROM user WHERE id = ?;", [id]);
    return row;
}

export async function updateUser(id: string, user: User): Promise<void>{
    await pool.query('UPDATE user SET ? WHERE email = ?', [user, id]);
}