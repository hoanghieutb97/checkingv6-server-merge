const axios = require('axios');
const { KeyAndApi } = require('../../config/constants');
const { processCard } = require('./webhook');

async function getListTrelloAuto() {
    try {
        // Kiểm tra biến toàn cục
        if (!global.listTrello) global.listTrello = [];
        if (!global.listIP) global.listIP = [];

        console.log("\n=== Bắt đầu kiểm tra danh sách Trello ===");
        console.log("Số lượng card đang xử lý:", global.listTrello.length);
        console.log("Số lượng client đang kết nối:", global.listIP.length);

        // Kiểm tra trạng thái của danh sách
        const StateListtrello = [...new Set(global.listTrello.map(item => item?.state).filter(Boolean))];
        const StateListIP = [...new Set(global.listIP.map(item => item?.state).filter(Boolean))];

        console.log("Trạng thái các card:", StateListtrello);
        console.log("Trạng thái các client:", StateListIP);

        const isAllBusy = StateListtrello.length === 1 && StateListtrello[0] === "busy";
        const isAllAwaitReady = StateListIP.length === 1 && StateListIP[0] === "awaitReady";
        const shouldFetchNewCards = global.listTrello.length === 0 || (isAllBusy && isAllAwaitReady);

        console.log("Cần lấy card mới:", shouldFetchNewCards ? "Có" : "Không");

        if (shouldFetchNewCards) {
            console.log("\n=== Bắt đầu lấy card mới từ Trello ===");
            
            // Kiểm tra KeyAndApi
            if (!KeyAndApi?.startList || !KeyAndApi?.apiKey || !KeyAndApi?.token) {
                throw new Error("Missing required Trello API credentials");
            }

            console.log("Đang lấy danh sách card từ list:", KeyAndApi.startList);
            const responseAll = await axios.get(
                `https://api.trello.com/1/lists/${KeyAndApi.startList}/cards?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`
            );

            if (!responseAll?.data) {
                throw new Error("Invalid response from Trello API");
            }

            global.listTrello = [];
            const listCard = responseAll.data.map(item => ({ 
                cardId: item.id, 
                nameCard: item.name 
            }));
            
            console.log("Tìm thấy", listCard.length, "card trong list");

            const newLtCard = [];
            console.log("\n=== Kiểm tra file Excel trong các card ===");
            for (const card of listCard) {
                if (!card?.cardId) continue;

                try {
                    console.log(`\nKiểm tra card ${card.cardId} (${card.nameCard})`);
                    const response = await axios.get(
                        `https://api.trello.com/1/cards/${card.cardId}/attachments?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`
                    );

                    if (!response?.data) {
                        console.log("Không tìm thấy attachments");
                        continue;
                    }

                    const xlsxAttachments = response.data.filter(attachment => {
                        if (!attachment?.name) return false;
                        const fileName = attachment.name.split(".").pop();
                        return fileName?.toLowerCase() === "xlsx";
                    });

                    if (xlsxAttachments.length > 0) {
                        console.log("Tìm thấy file Excel:", xlsxAttachments[0].name);
                        newLtCard.push({
                            cardId: card.cardId,
                            url: xlsxAttachments[0].url,
                            nameCard: card.nameCard,
                            sttDateImg: response.data.length === 1
                        });
                    } else {
                        console.log("Không tìm thấy file Excel");
                    }
                } catch (error) {
                    console.error(`Lỗi khi kiểm tra card ${card.cardId}:`, error.message);
                }
            }

            console.log("\n=== Bắt đầu xử lý các card có file Excel ===");
            console.log("Số lượng card cần xử lý:", newLtCard.length);

            // Xử lý các card mới với delay
            for (const card of newLtCard) {
                try {
                    if (!card?.cardId) continue;
                    console.log(`\nXử lý card ${card.cardId} (${card.nameCard})`);
                    await processCard(card, card.sttDateImg);
                    console.log("Đã thêm vào danh sách xử lý");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error(`Lỗi khi xử lý card ${card.cardId}:`, error.message);
                }
            }
        }

        console.log("\n=== Hoàn thành kiểm tra ===");
        // Lên lịch chạy lại sau 9 phút
        setTimeout(getListTrelloAuto, 540000);
    } catch (error) {
        console.error("\n=== Lỗi trong quá trình xử lý ===");
        console.error("Chi tiết lỗi:", error.message);
        // Nếu có lỗi, thử lại sau 1 phút
        setTimeout(getListTrelloAuto, 60000);
    }
}

module.exports = getListTrelloAuto; 