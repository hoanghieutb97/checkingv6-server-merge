const axios = require('axios');
const { addNewCardXlsx, uploadFileToTrello } = require('./addNewCardXlsx');

const { KeyAndApi } = require('../constants');

async function checkCreateCard() {
    try {
        var listCreate = await axios.get('http://192.168.1.194:3333/create');
        listCreate = listCreate.data;
        // console.log(listCreate.length);
        for (let i = 0; i < listCreate.length; i++) {

            await axios.get(`https://api.trello.com/1/search?idBoards=${KeyAndApi.activeBoard}&key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}&query=name:${listCreate[i].content}&modelTypes=cards`)
                .then(async (response) => {
                    axios.delete('http://192.168.1.194:3333/create/' + listCreate[i].id);
                    if (response.data.cards.length > 0)  // tim thu, neu >0 la da co roi
                        await uploadFileToTrello(response.data.cards[0].id, listCreate[i].linkFile);
                    else await addNewCardXlsx(listCreate[i].linkFile)
                })
                .catch((error) => {

                });
        }



        var listFile = await axios.get('http://192.168.1.194:3333/file');
        listFile = listFile.data;
        // console.log(listCreate.length);
        for (let i = 0; i < listFile.length; i++) {

            const url = `https://api.trello.com/1/cards/${listFile[i].cardId}/attachments?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`;
            const response = (await axios.get(url)).data;
            var coFIleXlsx = false;
            for (let j = 0; j < response.length; j++) {
                var fileName = response[j].name;
                fileName = fileName.split(".").pop();
                if (fileName == "xlsx") coFIleXlsx = true;
                break;
            }
            if (!coFIleXlsx) {
                await uploadFileToTrello(listFile[i].cardId, listFile[i].content)
            }
            await axios.delete('http://192.168.1.194:3333/file/' + listFile[i].id);
        }
    } catch (error) {

    }

    setTimeout(checkCreateCard, 540000); // Thử lại sau 30 phút mặc định
}
module.exports = checkCreateCard