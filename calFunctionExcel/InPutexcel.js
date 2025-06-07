

const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const _ = require('lodash');
const { HWAll, KeyAndApi, SortByProduct } = require('./../constants');

const readXlsxFile = require('read-excel-file/node')
async function FetchGLLM() {
    const url = KeyAndApi.gllm;
    const response = await axios.get(url);
    var GLLM = response.data.filter(item => (item.variant !== "" && item.variant !== null && item.ProductType !== "" && item.ProductType !== null));


    GLLM = GLLM.map(item => {
        let item2 = item;
        // if(item.variant == null|| item.ProductType == null) console.log(item2);
        item2.ProductType = item2.ProductType.toLowerCase().trim().replace(/ /g, '').split(",");
        item2.variant = item2.variant.toLowerCase().trim().replace(/ /g, '').split(",");
        return item2;
    })
    return GLLM
}

async function FetchXLSX(url) {
    var data = await readXlsxFile(url).then((rows) => {
        let newSheet = rows.map(item => ({
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


        }))

        newSheet.shift(); newSheet.shift();
        newSheet.filter(item => item.orderId !== null);
        return newSheet
    })
    return data

}


function mapSheetGllm(sheet, gllm) {
    // Hàm hỗ trợ để chọn các thuộc tính cần thiết từ một đối tượng
    function pickProperties(object, properties) {
        return properties.reduce((acc, prop) => {
            acc[prop] = object[prop];
            // console.log(acc);
            return acc;
        }, {});
    }
    function trimlower(item) {
        return item.trim().toLowerCase().replace(/\s+/g, '');
    }


    // Lọc ra các mục có nameId không phải là null
    gllm = gllm.filter(item => item.hight !== null);


    // Chuyển đổi dữ liệu 'gllm'
    gllm = gllm.map(item => ({
        ...item,
        hight: Number(item.hight),
        width: Number(item.width),
        box: item.box.split(",").map(Number),
        ProductType: (item.ProductType),
        variant: (item.variant),
        button: item.button || "normal",
        amountFile: (item.amountFile !== "1" && item.amountFile !== "2") ? "1" : item.amountFile
    }));

    sheet = sheet.map(itemSheet => {
        let filteredGllm = gllm.filter(itemGllm => {
            return _.intersection(itemGllm.ProductType, [trimlower(itemSheet.product)]).length !== 0 &&
                _.intersection(itemGllm.variant, [trimlower(itemSheet.variant)]).length !== 0
        }
        );
        // console.log(filteredGllm);
        if (filteredGllm.length === 0) {
            return { ...itemSheet, addGllm: false };
        } else {
            let [firstFilteredItem] = filteredGllm;
            return {
                ...itemSheet,
                addGllm: true,
                ...pickProperties(firstFilteredItem, ['nameId', 'box', 'button', 'direction', 'width', 'hight', 'amountFile', "state", "status"])
            };
        }
    });

    return sheet;
}
function dupItemsExcel(excel) {
    let newSheet = [];

    // Duyệt qua từng phần tử trong sheet và nhân bản theo Quantity
    excel.forEach(item => {
        for (let i = 0; i < item.Quantity; i++) {
            newSheet.push({ ...item }); // Sử dụng spread để sao chép phần tử
        }
    });

    // Gán số thứ tự cho mỗi phần tử
    newSheet = newSheet.map((item, key) => ({ ...item, stt: key + 1 }));

    // Tính toán và cập nhật lại Quantity cho mỗi phần tử dựa trên số lần orderId xuất hiện
    let orderIdCount = newSheet.reduce((acc, item) => {
        acc[item.orderId] = (acc[item.orderId] || 0) + 1;
        return acc;
    }, {});

    newSheet = newSheet.map(item => ({ ...item, QuantityAll: orderIdCount[item.orderId] }));

    return newSheet;
}

function HAllAndWAll(product, HWAll) {
    var hAll = 1250;
    var wAll = 2440;
    if (_.indexOf(HWAll.arrMica, product) !== (-1)) { hAll = 812; wAll = 1210 }
    else if (_.indexOf(HWAll.arrGo, product) !== (-1)) { hAll = 910; wAll = 910 }
    else if (_.indexOf(HWAll.arrMica2cm, product) !== (-1)) { hAll = 350; wAll = 2440 }
    else if (_.indexOf(HWAll.arrGoXXXXXX, product) !== (-1)) { hAll = 915; wAll = 915 }
    else if (_.indexOf(HWAll.arrNauBan, product) !== (-1)) { hAll = 600; wAll = 2400 }
    return { hAll: hAll, wAll: wAll }

}


function sortSheet(sheet) {

    var product = sheet[0].button
    if (product === "Acrylic Plaque") {
        let arr5 = _.chunk(sheet.filter(item => (item.nameId === "A.Plaque6x8in"
            || item.nameId === "DZT-Plaque6x8"
            || item.nameId === "wood-Plaque6x8in"
            || item.nameId === "2M-Plaque6x8inTMZ")), 5);

        let arr1 = sheet.filter(item => (item.nameId === "A.Plaque4x6in"
            || item.nameId === "DZT-Plaque4x6"
            || item.nameId === "wood-Plaque4x6in"));
        if (arr5.length > arr1.length) {
            for (let i = 0; i < arr5.length; i++) {
                if (arr1[i] !== undefined) arr5[i] = [...arr5[i], arr1[i]]
            }

            return _.flattenDeep(arr5)
        }
        else {
            for (let i = 0; i < arr1.length; i++) {
                if (arr5[i] !== undefined) arr1[i] = [...arr5[i], arr1[i]]

            }
            return _.flattenDeep(arr1)
        }

    }
    else
        if ((SortByProduct.variant_orderId_sku).includes(product)) {
            sheet = _.orderBy(sheet, ['variant', 'orderId', 'sku'], ['asc', 'asc', 'asc']).map((item, key) => ({ ...item, stt: key + 1 }));
        }

        else if ((SortByProduct.nameId_orderId_sku).includes(product)) {
            sheet = _.orderBy(sheet, ['nameId', 'orderId', 'sku'], ['asc', 'asc', 'asc']).map((item, key) => ({ ...item, stt: key + 1 }));
        }
        else if ((SortByProduct.width_orderId_sku).includes(product)) {
            sheet = _.orderBy(sheet, ['width', 'orderId', 'sku'], ['asc', 'asc', 'asc']).map((item, key) => ({ ...item, stt: key + 1 }));
        }
        else {
            sheet = _.orderBy(sheet, ['orderId', 'variant', 'sku'], ['asc', 'asc', 'asc']);
            sheet = sheet.map((item, key) => ({ ...item, stt: key + 1 }));
        }
    return sheet
}

function checkungtoll(excel) {
    var state = _.uniq(excel.map(item => item.state));

    // console.log(state);
    var status = _.uniq(excel.map(item => item.status));
    console.log(state, status);
    if (state.length == 1 && status[0] == "1") return 1
    else if (state.length != 1 && status.includes("1")) return 0
    return 2
}



async function InPutexcel(url) {
    var sheet = await FetchXLSX(url);
    var gllm = [];
    try {
        gllm = await FetchGLLM()
    } catch (error) {
        gllm = false
    }
    if (!gllm) return { stt: 2, value: [] }
    var excel = mapSheetGllm(sheet, gllm);

    excel = dupItemsExcel(excel);
    excel = sortSheet(excel);
    var fileName = path.basename(url)
    var HW_All = HAllAndWAll(excel[0].button, HWAll);
    var item = {
        items: excel,
        type: excel[0].button,
        hAll: HW_All.hAll,
        wAll: HW_All.wAll,
        fileName: fileName.replace(/\..+$/, ''),
        FileDesign: "~/Desktop/xoa"
    }

    return { stt: checkungtoll(excel), value: item }

}









module.exports = InPutexcel;
