
const path = require('path');
const { KeyAndApi } = require('./../constants');

function cal_getLinkFileTool(cardId, array) {
    
    // console.log(cardId);
    // console.log(array.map(item => item.cardId));
    var itemc = array.filter(item => (item.cardId == cardId))
    if (itemc.length > 0) {
        itemc = itemc[0];
        var type = itemc.json.type;
        var FileName = itemc.json.fileName.replace(/\..+$/, '');
        const linkFile = path.join(KeyAndApi.serverFile, type + "-" + FileName); // Tạo đường dẫn đầy đủ
        
        return linkFile
    } return false

}
module.exports = cal_getLinkFileTool;