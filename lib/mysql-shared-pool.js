const mysql = require("mysql2/promise");
class MySqlSharedPool {
    /**
     *
     * @param {import('./mysql-shared-pool').MySqlSharedPoolOptions} poolConfig
     */
    constructor(poolConfig) {
        this._pool = mysql.createPool({
            host: poolConfig.connection.host,
            user: poolConfig.connection.user,
            port: poolConfig.connection.port,
            password: poolConfig.connection.password,
            database: poolConfig.connection.database,
            multipleStatements: poolConfig.connection.multipleStatements,
            waitForConnections: poolConfig.pool && poolConfig.pool.max ? true : undefined,
            connectionLimit: poolConfig.pool && poolConfig.pool.max ?
                poolConfig.pool.max :
                undefined,
            queueLimit: poolConfig.pool && poolConfig.pool.max ? 0 : undefined,
            
        });
    }

    /**
     *
     * @param {string} sql
     */
    async raw(sql, params) {
        return this.execute(sql, params);
    }

    rawStream(sql, params) {
        return this._pool.pool.query(sql, params).stream();
    }
    
    /**
     *
     * @param {string} sql
     */
    async execute(sql, params) {
        return this._pool.execute(sql, params);
    }
}

module.exports.MySqlSharedPool = MySqlSharedPool;