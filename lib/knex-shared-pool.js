const mysql = require("mysql2/promise");
const knex = require('knex');
const { BaseSharedPool } = require("./base-shared-pool");

class KnexSharedPool extends BaseSharedPool {
    /**
     *
     * @param {import('./base-shared-pool').MySqlSharedPoolOptions} poolConfig
     */
    constructor(poolConfig) {
        super(poolConfig);
        this._pool = require('knex')({
            client: 'mysql2',
            connection: poolConfig.connection,
            pool: poolConfig.pool
        });
    }

    /**
     *
     * @param {string} sql
     */
    async raw(sql, params) {
        return this._pool.raw(sql, params);
    }

    rawStream(sql, params) {
        return this._pool.raw(sql, params).stream();
    }
    
    /**
     *
     * @param {string} sql
     */
    async execute(sql, params) {
        return this._pool.raw(sql, params);
    }
}

module.exports.KnexSharedPool = KnexSharedPool;