const path = require('path');
const os = require('os');

const filePath = path.join(os.homedir(), 'Desktop', "ServerFile", "xlsx");
const KeyAndApi = {
    listRunDone: "65d461446ba45af7d047e0b5",
    listRunErr: "659802d136aaf9f9db745e0c",
    listArchive: "65d48349181acc584b21736d",
    startList: "659392077c1ff60559669e1f",
    activeBoard: "619a55bb16b4572362761d0a",
    port: 3999,

    // Cập nhật với thông tin API Key, Token và URL đính kèm cụ thể
    apiKey: 'eaab65cdb6b3f930891953f93327e65e',
    token: 'ATTA9890326a872fc0376b216d80d4582602fcf88703471fda6cb1b13f33b6c9702008C31C28',
    filePath: path.join(os.homedir(), 'Desktop', "ServerFile", "xlsx"),
    // gllm: 'https://sheetdb.io/api/v1/xvqhrhg4y9avq',
    gllm: 'https://sheet.best/api/sheets/e8876c80-1778-414d-ae68-af6b9ec1289c',

    Label_fail_sheet: "65d990c495d5d9682154a9dc",
    Label_fail_FIleDesign: "65d99061e3c2ddd5e0dfd1bb",

    serverFile: "\\\\192.168.1.240\\in",
    serverFolder: path.join(os.homedir(), 'Desktop', "ServerFile"),

    ngrokToken: '2yDyF3poD5a55lUrTNmXYb9F45i_3mwchzrrcfcWY5xSZNxCV',

};

const SortByProduct = {
    variant_orderId_sku: [
        "PC glass", "PC luminous", "PC led", "print metal", "thot 5mm",
        "cut metal", "3d wood base", "thot den", "thot amazone",
        "PC silicon", "FatherDayZirror", "dia nhua", "mica DZT Style",
        "Photo Magnet", "Wooden Parterre", "photo frame lamp",
        "Custom Acrylic Name Night Light pine", "Led Light Wood Base TMZ",
        " Wooden Picture Frame Magnet", "Custom 2 Layered Acrylic Keychain", "Custom 2 Layered Art Piece",
    ],
    nameId_orderId_sku: [, "Leather Keychain", "2M Leather Keychain"],
    width_orderId_sku: ["Suncatcher Art Piece",
        "1 Layer Suncatcher Ornament",
        "suncatcher",
        "ornament mica 1M-Singer",
        "tranh trang guong",

        "Magnetic Car Visor Photo Clip",
        "Custom Shape Photo Light Box",
        "ornament mica 2M-Singer",
        "ornament go 1M-Singer",
        "ornament go 2M-Singer",
        "2layer wood ornament",
        "3L Shaker Ornament",
        "5L Shaker Ornament",
        "2 layer mix",
        "Stained Glass Suncatcher",
        "Christmas Tree Topper",
        "Desk Name Plate Night Light",

        "NEW transparent ORM 1M",
        "NEW transparent ORM 1M no white",
        "A Custom Shape Keychain With Charm",


        "NEW transparent ORM 1M Wooden",
        "NEW transparent ORM 2M",
        "Stained Glass Suncatcher",
        "Stained Glass Ornament type 2",
        "Stained Glass Suncatcher - Type 2",
        "Stained Glass Ornament",
        "Custom Shape Fridge Magnet",

    ]

}
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
module.exports = { HWAll, KeyAndApi, SortByProduct };