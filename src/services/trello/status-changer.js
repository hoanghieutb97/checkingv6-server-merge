const chokidar = require('chokidar');
const { KeyAndApi } = require('./../constants');
const path = require('path');
const fs = require('fs');
const filePathToWatch = path.join(KeyAndApi.serverFolder, "status.txt");

function onechaneStatus() {
    
    // const watcher = chokidar.watch(filePathToWatch, {
    //     // Tùy chọn có thể thêm ở đây
    // });
  
    // watcher.on('change', (path) => {
    //     fs.readFile(path, 'utf8', (err, data) => {
    //         if (err) {
    //             console.error(`Lỗi khi đọc nội dung của file: ${err}`);
    //             return;
    //         }

    //         console.log('Nội dung của file status:--------------------------', data);


    //     });
    // });
}module.exports=onechaneStatus;