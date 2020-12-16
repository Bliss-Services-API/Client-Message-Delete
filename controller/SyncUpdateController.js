'use strict';

module.exports = (postgresClient) => {

    const models = require('../models');

    const Model = models(postgresClient);
    const clientSyncMessageModel = Model.clientSyncMessageModel;

    const deleteSyncRecord = async (clientId, messageId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await clientSyncMessageModel.destroy({
                    where: {
                        client_id: clientId,
                        message_id: messageId
                    }
                });
                
                return resolve(true);
            } catch(err) {
                return reject(err);
            };   
        })
    };

    return {
        deleteSyncRecord
    };
}