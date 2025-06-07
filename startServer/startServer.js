const { exec } = require('child_process');
const path = require('path');

function startJSONServer() {
  // Chuyển vào thư mục cần thiết
  const targetDir = 'F:\\dbjson';

  // Lệnh khởi động JSON Server
  const command = 'npx json-server --watch db.json --port 3333';

  // Thực thi lệnh trong thư mục mục tiêu
  exec(command, { cwd: targetDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting JSON Server: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`JSON Server stderr: ${stderr}`);
      return;
    }

    console.log(`JSON Server stdout: ${stdout}`);
  });
}
function resetServer() {
  // Thư mục cần thiết để chạy Node server
  const resetServerDir = 'F:\\reset-server';
  const nodeCommand = 'node .';

  // Thực thi lệnh Node server
  exec(nodeCommand, { cwd: resetServerDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting Node server: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`Node server stderr: ${stderr}`);
      return;
    }

    console.log(`Node server stdout: ${stdout}`);
  });
}
function startCheckingv4Ultimate() {
  const checkingDir = 'F:\\checkingv4-ultimate';
  const npmCommand = 'npm start';

  exec(npmCommand, { cwd: checkingDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting checkingv4-ultimate: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`checkingv4-ultimate stderr: ${stderr}`);
      return;
    }

    console.log(`checkingv4-ultimate stdout: ${stdout}`);
  });
}
function startDongBoFile() {
  const dongBoFileDir = 'F:\\dongBoFile';
  const nodeCommand = 'node .';

  exec(nodeCommand, { cwd: dongBoFileDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting dongBoFile: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`dongBoFile stderr: ${stderr}`);
      return;
    }

    console.log(`dongBoFile stdout: ${stdout}`);
  });
}

function startTaiExcel() {
  const taiExcelDir = 'F:\\tai-excel';
  const nodeCommand = 'node .';

  exec(nodeCommand, { cwd: taiExcelDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting tai-excel: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`tai-excel stderr: ${stderr}`);
      return;
    }

    console.log(`tai-excel stdout: ${stdout}`);
  });
}

module.exports = { startJSONServer, resetServer, startCheckingv4Ultimate, startDongBoFile, startTaiExcel };
