'use strict';
//------------Variable Declaration-------------
const _ = require('lodash');
const express = require('express');
const app = express();
const utils = require('./utils');

//------------Config Part--------
const CONFIG = require('./config.json');
const PORT = process.env.PORT || CONFIG['APP_PORT'];

//---------Middleware declaration------------

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//--------------Routes--------------
app.get('/', (request, response) => {
    return response.status(200).send('Client-Bulter application working fine. ' +
     '<br/> Please use `POST /allocate-request` route');
});

app.post('/allocate-request', (request, response) => {
    let requestObjData = request.body;
    const SHIFT_HOUR = 8;
    const responseData = {
        'butlers': [],
        'spreadClientIds': []
    };

    while(requestObjData.length) {
        let requestObj = requestObjData.shift();
        if (requestObj.hours === SHIFT_HOUR) {
            utils.pushButlerAndSetSpreadClientIds(responseData, requestObj);
        } else {
            if (requestObj.hours > SHIFT_HOUR) {
                requestObj.hours -= SHIFT_HOUR;
                requestObjData.push(requestObj);
                utils.pushButlerAndSetSpreadClientIds(responseData, requestObj);
            } else {
                let remainHours = SHIFT_HOUR - requestObj.hours;
                let indexOfRemainHour = requestObjData.findIndex((client)=> client.hours === (remainHours));
                if (indexOfRemainHour !== -1) {
                    let sliced = (requestObjData.splice(indexOfRemainHour, 1))[0];
                    utils.pushButlerAndSetSpreadClientIds(responseData, [requestObj, sliced])
                } else {
                    let checkPossibleSumArray = utils.getSubset(requestObjData.filter((client) => client.hours < remainHours), remainHours);
                    if (!checkPossibleSumArray.length) {
                        utils.pushButlerAndSetSpreadClientIds(responseData, requestObj);
                    } else {
                        checkPossibleSumArray.forEach((findObj) => {
                           let index =  requestObjData.findIndex((originalObj)=> originalObj.hours === findObj.hours &&
                               originalObj.clientId === findObj.clientId && originalObj.requestId === findObj.requestId);
                           requestObjData.splice(index, 1);
                        });
                        utils.pushButlerAndSetSpreadClientIds(responseData, checkPossibleSumArray.concat([requestObj]));
                    }
                }
            }
        }
    }
    return response.status(200).json(responseData);
});

//------------Application Server-----------
app.listen(PORT, (error) => {
   if (error) {
       console.log('An error occurred while start the node application on port : %d', PORT);
       proccess.exit(1);
   }
   console.log("Node application successfully started http://localhost:%d", PORT);
});