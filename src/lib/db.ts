import { createPool, Pool } from 'mysql2/promise';
import 'dotenv/config'
import { OkPacket, ResultSetHeader, RowDataPacket } from 'mysql2';

class DB {
    static pool: Pool;
    static lastChange: Date = new Date();
    constructor() {
        if (DB.pool == undefined) {
            DB.pool = createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_DATABASE
            });
        }
    }
    query<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(sql: string, values: any[] = []){
        this.updateTime()
        return DB.pool.query<T>(sql, values);
    }
    execute<T extends RowDataPacket[][] | RowDataPacket[] | OkPacket | OkPacket[] | ResultSetHeader>(sql: string, values: any[]){
        this.updateTime()
        return DB.pool.execute<T>(sql, values);
    }
    private updateTime(){
        DB.lastChange = new Date();
    }
    getLastModified(){
        return DB.lastChange;
    }
}

export = new DB();