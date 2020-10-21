// import Pool from "mysql2/typings/mysql/lib/Pool";
import { Pool, PoolConnection } from 'mysql2/typings/mysql';
import * as mysql from 'mysql2';
import { Connection as PromiseConnection, Pool as PromisePool, PoolConnection as PromisePoolConnection } from 'mysql2/promise';

export interface ExtendedPool extends Pool{
    lastUpdate: number;
    updateQuery: any;
}
export interface DB extends Pool {
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>(sql: string, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>(sql: string, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>(options: mysql.QueryOptions, callback?: (err: mysql.QueryError | null, result: T, fields?: mysql.FieldPacket[]) => any): mysql.Query;
    execute<T extends mysql.RowDataPacket[][] | mysql.RowDataPacket[] | mysql.OkPacket | mysql.OkPacket[] | mysql.ResultSetHeader>(options: mysql.QueryOptions, values: any | any[] | { [param: string]: any }, callback?: (err: mysql.QueryError | null, result: T, fields: mysql.FieldPacket[]) => any): mysql.Query;
    getConnection(callback: (err: NodeJS.ErrnoException, connection: PoolConnection) => any): void;
    releaseConnection(connection: PoolConnection): void;
    end(callback?: (err: mysql.QueryError) => any): void;
    on(event: 'connection', listener: (connection: PoolConnection) => any): this;
    on(event: 'acquire', listener: (connection: PoolConnection) => any): this;
    on(event: 'release', listener: (connection: PoolConnection) => any): this;
    on(event: 'enqueue', listener: () => any): this;
    promise(promiseImpl?: PromiseConstructor): PromisePool;
    
}