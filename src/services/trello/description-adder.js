const { KeyAndApi } = require('../../config/constants');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./error-handler');
const filePath = path.join(KeyAndApi.serverFolder, 'status.txt');
function addDescriptions(cardId, descrpt) {

    axios.put(`https://api.trello.com/1/cards/${cardId}`, {
        desc: descrpt,
        key: KeyAndApi.apiKey,
        token: KeyAndApi.token
    }).then(function (response) {
        // Xử lý thành công


    })
        .catch(function (error) {
            // Xử lý lỗi
            // xulyLoiTrello("addDescriptions", cardId, descrpt)
            
        })
        .then(function () {
            // Luôn được thực thi

        });
}
module.exports = addDescriptions;