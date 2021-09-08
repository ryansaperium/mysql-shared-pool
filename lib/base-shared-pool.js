class BaseSharedPool {
    
    /**
     *
     * @param {string} sql
     */
    async raw(sql, params) {
        throw new Error('not implemented');
    }

    rawStream(sql, params) {
        throw new Error('not implemented');
    }
    
    /**
     *
     * @param {string} sql
     */
    async execute(sql, params) {
        throw new Error('not implemented');
    }
}

module.exports.BaseSharedPool = BaseSharedPool;