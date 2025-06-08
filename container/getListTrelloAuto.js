const axios = require('axios');
const { KeyAndApi } = require('../constants');
const webHookTrello = require('../XuLyTrello/webHookTrello');

async function getListTrelloAuto() {
    try {
        // Kiểm tra biến toàn cục
        if (!global.listTrello) global.listTrello = [];
        if (!global.listIP) global.listIP = [];

        console.log("Checking Trello list status...");
        console.log("Current Trello list length:", global.listTrello.length);

        // Kiểm tra trạng thái của danh sách
        const StateListtrello = [...new Set(global.listTrello.map(item => item?.state).filter(Boolean))];
        const StateListIP = [...new Set(global.listIP.map(item => item?.state).filter(Boolean))];

        const isAllBusy = StateListtrello.length === 1 && StateListtrello[0] === "busy";
        const isAllAwaitReady = StateListIP.length === 1 && StateListIP[0] === "awaitReady";
        const shouldFetchNewCards = global.listTrello.length === 0 || (isAllBusy && isAllAwaitReady);

        if (shouldFetchNewCards) {
            console.log("Fetching new cards from Trello...");
            
            // Kiểm tra KeyAndApi
            if (!KeyAndApi?.startList || !KeyAndApi?.apiKey || !KeyAndApi?.token) {
                throw new Error("Missing required Trello API credentials");
            }

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
            
            console.log("Found cards:", listCard.length);

            const newLtCard = [];
            for (const card of listCard) {
                if (!card?.cardId) continue;

                try {
                    const response = await axios.get(
                        `https://api.trello.com/1/cards/${card.cardId}/attachments?key=${KeyAndApi.apiKey}&token=${KeyAndApi.token}`
                    );

                    if (!response?.data) continue;

                    const xlsxAttachments = response.data.filter(attachment => {
                        if (!attachment?.name) return false;
                        const fileName = attachment.name.split(".").pop();
                        return fileName?.toLowerCase() === "xlsx";
                    });

                    if (xlsxAttachments.length > 0) {
                        newLtCard.push({
                            cardId: card.cardId,
                            url: xlsxAttachments[0].url,
                            nameCard: card.nameCard,
                            sttDateImg: response.data.length === 1
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching attachments for card ${card.cardId}:`, error.message);
                }
            }

            // Xử lý các card mới với delay
            for (const card of newLtCard) {
                try {
                    if (!card?.cardId) continue;
                    await webHookTrello(card, card.sttDateImg);
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } catch (error) {
                    console.error(`Error processing card ${card.cardId}:`, error.message);
                }
            }
        }

        // Lên lịch chạy lại sau 9 phút
        setTimeout(getListTrelloAuto, 540000);
    } catch (error) {
        console.error("Error in getListTrelloAuto:", error.message);
        // Nếu có lỗi, thử lại sau 1 phút
        setTimeout(getListTrelloAuto, 60000);
    }
}

module.exports = getListTrelloAuto; 