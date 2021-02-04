const _ = require('lodash');
const debug = require('debug')('mysql-shared-pool');

const _pools = {};

function MySqlSharedPool(config) {
    config = config || {};

    const connectionDefaults = {
        multipleStatements: true
    };

    const poolDefaults = {
        min: 1,
        max: 2
    }

    // connection and pool configurations are based on knex
    // so check knex documentation for mysql
    const connection = _.defaults(config.connection, connectionDefaults);
    const pool = _.defaults(config.pool, poolDefaults);

    this._config = {
        connection: connection,
        pool: pool
    }

    const poolId = this._getPoolIdentifier(this._config);

    debug('got config:', this._config);
    debug('poolId is: ', poolId);

    // check if given the poolId we have a pool already
    this._pool = _pools[poolId];

    if (!this._pool) {
        // using the same structure as knex but will only set only the config that we support
        this._pool = _pools[poolId] = require('knex')({
            client: 'mysql',
            connection: connection,
            pool: pool
        });
    }
}

MySqlSharedPool.prototype.raw = async function(query, params) {
    const resultsAndFields = await this._pool.raw(query, params);

    return resultsAndFields[0];
}


MySqlSharedPool.prototype.destroy = function() {
    return this._pool.destroy();
}

MySqlSharedPool.prototype._pool;
MySqlSharedPool.prototype._config;

MySqlSharedPool.prototype._getPoolIdentifier = function(config) {
    let poolId = '';

    if (config.name) {
        poolId += config.name;
    }

    if (config.connection.host) {
        if (poolId)
            poolId += '-';

        poolId += config.connection.host;
    }

    if (config.connection.port) {
        if (poolId)
            poolId += '-';

        poolId += config.connection.port;
    }

    if (config.connection.user) {
        if (poolId)
            poolId += '-';

        poolId += config.connection.user;
    }

    if (config.connection.password) {
        if (poolId)
            poolId += '-';

        poolId += config.connection.password;
    }

    if (config.connection.multipleStatements) {
        if (poolId)
            poolId += '-';

        poolId += config.connection.multipleStatements;
    }

    if (config.pool.min) {
        if (poolId)
            poolId += '-';

        poolId += config.pool.min;
    }

    if (config.pool.max) {
        if (poolId)
            poolId += '-';

        poolId += config.pool.max;
    }

    return poolId;
};

module.exports = MySqlSharedPool