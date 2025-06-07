const axios = require('axios');
const addLabel_SheetFail = require('../XuLyTrello/addLabel_SheetFail');
const addLabel_fileDeisn = require('../XuLyTrello/addLabel_fileDeisn');
const moveToListError = require('../XuLyTrello/moveToListError');


async function runScriptTool(ip, JSONFILE) {
    console.log(ip,"send : ",JSONFILE.fileName);
    const url = `http://${ip}:4444/runScriptTool`;

    try {
        const response = await axios.post(url, JSONFILE, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data == "loi fetch Gllm") {
            addLabel_SheetFail(JSONFILE.cardId);
            moveToListError(JSONFILE.cardId);
            return false
        }
        if (response.data == "loi khi tai file Client") {
            addLabel_fileDeisn(JSONFILE.cardId);
            moveToListError(JSONFILE.cardId);
            return false
        }


        return true
    } catch (err) {
console.log("err resppone /runScriptTool");
        return true
    }
}

module.exports = runScriptTool;