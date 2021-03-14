import pool from '../lib/db'
import bcrypt from 'bcryptjs'


export async function saveNewPassword(password: string, owner: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.execute(`UPDATE user SET password=? WHERE email=?`, [passwordHash.toString(), owner]);
}