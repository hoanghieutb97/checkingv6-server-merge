
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');
const KeyAndApi = {
  serverFolder: path.join(os.homedir(), 'Desktop', "ServerFile"),

};

const filePath = path.join(KeyAndApi.serverFolder, 'status.json');


// Đường dẫn đến file data.json


// Đọc dữ liệu từ file data.json
fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }
  var txtf = {
    hehe: 1, vl: "dbdbdf"
  }

  // In dữ liệu ra console
  console.log(data);

  // Nếu bạn muốn làm việc với dữ liệu JSON và chuyển nó thành một đối tượng JavaScript:
  try {
    var jsonData = JSON.parse(data);
    jsonData.push(txtf)


    fs.writeFile(filePath, JSON.stringify(jsonData), (err) => {

    });
  } catch (parseError) {
    console.error('Lỗi khi parse JSON:', parseError);
  }
});
