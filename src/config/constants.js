const path = require('path');
const os = require('os');

const filePath = path.join(os.homedir(), 'Desktop', "ServerFile", "xlsx");
const KeyAndApi = {

// demo
    // listRunDone: "65d461446ba45af7d047e0b5",
    // listRunErr: "659802d136aaf9f9db745e0c",
    // listArchive: "65d48349181acc584b21736d",
    // startList: "659392077c1ff60559669e1f",
    // activeBoard: "619a55bb16b4572362761d0a",

    listRunDone: "65d98f472c22ba72b148a5b8",
    listRunErr: "65d98f4484ef9a8a0a55def0",
    listArchive: "683a7de10d4831b53b5c86e4",
    startList: "65d98f40df4df16ca1acfa3f",
    activeBoard: "6332d4cb72468903b0b52fd4",


    port: 3999,

    // Cập nhật với thông tin API Key, Token và URL đính kèm cụ thể
    apiKey: '622ec17c784493c10b02053fa175bc10',
    token: 'ATTA548f6cc8c5ad0cab7c233e787abe8d8f333ac10f0fcd1d05b8d18d85f75cc2d9EF60E1BD',
    // apiKey: 'eaab65cdb6b3f930891953f93327e65e',
    // token: 'ATTA9890326a872fc0376b216d80d4582602fcf88703471fda6cb1b13f33b6c9702008C31C28',
    filePath: path.join(os.homedir(), 'Desktop', "ServerFile", "xlsx"),
    // gllm: 'https://sheetdb.io/api/v1/xvqhrhg4y9avq',
    gllm: 'https://sheet.best/api/sheets/e8876c80-1778-414d-ae68-af6b9ec1289c',

    Label_fail_sheet: "65d990c495d5d9682154a9dc",
    Label_fail_FIleDesign: "65d99061e3c2ddd5e0dfd1bb",

    serverFile: "\\\\192.168.1.240\\in",
    serverFolder: path.join(os.homedir(), 'Desktop', "ServerFile"),

    ngrokToken: '2yDyF3poD5a55lUrTNmXYb9F45i_3mwchzrrcfcWY5xSZNxCV',
};

const HWAll = {
    arrMica: ["keyChain mirror",
        "NEW transparent ORM 1M",
        "NEW transparent ORM 2M",
        "ornament mica 1M-fill",
        "ornament mica 2M-fill",
        "ornament mica DZT",
        "ornament led",
        "3d wood base",
        "3d woodBase Teemazing",
        "Acrylic Plaque",
        "ornament qua ta nhom",
        "Acrylic Plaque TMZ",
        "mirror normal StrokFile",
        "photo frame lamp",
        "Acrylic Desk Plaque",
        "mica fix ornament 1M",
        "mica fix ornament 2M",
        "Tumble Name Tag",
        "5L Shaker Ornament",
        "3L Shaker Ornament",
        "Luminous Painting Lighting Box",
        "Led Light Wood Base TMZ",

    ],
    arrGo: ["wood orrnament 2layer",
        "ornament go 1M-Singer",
        "ornament go 2M-Singer",
        "ornament vong huong",
        "wood ornament dls",
        "wood fix ornament 2M",
        "wood fix ornament 1M",
        "3layer wood ornament",
        "2layer wood ornament",
        "wood fix ornament 1M",
        "Wooden Parterre",
        "wood fix ornament 2M"


    ],
    arrGoXXXXXX: ["FatherDayZirror"],
    arrMica2cm: ["Heart mica 2cm",
        "Acrylic Block",
        "Custom Acrylic Name Night Light",
        "Custom Acrylic Name Night Light pine",

    ],
    arrNauBan: ["ornament su 1M", "ornament su 2M"]
}

// Đường dẫn JSON Server
const JSON_SERVER = {
    PORT: 3333,
    DB_PATH: './dbjson',
    BASE_URL: 'http://192.168.1.240:3333',
    CREATE_ENDPOINT: 'http://192.168.1.240:3333/create',
    FILE_ENDPOINT: 'http://192.168.1.240:3333/file'
};

// Database configuration
const DATABASE = {
    MONGODB_URI: "mongodb+srv://hoanghieutb97:r8piz5uGp6OKcOGa@cluster0.elvs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
};

module.exports = {
    HWAll,
    KeyAndApi,
    JSON_SERVER,
    DATABASE
};