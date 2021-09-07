import { RowDataPacket } from "mysql2";
import { Stream } from 'stream'
export interface MySqlSharedPoolOptions {
    name: string;
    connection: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
      multipleStatements: boolean;
    };
    pool: {
      min: number;
      max: number;
    };
  }

export class MySqlSharedPool {
    constructor(options: MySqlSharedPoolOptions)
    raw(sql: string, params: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[]]>;
    rawStream(sql: string, params: any | any[] | { [param: string]: any }): Stream;
    execute(sql: string, params: any | any[] | { [param: string]: any }): Promise<[RowDataPacket[]]>;
}

