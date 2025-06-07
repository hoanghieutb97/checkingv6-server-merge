
const { KeyAndApi } = require('../constants');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const filePath = path.join(KeyAndApi.serverFolder, 'status.txt');
const FormData = require('form-data');
const xulyLoiTrello = require('./xulyLoiTrello');

function addNewCardXlsx(linkFIle) {
    // console.log("adddd............",linkFIle);
    var fileName = path.basename(linkFIle);

    axios.post(`https://api.trello.com/1/cards?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`, {
        name: fileName,

        idList: KeyAndApi.startList,
    })
        .then((response) => {
            uploadFileToTrello(response.data.id, linkFIle);
            // console.log('Card created successfully. Card ID:', response.data.id);

        })
        .catch((error) => {
            xulyLoiTrello("addNewCardXlsx", "none", fileName, linkFIle)
            console.log(error);
        });



}
async function uploadFileToTrello(cardId, activeFile) {
    const formData = new FormData();
    formData.append('key', KeyAndApi.apiKey);
    formData.append('token', KeyAndApi.token);
    formData.append('file', fs.createReadStream(activeFile));

    try {
        const response = await axios.post(`https://api.trello.com/1/cards/${cardId}/attachments`, formData, {
            headers: formData.getHeaders(),
        });
        // console.log('File uploaded successfully:', response.data);
    } catch (error) {
        xulyLoiTrello("uploadFileToTrello", cardId, activeFile)

    }
}


module.exports = {addNewCardXlsx,uploadFileToTrello};