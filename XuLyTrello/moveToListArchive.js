
const { KeyAndApi } = require('../constants');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const xulyLoiTrello = require('./xulyLoiTrello');
const filePath = path.join(KeyAndApi.serverFolder, 'status.txt');
function moveToListArchive(cardId) {
    return axios.put(`https://api.trello.com/1/cards/${cardId}`, {
        idList: KeyAndApi.listArchive,
        key: KeyAndApi.apiKey,
        token: KeyAndApi.token
    }).then(function (response) {
        return true
        // Xử lý thành công
    })
        .catch(function (error) {
            
            return false
         
            // xulyLoiTrello("moveToListArchive", cardId, "none")

        })

}
module.exports = moveToListArchive;