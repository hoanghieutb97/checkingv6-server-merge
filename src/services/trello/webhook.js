const { KeyAndApi } = require('../../config/constants');

// Biến toàn cục để lưu danh sách card đang xử lý
global.listTrello = global.listTrello || [];

async function handleWebhook(req, res) {
    try {
        const action = req.body.action;
        const model = req.body.model;

        // Kiểm tra xem action có phải là tạo card mới không
        if (action.type === 'createCard' && action.data.list.id === KeyAndApi.startList) {
            const cardId = action.data.card.id;
            console.log('New card created:', cardId);

            // Thêm card vào danh sách xử lý
            if (!global.listTrello.includes(cardId)) {
                global.listTrello.push(cardId);
                console.log('Added to processing list:', cardId);
            }

            // Gửi thông báo cho tất cả client đang kết nối
            if (global.io) {
                global.io.emit('newCard', { cardId });
                console.log('Emitted newCard event to all clients');
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = { handleWebhook }; 