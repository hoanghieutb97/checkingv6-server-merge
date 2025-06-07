
const { KeyAndApi } = require('../constants');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xulyLoiTrello = require('./xulyLoiTrello');
const filePath = path.join(KeyAndApi.serverFolder, 'status.txt');
function moveToRunDone(cardId) {
    axios.put(`https://api.trello.com/1/cards/${cardId}`, {
        idList: KeyAndApi.listRunDone,
        key: KeyAndApi.apiKey,
        token: KeyAndApi.token
    }).then(function (response) {
        // Xử lý thành công


    })
        .catch(function (error) {
            // Xử lý lỗi
            // xulyLoiTrello("moveToRunDone", cardId, "none")

        })

}
module.exports = moveToRunDone;