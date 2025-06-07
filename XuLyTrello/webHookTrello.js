

// //////////////////////////////////////////////////////////////////////////
const axios = require('axios');
const path = require('path');
const fetch = require('node-fetch');
const InPutexcel = require('./../calFunctionExcel/InPutexcel');
const tachState = require('./../calFunctionExcel/tachState');
const addComment = require('./../XuLyTrello/addComment');
const addDateImage = require('./addDateImage');
const addLabel_SheetFail = require('./addLabel_SheetFail');
const moveToListError = require('./moveToListError');
const fs = require('fs').promises;
const { KeyAndApi } = require('./../constants');
const checkAwaitPhotoshop = require('./../fetchClient/checkAwaitPhotoshop');
function webHookTrello(data, statusImageDate) {

    {  // Cập nhật với thông tin API Key, Token và URL đính kèm cụ thể
        const apiKey = KeyAndApi.apiKey;
        const token = KeyAndApi.token;
        const attachmentUrl = data.url;

        // Thiết lập header cho request
        const headers = {
            "Authorization": `OAuth oauth_consumer_key="${apiKey}", oauth_token="${token}"`
        };
        const directoryPath = KeyAndApi.filePath;
        // Thực hiện GET request để tải file

        fetch(attachmentUrl, { headers: headers })
            .then(response => {
                // Kiểm tra nếu response không thành công
                if (!response.ok) {
                    throw new Error(`Error! status: ${response.status}`);
                }
                return response.buffer();
            })
            .then(buffer => {
                const fileName = attachmentUrl.split('/').pop();  // Lấy tên file từ URL
                const filePath = path.join(directoryPath, fileName); // Tạo đường dẫn đầy đủ
                return fs.writeFile(filePath, buffer).then(() => {
                    console.log(`Đã tải và lưu attachment: ${filePath}`);
                    return filePath; // Trả lại đường dẫn file cho chuỗi promise tiếp theo
                });




            })
            .then(filePath => {
                // Sau khi ghi file hoàn tất, gọi InPutexcel

                return InPutexcel(filePath);

            }).then(JSONFILE => {
                // console.trace(JSONFILE.value.items);
                console.log("Trang thai chay tool: ", JSONFILE.stt);
                if (JSONFILE.stt == 1) {
                    data = { ...data, json: JSONFILE.value, state: "awaitReady" }

                    listTrello = [...listTrello, data];


                    for (let i = 0; i < listIP.length; i++) {
                        if (listIP[i].state == "awaitReady") {
                            listIP[i].state == "busy";
                            checkAwaitPhotoshop(listIP[i].ip[0]);


                            break;
                        }
                    }
                        
                }
                else if (JSONFILE.stt == 0) { //file json không đảm bảo thì kéo sang lỗi

                    tachState(JSONFILE.value.items, data.cardId, data.nameCard);

                }
                else if (JSONFILE.stt == 2) { //file json không đảm bảo thì kéo sang lỗi
                    // addLabel_SheetFail(data.cardId);
                    moveToListError(data.cardId);

                }
                addComment(data, JSONFILE);
                if (statusImageDate) addDateImage(data.cardId, JSONFILE.value.items);
            }
            )
            .catch(err => console.log('Có lỗi:', err));

    }
    return true
}
module.exports = webHookTrello;