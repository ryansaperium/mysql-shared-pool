const _ = require('lodash');
const debug = require('debug')('mysql-shared-pool');

const _pools = {};

function MySqlSharedPool(config) {
    config = config || {};
    var defaults = {};

    this._config = _.defaults(config, defaults);

    const poolId = this._getPoolIdentifier(this._config);

    debug('got config:', this._config);
    debug('poolId is: ', poolId);

    // check if given the poolId we have a pool already
    this._pool = _pools[poolId];

    if (!this._pool) {
        this._pool = _pools[poolId] = require('knex')({
            client: 'mysql',
            connection: this._config.connection,
            pool: this._config.pool
        });
    }
}

MySqlSharedPool.prototype.raw = async function(query, params) {
    const rawResult = await this._pool.raw(query, params);

    const results = rawResult[0];

    // can be multi result. patterned it using npm mysql library to just return an object if one result only.
    // but return an array if multiple result set. else if length is 0 return null
    return results;
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