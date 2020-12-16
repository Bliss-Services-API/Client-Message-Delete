module.exports = (postgresClient) => {
    const syncUpdateController = require('./SyncUpdateController')(postgresClient);

    return {
        syncUpdateController
    };
}