const { KeyAndApi } = require('./../constants');

const path = require('path');
const fs = require('fs').promises;
var tachStatePath = path.join(KeyAndApi.serverFolder, 'tachState');

const ExcelJS = require('exceljs');
const moveToListArchive = require('../XuLyTrello/moveToListArchive');
const { addNewCardXlsx } = require('../XuLyTrello/addNewCardXlsx');
const moveToListError = require('../XuLyTrello/moveToListError');
async function tachState(items, cardId, nameCard) {

    var nameWithoutExtension = nameCard.split('.')[0];
    var nameRandom = nameWithoutExtension.split('_').pop();

    nameCard = nameCard.split(".");
    nameCard.pop();
    nameCard = nameCard.join(" ");
    var containerXLSX = path.join(tachStatePath, nameCard);
    fs.mkdir(containerXLSX, { recursive: true }, (err) => {
        if (err) {
            console.error('Lỗi khi tạo thư mục:', err);
            return;
        }

    });
    const groupedByState = items.reduce((acc, item) => {
        if (!acc[item.state]) {
            acc[item.state] = [];
        }
        acc[item.state].push(item);
        return acc;
    }, {});

    var allStates = Object.keys(groupedByState); // ten key cua cac mang  groupedByState
    if ((allStates.length == 1) && (groupedByState[allStates[0]].status !== 1)) { // truong hop chung 1 state va status !==1
        moveToListError(cardId);
    }
    else {

        const createExcelFiles = async () => {
            let excelCreationPromises = [];
            let ListFIleTach = [];

            for (let i = 0; i < allStates.length; i++) {
                const valueItems = groupedByState[allStates[i]];

                var name = valueItems[0].product;
                var soLuong = valueItems.length;
                var x = new Date(valueItems[0].dateItem);
                var ngay = x.getDate().toString().padStart(2, '0') + "-" + (x.getMonth() + 1).toString().padStart(2, '0') + "-" + x.getFullYear() + "-" + x.getHours().toString().padStart(2, '0') + "h";
                var stateF = valueItems[0].state;
                var nameTong = soLuong + "_" + name + "_" + ngay + "_" + stateF + "_" + nameRandom;
                var filePath = path.join(containerXLSX, nameTong + '.xlsx');
                console.log(filePath);
                valueItems.unshift({
                    orderId: '#OrderId',
                    barcode: 'Barcode',
                    sku: 'SKU',
                    Quantity: "Quantity",
                    variant: 'Variant',
                    product: 'Product Type',
                    country: 'Country Code',
                    partner: 'Partner',
                    urlDesign: 'Design URL',
                    dateItem: 'Date Received',
                    orderName: 'Order Name',
                    note: "Note",
                    location: 'Location',
                    ItemBarcode: 'Item Barcode',
                    OrderType: "Order Type",
                    addGllm: "",
                    nameId: '',
                    box: "",
                    button: '',
                    direction: '',
                    width: "",
                    hight: "",
                    amountFile: '',
                    state: '',
                    status: '',
                    stt: "",
                    TikTokShipBy: "TikTok Ship By",
                    Priority: "Priority",
                    Factory: "Factory",
                    ProductionNote: "Production Note",
                    QCNote: "QC Note",
                    Status: "Status"
                })
                async function createExcelFile(data, filePath, nameTong) {
                    const workbook = new ExcelJS.Workbook(); // Tạo một workbook mới
                    const sheet = workbook.addWorksheet('Sheet 1'); // Thêm một worksheet

                    // Định nghĩa tiêu đề cho mỗi cột
                    sheet.columns = [
                        { header: '#OrderId', key: 'orderId', width: 10 },
                        { header: 'Barcode', key: 'barcode', width: 10 },
                        { header: 'SKU', key: 'sku', width: 10 },
                        { header: 'Quantity', key: 'Quantity', width: 10 },
                        { header: 'Variant', key: 'variant', width: 10 },
                        { header: 'Product Type', key: 'product', width: 10 },
                        { header: 'Country Code', key: 'country', width: 10 },
                        { header: 'Partner', key: 'partner', width: 10 },
                        { header: 'Design URL', key: 'urlDesign', width: 10 },
                        { header: 'Date Received', key: 'dateItem', width: 10 },
                        { header: 'Order Name', key: 'orderName', width: 10 },
                        { header: 'Note', key: 'note', width: 10 },
                        { header: 'Location', key: 'location', width: 10 },
                        { header: 'Item Barcode', key: 'ItemBarcode', width: 10 },
                        { header: 'Order Type', key: 'OrderType', width: 10 },
                        { header: 'TikTok Ship By', key: 'TikTokShipBy', width: 10 },
                        { header: 'Priority', key: 'Priority', width: 10 },
                        { header: 'Factory', key: 'Factory', width: 10 },
                        { header: 'Production Note', key: 'ProductionNote', width: 10 },
                        { header: 'QC Note', key: 'QCNote', width: 10 },
                        { header: 'Status', key: 'Status', width: 10 }
             

                    ];

                    // Thêm dữ liệu vào sheet
                    data.forEach((item) => {
                        sheet.addRow(item);
                    })
                    await workbook.xlsx.writeFile(filePath);
                    return nameTong
                }

                let promise = createExcelFile(valueItems, filePath, nameTong)
                    .then((fileName) => console.log(fileName, " : đã tách và  lưu thành công"))
                    .catch((error) => console.error('Đã xảy ra lỗi khi tạo file Excel:', error));
                excelCreationPromises.push(promise);
                ListFIleTach.push(filePath);
            }
            // Chờ cho đến khi tất cả Promises trong mảng hoàn thành
            Promise.all(excelCreationPromises).then(async () => {
                var sttAcrchive = await moveToListArchive(cardId);
                // for (let j = 0; j < ListFIleTach.length; j++) {
                //     addNewCardXlsx(ListFIleTach[j])

                // }


                async function loopWithDelay() {
                    for (let j = 0; j < ListFIleTach.length; j++) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        addNewCardXlsx(ListFIleTach[j]);
                    }
                }

                if (sttAcrchive) {
                    console.log("trure!!!!!");
                    loopWithDelay();
                }
                else console.log("falseeeeeeeeeeeeeeeeeeee!!!!!!!!!!");





            }).catch((error) => {
                console.error("Đã xảy ra lỗi trong quá trình lưu các file Excel:", error);
            });
        }
        await createExcelFiles(); // Gọi hàm để thực hiện




    }


}



module.exports = tachState