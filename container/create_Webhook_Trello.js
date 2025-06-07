const axios = require('axios');
const { KeyAndApi } = require('../constants');

async function create_Webhook_Trello() {

    const apiKey = KeyAndApi.apiKey;
    const tokenX = KeyAndApi.token;
    const callbackURL = 'http://101.99.6.103:' + KeyAndApi.port + '/webhook/trello';
    const idModel = KeyAndApi.startList;
    const url_list_hook_trello = `https://api.trello.com/1/tokens/${tokenX}/webhooks?key=${apiKey}&token=${tokenX}`;
    const paramsCreateWebhook = {
        key: apiKey,
        token: tokenX,
        callbackURL: callbackURL,
        idModel: idModel,

    };

    ///////////// kiểm tra tồn tại webhook cũ thì xóa đi
    await axios.get(url_list_hook_trello).then(async response => {
        for (let k = 0; k < response.data.length; k++) {
            if (response.data[k].idModel == idModel) {
                var urlhehe = `https://api.trello.com/1/webhooks/${response.data[k].id}?key=${apiKey}&token=${tokenX}`;
                await axios.delete(urlhehe)
                    .then(response => {
                        console.log('Webhook deleted successfully***************');
                    })
                    .catch(error => {
                        console.error('Error deleting webhook:', error);
                    });
            }
        }

    }).catch(error => {
        console.error('Error making GET request:', error);
    });


    //tạo webhook trello mới
    await axios.post("https://api.trello.com/1/webhooks", paramsCreateWebhook)
        .then(response => {
            console.log('Webhook Created:***********************');
        })
        .catch(error => {
            console.error('Error Creating Webhook///////////////////////:', error.response.data);
        });
}

module.exports = create_Webhook_Trello;