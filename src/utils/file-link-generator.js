const path = require('path');
const { KeyAndApi } = require('../config/constants');

function cal_getLinkFileTool(cardId, array) {

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