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
        const messageId = event.queryStringParameters.message_id;

        const clientEmailSalted = clientEmail + "" + MagicWord;
        const clientId = crypto.createHash('sha256').update(clientEmailSalted).digest('base64');

        await clientSyncController.deleteSyncRecord(clientId, messageId);

        const response = {
            MESSAGE: 'DONE',
            RESPONSE: 'Client Message Deleted!',
            CODE: 'CLIENT_MESSAGE_DELETED',
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response)
        };
    } catch(err) {
        console.error(`ERR: ${JSON.stringify(err.message)}`);

        const response = {
            ERR: err.message,
            RESPONSE: 'Client Message Delete Failed!',
            CODE: 'CLIENT_MESSAGE_DELETE_FAILED',
        };

        return {
            statusCode: 400,
            body: JSON.stringify(response)
        };
    }
}