import { createPool, Pool } from 'mysql2/promise';
import 'dotenv/config'


export default class DB {
    static pool: Pool;
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
    getPool(): Pool {
        return DB.pool;
    }
}

// export default class DBConnection {
//     private db: Pool;
//     constructor() {
//         this.db = createPool({
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASS,
//             database: process.env.DB_DATABASE
//         });
//         this.checkConnection();
//     }

//     private checkConnection() {
//         this.db.getConnection().then(value => {
//                 value.release();
//             }).catch(err => {
//                 if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//                     console.error('Database connection was closed.');
//                 }
//                 if (err.code === 'ER_CON_COUNT_ERROR') {
//                     console.error('Database has too many connections.');
//                 }
//                 if (err.code === 'ECONNREFUSED') {
//                     console.error('Database connection was refused.');
//                 }
//         });
//     }

//     public async query<T>(sql:string, values: string[]): Promise<any>{
//         return new Promise((resolve, reject) => {
//             this.db.execute(sql, values).then((result) => {
//                 resolve(result);
//             }).catch(err => {
//                 reject(err);
//             });
//         }).catch((err: Error) => {
            // const mysqlErrorList:string[] = Object.keys(HttpStatusCodes);
            // convert mysql errors which in the mysqlErrorList list to http status code
            // err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

    //         throw err;
    //     });
    // }

    // function query(sql:string, values: string[]){
    //     return new Promise((resolve, reject) => {
    //         this.db.execute(sql, values).then(result => {
    //             return resolve(result);
    //         }).catch(err => {
    //             return reject(err);
    //         });
    //     }).catch(err => {
    //         // const mysqlErrorList:string[] = Object.keys(HttpStatusCodes);
    //         // convert mysql errors which in the mysqlErrorList list to http status code
    //         // err.status = mysqlErrorList.includes(err.code) ? HttpStatusCodes[err.code] : err.status;

    //         throw err;
    //     });
    // }
// }

// // like ENUM
// const HttpStatusCodes = Object.freeze({
//     ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: 422,
//     ER_DUP_ENTRY: 409
// });

// export default  = new DBConnection().query;