const { KeyAndApi } = require('../../config/constants');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./error-handler');
const filePath = path.join(KeyAndApi.serverFolder, 'status.txt');

function addComment(data, JSONFILE) {
    const longText = JSONFILE.value.items.map(itemx => (itemx.orderId)).join("\n");
    var url2 = `https://api.trello.com/1/cards/${data.cardId}/actions/comments?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`
    axios.post(url2, { text: longText + "\n" + data.cardId }, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        // Xử lý thành công
        console.log("✅ Đã thêm comment thành công");
    })
    .catch(function (error) {
        console.error("❌ Lỗi khi thêm comment:", error.message);
        // xulyLoiTrello("addComment", data.cardId, longText)
    })
    .then(function () {
        // Luôn được thực thi
    });
}

module.exports = { addComment };