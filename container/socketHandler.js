const { KeyAndApi } = require('../constants');
const cal_getLinkFileTool = require('../calFunctionServer/cal_getLinkFileTool');
const cal_ArrayDeleteCardId = require('../calFunctionServer/cal_ArrayDeleteCardId');
const addDescriptions = require('../XuLyTrello/addDescriptions');
const moveToRunDone = require('../XuLyTrello/moveToRunDone');
const axios = require('axios');

// Hàm gửi card tiếp theo cho client
function sendNextCard(socket) {
    // Tìm card đầu tiên đang chờ
    const nextCard = global.listTrello.find(card => card.state === 'awaitReady');
    
    if (nextCard) {
        // Đánh dấu card đang được xử lý
        nextCard.state = 'busy';
        
        // Gửi card cho client
        socket.emit('newCard', {
            cardId: nextCard.cardId,
            json: nextCard.json
        });
        
        console.log(`Đã gửi card ${nextCard.cardId} cho client ${socket.id}`);
        return true;
    }
    
    return false;
}

function setupSocketIO(io) {
    // Khởi tạo global variables nếu chưa có
    if (!global.listTrello) global.listTrello = [];
    if (!global.listIP) global.listIP = [];

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        // Lưu thông tin client
        const clientInfo = {
            id: socket.id,
            ip: socket.handshake.address,
            state: 'awaitReady'
        };

        // Thêm client vào danh sách
        global.listIP.push(clientInfo);
        console.log(`Client ${socket.id} đã được thêm vào danh sách`);

        // Gửi card đầu tiên nếu có
        sendNextCard(socket);

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
                        console.log(`Card ${data.cardId} đã được chuyển sang danh sách lỗi`);
                    } else {
                        // Chuyển card sang hoàn thành
                        await moveToRunDone(data.cardId);
                        console.log(`Card ${data.cardId} đã được chuyển sang hoàn thành`);
                    }
                } catch (error) {
                    console.error('Error processing card:', error);
                }
            }

            // Nếu client sẵn sàng, gửi card tiếp theo
            if (data.state === 'awaitReady') {
                sendNextCard(socket);
            }
        });

        // Xử lý khi client ngắt kết nối
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
            // Xóa client khỏi danh sách
            global.listIP = global.listIP.filter(c => c.id !== socket.id);
            console.log(`Client ${socket.id} đã được xóa khỏi danh sách`);
        });
    });
}

module.exports = setupSocketIO; 