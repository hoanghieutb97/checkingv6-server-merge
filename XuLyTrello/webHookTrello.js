// //////////////////////////////////////////////////////////////////////////
const axios = require('axios');
const path = require('path');
const fetch = require('node-fetch');
const InPutexcel = require('./../calFunctionExcel/InPutexcel');
const tachState = require('./../calFunctionExcel/tachState');
const addComment = require('./../XuLyTrello/addComment');
const addDateImage = require('./addDateImage');
const addLabel_SheetFail = require('./addLabel_SheetFail');
const moveToListError = require('./moveToListError');
const fs = require('fs').promises;
const { KeyAndApi } = require('./../constants');
const checkAwaitPhotoshop = require('./../fetchClient/checkAwaitPhotoshop');

function webHookTrello(data, statusImageDate) {
    // Cập nhật với thông tin API Key, Token và URL đính kèm cụ thể
    const apiKey = KeyAndApi.apiKey;
    const token = KeyAndApi.token;
    const attachmentUrl = data.url;
    const directoryPath = KeyAndApi.filePath;

    // Thiết lập header cho request
    const headers = {
        "Authorization": `OAuth oauth_consumer_key="${apiKey}", oauth_token="${token}"`
    };

    // Thực hiện GET request để tải file
    fetch(attachmentUrl, { headers: headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            return response.buffer();
        })
        .then(buffer => {
            const fileName = attachmentUrl.split('/').pop();
            const filePath = path.join(directoryPath, fileName);
            return fs.writeFile(filePath, buffer).then(() => {
                console.log(`Đã tải và lưu attachment: ${filePath}`);
                return filePath;
            });
        })
        .then(filePath => {
            return InPutexcel(filePath);
        })
        .then(JSONFILE => {
            console.log("Trang thai chay tool: ", JSONFILE.stt);
            
            if (JSONFILE.stt == 1) {
                // Thêm card mới vào global.listTrello
                if (!global.listTrello) global.listTrello = [];
                const newCard = { 
                    ...data, 
                    json: JSONFILE.value, 
                    state: "awaitReady" 
                };
                global.listTrello.push(newCard);
                console.log(`Đã thêm card ${data.cardId} vào hàng chờ`);
            }
            else if (JSONFILE.stt == 0) {
                tachState(JSONFILE.value.items, data.cardId, data.nameCard);
            }
            else if (JSONFILE.stt == 2) {
                moveToListError(data.cardId);
            }

            addComment(data, JSONFILE);
            if (statusImageDate) addDateImage(data.cardId, JSONFILE.value.items);
        })
        .catch(err => console.log('Có lỗi:', err));

    return true;
}

module.exports = webHookTrello;