module.exports = postgresClient => {
    const clientSyncMessageModel = require('./ClientSyncMessageModel')(postgresClient);

    return {
        clientSyncMessageModel
    };
}