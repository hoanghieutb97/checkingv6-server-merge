// //////////////////////////////////////////////////////////////////////////
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const fetch = require('node-fetch');
const express = require('express');
const app = express();

app.use(cors()); // Sử dụng CORS middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Cho phép xử lý JSON payload
const cal_ArrayDeleteCardId = require('./calFunctionServer/cal_ArrayDeleteCardId');
const cal_getLinkFileTool = require('./calFunctionServer/cal_getLinkFileTool');
const moveToRunDone = require('./XuLyTrello/moveToRunDone');
const addDescriptions = require('./XuLyTrello/addDescriptions');
const webHookTrello = require('./XuLyTrello/webHookTrello');
const checkCreateCard = require('./XuLyTrello/checkCreateCard');
const create_Webhook_Trello = require('./container/create_Webhook_Trello');
const ngrok = require('ngrok');
const wol = require('wake_on_lan');

const getListTrelloAuto = require('./container/getListTrelloAuto');
const fs = require('fs').promises;
const { KeyAndApi } = require('./constants');
const checkAwaitPhotoshop = require('./fetchClient/checkAwaitPhotoshop');
const runScriptTool = require('./fetchClient/runScriptTool');
const cal_newIPClient = require('./calFunctionServer/cal_newIPClient');
const { log } = require('console');
const { startJSONServer, resetServer, startCheckingv4Ultimate, startDongBoFile, startTaiExcel } = require('./startServer/startServer');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Cho phép tất cả các nguồn
        methods: ["GET", "POST"]
    }
});

// Import và setup Socket.IO
const setupSocketIO = require('./container/socketHandler');
setupSocketIO(io);

/////*** *///////////*** */
// startJSONServer();
// resetServer();
// startCheckingv4Ultimate();
// startDongBoFile();
// startTaiExcel();
/////*** *///////////*** */
create_Webhook_Trello();


global.listIP = [];
global.listTrello = [];
checkCreateCard();  // xu ly loi up file va tao the
getListTrelloAuto(); // xu ly lkoi ko chay tiep

// Kết nối đến Ngrok


app.post('/reactSendTrello', async (req, res) => {
    try {
        // Kiểm tra dữ liệu đầu vào từ client
        if (!req.body?.data || !Array.isArray(req.body.data)) {
            return res.status(400).json({ error: 'Dữ liệu đầu vào không hợp lệ' });
        }

        // Reset danh sách Trello toàn cục
        global.listTrello = [];
        const listCard = req.body.data;
        const newLtCard = [];

        // Xử lý từng card trong danh sách
        for (const card of listCard) {
            if (!card?.cardId) continue;

            try {
                // Lấy thông tin attachments của card từ Trello API
                const url = `https://api.trello.com/1/cards/${card.cardId}/attachments?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`;
                const response = await axios.get(url);

                if (!response?.data) continue;

                // Lọc ra các file xlsx từ attachments
                const xlsxAttachments = response.data.filter(attachment => {
                    if (!attachment?.name) return false;
                    const fileName = attachment.name.split(".").pop();
                    return fileName?.toLowerCase() === "xlsx";
                });

                // Nếu có file xlsx, thêm vào danh sách xử lý
                if (xlsxAttachments.length > 0) {
                    newLtCard.push({
                        cardId: card.cardId,
                        url: xlsxAttachments[0].url,
                        nameCard: card.nameCard,
                        sttDateImg: response.data.length === 1 // true nếu chỉ có 1 file đính kèm
                    });
                }
            } catch (error) {
                console.error(`Lỗi khi xử lý card ${card.cardId}:`, error.message);
            }
        }

        // Xử lý các card mới với delay 1 giây giữa mỗi card
        for (const card of newLtCard) {
            try {
                if (!card?.cardId) continue;
                // Gọi webhook để xử lý card
                await webHookTrello(card, card.sttDateImg);
                // Đợi 1 giây trước khi xử lý card tiếp theo
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Lỗi khi xử lý webhook cho card ${card.cardId}:`, error.message);
            }
        }

        // Trả về kết quả thành công
        res.status(200).json({ 
            message: 'oke', 
            processedCards: newLtCard.length // Số lượng card đã xử lý
        });
    } catch (error) {
        // Xử lý lỗi tổng thể
        console.error('Lỗi trong quá trình xử lý /reactSendTrello:', error.message);
        res.status(500).json({ error: 'Lỗi server nội bộ' });
    }
});

// Thiết lập một endpoint để nhận webhook từ Trello
const { handleWebhook } = require('./container/webHookTrello');
app.post('/webhook/trello', handleWebhook);




app.get('/webhook/trello', (req, res) => {  // để chạy api kích hoạt weebhook trello
    console.log('Webhook received! GET');

    // Tắt caching
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache'); // Cho các client cũ
    res.set('Expires', '0');       // Ngăn mọi cache
    res.status(200).send('Success');
});


app.get('/', (req, res) => {
    res.send('Hello from server');
});

// Xử lý kết nối Socket.IO
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Lưu thông tin client
    const clientInfo = {
        id: socket.id,
        ip: socket.handshake.address,
        state: 'awaitReady'
    };

    // Thêm client vào danh sách
    if (!global.listIP) global.listIP = [];
    global.listIP.push(clientInfo);

    // Xử lý khi client gửi trạng thái
    socket.on('clientState', async (data) => {
        console.log('Client state update:', socket.id, data);
        
        // Cập nhật trạng thái client
        const clientIndex = global.listIP.findIndex(c => c.id === socket.id);
        if (clientIndex !== -1) {
            global.listIP[clientIndex] = {
                ...global.listIP[clientIndex],
                state: data.state,
                cardId: data.cardId
            };
        }

        // Xử lý card nếu có
        if (data.cardId) {
            try {
                // Xóa card khỏi hàng chờ và thêm description
                const descrpt = cal_getLinkFileTool(data.cardId, global.listTrello);
                if (descrpt) await addDescriptions(data.cardId, descrpt);

                const newListTrello = cal_ArrayDeleteCardId(data.cardId, global.listTrello);
                global.listTrello = newListTrello;

                if (data.err) {
                    // Xử lý lỗi
                    await axios.put(`https://api.trello.com/1/cards/${data.cardId}`, {
                        idList: KeyAndApi.listRunErr,
                        key: KeyAndApi.apiKey,
                        token: KeyAndApi.token
                    });
                } else {
                    // Chuyển card sang hoàn thành
                    await moveToRunDone(data.cardId);
                }
            } catch (error) {
                console.error('Error processing card:', error);
            }
        }

        // Gửi card mới nếu client sẵn sàng
        if (data.state === 'awaitReady' && global.listTrello.length > 0) {
            const availableCard = global.listTrello.find(card => card.state === 'awaitReady');
            if (availableCard) {
                availableCard.state = 'busy';
                socket.emit('newCard', {
                    cardId: availableCard.cardId,
                    json: availableCard.json
                });
            }
        }
    });

    // Xử lý khi client ngắt kết nối
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        // Xóa client khỏi danh sách
        global.listIP = global.listIP.filter(c => c.id !== socket.id);
    });
});

app.get('/checkStatusServer', (req, res) => {  // để chạy api kích hoạt weebhook trello


    // Đặt header Cache-Control để tránh 304
    res.set('Cache-Control', 'no-store');
    res.status(200).send('Success');
});


let listTrelloLength = global.listTrello.length;
setInterval(() => {
    // console.log(listTrelloLength, global.listTrello.length);

    if (listTrelloLength !== global.listTrello.length) {


        io.emit('welcome', global.listTrello.length);
        listTrelloLength = global.listTrello.length;
    }
}, 1000);


// Khởi động server
const PORT = KeyAndApi.port || 3999;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


///// khai bao weebhook
/////   https://api.trello.com/1/webhooks?key=4ab2789218e562d5eee1b5cc9c0a72f6&token=ATTAe7cd4c745f63ae54df2577566a5bc194802e80367f2327bb9259058ba41232162FEC0C48&callbackURL=https://a4d8-101-99-6-103.ngrok-free.app/webhook/trello&idModel=659392077c1ff60559669e1f
