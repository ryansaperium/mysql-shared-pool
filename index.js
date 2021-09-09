const mysqlSharedPool = require('./lib/mysql-shared-pool');

/**
 * Create a new Connection instance.
 * @param {object|string} config Configuration or connection string for new MySQL connection
 * @return {MySqlSharedPool} A new MySQL connection
 * @public
 */
exports.createPool = mysqlSharedPool.createPool;