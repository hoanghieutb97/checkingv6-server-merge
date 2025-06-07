
const { KeyAndApi } = require('../constants');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const filePath = path.join(KeyAndApi.serverFolder, 'status.txt');
const FormData = require('form-data');
const xulyLoiTrello = require('./xulyLoiTrello');
function addDateImage(cardId, items) {
  var listDate = items.map(item => item.dateItem);

  function findEarliestAndFormat(arr) {
    // Chuyển đổi mảng sang đối tượng Date và lưu index
    var dates = arr.map(function (datetime) {
      return new Date(datetime);
    });

    // Tìm ngày giờ sớm nhất
    var earliest = dates[0];
    for (var i = 1; i < dates.length; i++) {
      if (dates[i] < earliest) {
        earliest = dates[i];
      }
    }

    // Định dạng ngày-tháng-buổi
    var day = ('0' + earliest.getDate()).slice(-2);
    var month = ('0' + (earliest.getMonth() + 1)).slice(-2); // getMonth trả về 0-11
    var buoi = earliest.getHours() < 12 ? "sang" : "chieu";
    var formattedDate = day + "-" + month + "-" + buoi;

    // Trả về kết quả
    return formattedDate;
  }

  var nameFile = findEarliestAndFormat(listDate);

  var listKhach = items.map(item => item.partner.toLowerCase());

  var coKenNguyen = listKhach.includes("pwser1411");
  var coNCE = listKhach.includes("pwser115");

  var coCaHai = ["pwser1411", "pwser115"].every(item => listKhach.includes(item));

  var listOrderID = items.map(item => item.orderId.toLowerCase());

  var hasPWT = listOrderID.some(orderId => orderId.substring(0, 3).toLowerCase() === "pwt");

  var folerderName = "dateImage";
  if (coNCE || hasPWT) folerderName = "dateUT";

  if (coKenNguyen || coCaHai) folerderName = "dateKen";


  const activeFile = path.join(KeyAndApi.serverFolder, folerderName, nameFile + ".jpg"); // Đường dẫn tới file bạn muốn tải lên

  console.log("--------a-----------a-----------", activeFile);
  uploadFileToTrello(cardId, activeFile);
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
      // xulyLoiTrello("addDateImage", cardId, activeFile)

    }
  }


} 1
module.exports = addDateImage;