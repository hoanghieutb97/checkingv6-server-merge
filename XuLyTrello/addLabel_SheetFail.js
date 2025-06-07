
const { KeyAndApi } = require('../constants');
const axios = require('axios');
function addLabel_SheetFail(cardId) {

  axios.put(`https://api.trello.com/1/cards/${cardId}/idLabels`, {
    value: KeyAndApi.Label_fail_sheet,
    key: KeyAndApi.apiKey,
    token: KeyAndApi.token
  }).then(function (response) {
    // Xử lý thành công


  })
    .catch(function (error) {
  
    })
    .then(function () {
      // Luôn được thực thi

    });
}
module.exports = addLabel_SheetFail;