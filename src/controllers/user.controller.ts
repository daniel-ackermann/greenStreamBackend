import { Router } from "express";
import { User } from "../interface/user";
import pool from "../lib/db";

export async function getUsers(){}
export async function getUser(id: number|string){}
export async function updateUser(id: string, user: User){
    await pool.query('UPDATE user SET ? WHERE email = ?', [user, id]);
}