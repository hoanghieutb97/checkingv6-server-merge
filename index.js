// ==================== IMPORTS ====================
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const ngrok = require('ngrok');
const wol = require('wake_on_lan');
const fs = require('fs').promises;
const { log } = require('console');
const { KeyAndApi } = require('./src/config/constants');

// Import local modules
const cardMover = require('./src/services/trello/card-mover');
const { handleWebhook, setIoInstance } = require('./src/services/trello/webhook');
const cardValidator = require('./src/services/trello/card-validator');
const webhookCreator = require('./src/services/trello/webhook-creator');
const getListTrelloAuto = require('./src/services/trello/getListTrelloAuto');
const { startJSONServer, resetServer, startCheckingv4Ultimate, startDongBoFile, startTaiExcel } = require('./src/server/startServer');
const connectDB = require('./src/config/db');
const { initializeSocket } = require('./src/services/trello/socket-handler');

// ==================== SERVER SETUP ====================
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = require('socket.io')(server);

// Import và setup Socket.IO
initializeSocket(io);

// Set io instance cho webhook
setIoInstance(io);

// ==================== GLOBAL VARIABLES ====================
global.listIP = [];
global.listTrello = [];

// ==================== INITIALIZATION ====================
async function initialize() {
    try {
        // 2. Kết nối database
        await connectDB();     
        // 3. Khởi động JSON Server
        await startJSONServer();
        // 4. Xử lý card và file
        await cardValidator();
        // 5. Tự động lấy card mới
        await getListTrelloAuto();
        // 6. Setup webhook Trello
        await webhookCreator();
      console.log('all start connected************');



    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

// Chạy khởi tạo
initialize();

// ==================== API ROUTES ====================
// Route để nhận webhook từ Trello
app.post('/webhook/trello', handleWebhook);

app.get('/webhook/trello', (req, res) => {
 
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.status(200).send('Success');
});

// ==================== SERVER START ====================
const PORT = KeyAndApi.port || 3999;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
