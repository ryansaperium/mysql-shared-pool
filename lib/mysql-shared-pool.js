const _ = require('lodash');
const debug = require('debug')('mysql-shared-pool');

const _pools = {};
const _poolsCounter = {};

function MySqlSharedPool(config) {
    config = config || {};

    const poolDefaults = {
        min: 1,
        max: 2
    }

    // connection and pool configurations are based on knex
    // so check knex documentation for mysql
    const connection = config.connection;
    connection.multipleStatements = true;
    const pool = _.defaults(config.pool, poolDefaults);

    this._config = {
        connection: connection,
        pool: pool
    }

    this._destroyed = false;

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

        _poolsCounter[poolId] = 1;
    } else {
        _poolsCounter[poolId] = _poolsCounter[poolId] + 1;
    }
}

MySqlSharedPool.prototype.raw = async function(query, params) {
    if (this._destroyed) {
        throw new Error('MySqlSharedPool already destroyed');
    } else {
        return this._pool.raw(query, params);
    }
}

MySqlSharedPool.prototype.rawStream = async function(query, params) {
    if (this._destroyed) {
        throw new Error('MySqlSharedPool already destroyed');
    } else {
        return this._pool.raw(query, params).stream();
    }
}


MySqlSharedPool.prototype.destroy = async function() {
    if (!this._destroyed) {
        const self = this;
        let foundPoolId;
        let poolsCounter;
        _.forOwn(_pools, (pool, poolId) => {
            if (self._pool == pool) {
                foundPoolId = poolId;
                poolsCounter = _poolsCounter[poolId] = _poolsCounter[poolId] - 1;
                return false;
            }
        });
    
        if (poolsCounter == 0) {
            await _pools[foundPoolId].destroy();
            delete _poolsCounter[foundPoolId];
            this._destroyed = true;
        }
    }
}

MySqlSharedPool.prototype.rawStream = async function(query, params) {
    if (this._destroyed) {
        throw new Error('MySqlSharedPool already destroyed');
    } else {
        return this._pool.raw(query, params).stream();
    }
}

MySqlSharedPool.prototype._pool;
MySqlSharedPool.prototype._config;
MySqlSharedPool.prototype._destroyed;

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

    if (config.connection.database) {
        if (poolId)
            poolId += '-';

        poolId += config.connection.database;
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