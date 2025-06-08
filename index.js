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
const webhookHandler = require('./src/services/trello/webhook');
const cardValidator = require('./src/services/trello/card-validator');
const webhookCreator = require('./src/services/trello/webhook-creator');
const getListTrelloAuto = require('./src/services/trello/getListTrelloAuto');
const { startJSONServer, resetServer, startCheckingv4Ultimate, startDongBoFile, startTaiExcel } = require('./src/server/startServer');

// ==================== SERVER SETUP ====================
const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Import và setup Socket.IO
const setupSocketIO = require('./src/services/trello/socket-handler');
setupSocketIO(io);

// ==================== GLOBAL VARIABLES ====================
global.listIP = [];
global.listTrello = [];

// ==================== INITIALIZATION ====================
cardValidator();  // xử lý lỗi up file và tạo thẻ
getListTrelloAuto(); // xử lý lỗi không chạy tiếp
webhookCreator();

// ==================== API ROUTES ====================
// Route để nhận webhook từ Trello
const { handleWebhook } = require('./src/services/trello/webhook');
app.post('/webhook/trello', handleWebhook);

app.get('/webhook/trello', (req, res) => {
    console.log('Webhook received! GET');
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
