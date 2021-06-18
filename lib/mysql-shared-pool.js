const _ = require('lodash');
const debug = require('debug')('mysql-shared-pool');

if (!global.mysqlsharedpools) {
    global.mysqlsharedpools = {};
}


const getPoolIdentifier = function(config) {
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

function createPool(config) {
    const poolConfig = _.cloneDeep(config || {});
    poolConfig.client = 'mysql';
    // connection and pool configurations are based on knex
    // so check knex documentation for mysql
    const poolId = getPoolIdentifier(poolConfig);
    // check if given the poolId we have a pool already
    let sharedPool = global.mysqlsharedpools[poolId];

    if (!sharedPool) {
        debug('did not find an existing pool for id. creating', poolId, poolConfig);

        // using the same structure as knex but will only set only the config that we support
        sharedPool = global.mysqlsharedpools[poolId] = require('knex')(poolConfig);
    } else {
        debug('found pool for id', poolId, poolConfig);
    }

    return sharedPool;
}



module.exports = {
    createPool: createPool
}