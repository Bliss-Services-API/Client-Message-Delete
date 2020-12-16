'use strict';

const crypto = require('crypto');
const postgresClient = require('./connections/PostgresConnection')('production');

postgresClient.authenticate()
.then(() => console.log('Database Connected Successfully'))
.catch((err) => console.log(`Database Connection Failed! ERR: ${err}`));

module.exports.app = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    const MagicWord = process.env.MAGIC_WORD;

    try {
        const Controller = require('./controller')(postgresClient);
        const clientSyncController = Controller.syncUpdateController;

        const clientEmail = event.queryStringParameters.client_email;
        const responseId = event.queryStringParameters.response_id;
        const requestId = event.queryStringParameters.request_id;

        const clientEmailSalted = clientEmail + "" + MagicWord;
        const clientId = crypto.createHash('sha256').update(clientEmailSalted).digest('base64');

        await clientSyncController.deleteSyncRecord(clientId, responseId, requestId);

        const response = {
            MESSAGE: 'DONE',
            RESPONSE: 'Client Message Sync Deleted!',
            CODE: 'CLIENT_SYNC_DELETED',
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch(err) {
        console.error(`ERR: ${JSON.stringify(err.message)}`);

        const response = {
            ERR: err.message,
            RESPONSE: 'Client Message Sync Delete Failed!',
            CODE: 'CLIENT_SYNC_DELETE_FAILED',
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        };
    }
}