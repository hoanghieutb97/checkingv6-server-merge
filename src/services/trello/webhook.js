const { KeyAndApi } = require('../../config/constants');
const axios = require('axios');
const { addDateImage } = require('./date-image-adder');
const { addComment } = require('./comment-adder');
const readXlsxFile = require('read-excel-file/node');
const { InPutexcel, FetchXLSX } = require('../excel/InPutexcel');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Biến toàn cục để lưu danh sách card đang xử lý
global.listTrello = global.listTrello || [];

// Hàm xử lý một card
async function processCard(cardId) {
    try {
        console.log("\n=== Xử lý card:", cardId);
        
        // Lấy thông tin attachments của card
        const response = await axios.get(
            `https://api.trello.com/1/cards/${cardId}/attachments?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`
        );
        const attachments = response.data;
        
        console.log("Số lượng attachments:", attachments.length);

        // Kiểm tra file Excel
        const xlsxAttachments = attachments.filter(att => {
            if (!att || !att.name) {
                console.log("Attachment không hợp lệ:", att);
                return false;
            }
            const isXlsx = att.name.toLowerCase().endsWith('.xlsx');
            console.log("Kiểm tra file:", att.name, "là Excel:", isXlsx);
            return isXlsx;
        });

        if (xlsxAttachments.length > 0) {
            console.log("Card có file Excel");
            
            // Kiểm tra số lượng file
            const sttDateImg = attachments.length === 1;
            console.log("Trạng thái ảnh:", sttDateImg ? "Chỉ có file Excel" : "Có nhiều file");

            // Nếu chỉ có 1 file Excel, thêm ảnh ngày tháng
            if (sttDateImg) {
                console.log("Bắt đầu thêm ảnh ngày tháng vào card");
                try {
                    // Tải file Excel với authentication
                    const excelResponse = await axios.get(xlsxAttachments[0].url, { 
                        responseType: 'arraybuffer',
                        headers: {
                            'Authorization': `OAuth oauth_consumer_key="${KeyAndApi.apiKey}", oauth_token="${KeyAndApi.token}"`
                        }
                    });
                    
                    console.log("Đã tải file Excel thành công");
                    
                    // Tạo file tạm thời
                    const tempFilePath = path.join(os.tmpdir(), `excel-${Date.now()}.xlsx`);
                    await fs.writeFile(tempFilePath, excelResponse.data);
                    
                    try {
                        // Đọc file Excel trực tiếp
                        const rows = await readXlsxFile(tempFilePath);
                        
                        // Map dữ liệu từ Excel
                        const data = rows.map(item => ({
                            orderId: item[0],
                            barcode: item[1],
                            sku: item[2],
                            Quantity: item[3],
                            variant: item[4],
                            product: item[5],
                            country: item[6],
                            partner: item[7],
                            urlDesign: item[8],
                            dateItem: item[9],
                            orderName: item[10],
                            note: item[11],
                            location: item[12],
                            ItemBarcode: item[13],
                            TikTokShipBy: item[14],
                            Priority: item[15],
                            Factory: item[16],
                            ProductionNote: item[17],
                            QCNote: item[18],
                            Status: item[19]
                        }));

                        // Bỏ 2 dòng đầu và lọc bỏ các dòng không có orderId
                        data.shift();
                        data.shift();
                        const validData = data.filter(item => item.orderId !== null);
                        
                        if (!validData || validData.length === 0) {
                            console.log("❌ Không có dữ liệu hợp lệ trong file Excel");
                            return res.status(200).send('No valid data');
                        }

                        // Chuyển đổi dữ liệu thành định dạng items cho addDateImage
                        const items = validData.map(row => ({
                            dateItem: row.dateItem,
                            partner: row.partner,
                            orderId: row.orderId
                        }));

                        // Thêm ảnh ngày tháng
                        const result = await addDateImage(cardId, items);
                        if (result) {
                            console.log("✅ Đã thêm ảnh ngày tháng thành công");
                            
                            // Thêm comment với danh sách orderId
                            addComment({ cardId }, { value: { items: validData } });
                            console.log("✅ Đã thêm comment với danh sách orderId");
                        } else {
                            console.log("❌ Không thể thêm ảnh ngày tháng");
                        }
                    } finally {
                        // Xóa file tạm sau khi xử lý xong
                        try {
                            await fs.unlink(tempFilePath);
                        } catch (error) {
                            console.error('Error deleting temp file:', error);
                        }
                    }
                } catch (error) {
                    console.error("❌ Lỗi khi thêm ảnh ngày tháng:", error.message);
                    if (error.response) {
                        console.error("Chi tiết lỗi:", error.response.data);
                        console.error("Status code:", error.response.status);
                    }
                }
            }

            // Thêm card vào danh sách xử lý
            if (!global.listTrello.includes(cardId)) {
                global.listTrello.push(cardId);
                console.log("Đã thêm card vào danh sách xử lý");
            } else {
                console.log("Card đã có trong danh sách xử lý");
            }

            // Gửi thông báo cho tất cả client đang kết nối
            if (global.io) {
                global.io.emit('newCard', { 
                    cardId,
                    sttDateImg
                });
                console.log("Đã gửi thông báo cho tất cả client");
            }
        } else {
            console.log("Card không có file Excel, bỏ qua");
        }
    } catch (error) {
        console.error('Lỗi khi xử lý card:', error.message);
    }
}

// Hàm khởi động server
async function initializeServer() {
    try {
        console.log("\n=== Khởi động server ===");
        
        // Lấy tất cả card trong list
        const response = await axios.get(
            `https://api.trello.com/1/lists/${KeyAndApi.startList}/cards?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`
        );
        const cards = response.data;
        
        console.log("Số lượng card trong list:", cards.length);
        
        // Xử lý từng card
        for (const card of cards) {
            await processCard(card.id);
        }
        
        console.log("=== Hoàn thành khởi động server ===\n");
    } catch (error) {
        console.error("Lỗi khi khởi động server:", error.message);
    }
}

// Hàm xử lý webhook
async function handleWebhook(req, res) {
    try {
        console.log("\n=== Nhận webhook từ Trello ===");
        const action = req.body.action;
        const model = req.body.model;

        // Kiểm tra xem action có phải là tạo card mới hoặc thêm attachment không
        if ((action.type === 'createCard' || action.type === 'addAttachmentToCard') && 
            action.data.list.id === KeyAndApi.startList) {
            const cardId = action.data.card.id;
            await processCard(cardId);
        } else {
            console.log("Không phải action tạo card mới hoặc không phải list cần xử lý");
        }

        res.status(200).send('OK');
        console.log("=== Hoàn thành xử lý webhook ===\n");
    } catch (error) {
        console.error("\n=== Lỗi khi xử lý webhook ===");
        console.error("Chi tiết lỗi:", error);
        res.status(500).send('Internal Server Error');
    }
}

// Export cả hai hàm
module.exports = {
    handleWebhook,
    initializeServer,
    processCard
}; 