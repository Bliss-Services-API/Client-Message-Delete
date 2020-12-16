'use strict';

module.exports = (postgresClient) => {

    const models = require('../models');

    const Model = models(postgresClient);
    const clientSyncMessageModel = Model.clientSyncMessageModel;

    const deleteSyncRecord = async (clientId, responseId = undefined, requestId = undefined, podcastTitle = undefined, podcastEpisodeTitle = undefined) => {
        return new Promise(async (resolve, reject) => {
            try {
                if(responseId !== undefined) {
                    await clientSyncMessageModel.destroy({
                        where: {
                            client_id: clientId,
                            bliss_response_id: responseId
                        }
                    });
                };

                if(requestId !== undefined) {
                    await clientSyncMessageModel.destroy({
                        where: {
                            client_id: clientId,
                            bliss_request_id: requestId
                        }
                    });
                };

                if(podcast_title !== undefined && podcast_episode_title !== undefined) {
                    await clientSyncMessageModel.destroy({
                        where: {
                            client_id: clientId,
                            podcast_title: podcastTitle,
                            podcast_episode_title: podcastEpisodeTitle
                        }
                    });
                };

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