'use strict';
const _ = require('lodash');

module.exports = {
    getSubset: function getSubset(array, sum) {
        function iter(temp, delta, index) {
            if (!delta) result.push(temp);
            if (index >= array.length) return;
            iter(temp.concat(array[index]), delta - (array[index]).hours, index + 1);
            if (!temp.length) iter(temp, delta, index + 1);
        }

        let result = [];
        iter([], sum, 0);
        return (result[0] || []);
    },
    pushButlerAndSetSpreadClientIds: function pushButlerAndSetSpreadClientIds(responseData, dataToPush) {
        if (_.isArray(dataToPush)) {
            const requestIds = _.map(dataToPush, (client) => {
              if (!responseData['spreadClientIds'].includes(client.clientId))
                 responseData['spreadClientIds'].push(client.clientId);
                return client.requestId;
            });
            responseData['butlers'].push({requests:requestIds});
        } else {
            responseData['butlers'].push({requests:[dataToPush.requestId]});
            if (!responseData['spreadClientIds'].includes(dataToPush.clientId))
                responseData['spreadClientIds'].push(dataToPush.clientId);
         }
    }
};