
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const Excel = require('exceljs');

const excelFileName = 'file.xlsx';
const DefaultLink = '//192.168.1.194/design';



/////////////////////////////drive
const readline = require('readline');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';



async function getOAuth2Client() {
    const credentials = JSON.parse(await fs.promises.readFile('credentials.json'));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    let token;
    try {
        token = JSON.parse(await fs.promises.readFile(TOKEN_PATH));
    } catch (error) {
        token = await getNewToken(oAuth2Client);
    }
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
}

async function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const code = await new Promise(resolve => rl.question('Enter the code from that page here: ', resolve));
    rl.close();
    const { tokens } = await oAuth2Client.getToken(code);
    await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    return tokens;
}

async function downloadImageDrive(auth, fileId, downloadDirectory, name) {
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.get({ fileId: fileId, fields: '*' });
    const link = res.data.webContentLink;
    const nameDrive = res.data.name;
    const imageExtension = nameDrive.split('.').pop();
    const imageName = `${name}.${imageExtension}`;
    const imagePath = path.join(downloadDirectory, imageName);
    try {
        const writer = fs.createWriteStream(imagePath);
        const response = await axios.get(link, { responseType: 'stream' });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.log("Error downloading image 1:", error);
    }

}

async function downloadImage(link, name, downloadDirectory) {
    const oAuth2Client = await getOAuth2Client();
    const match = link.match(/\/d\/(.+?)\//) || link.match(/id=([^&]+)/);
    if (match) {
        const fileId = match[1];
        await downloadImageDrive(oAuth2Client, fileId, downloadDirectory, name);
    } else {
        // Your existing logic for non-Google Drive links
        try {
            const response = await axios.get(link, { responseType: 'stream' });
            const imageExtension = link.split('.').pop().split('?')[0]; // Simplified extension extraction
            const imageName = `${name}.${imageExtension}`;
            const imagePath = path.join(downloadDirectory, imageName);
            const writer = fs.createWriteStream(imagePath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error("Error downloading image:", error.message);
        }
    }
}


async function readExcelAndDownloadImages(GLLM, sheet, NameFolder) {
    try {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(excelFileName);

        const worksheet = sheet;

        var downloadDirectory = DefaultLink + "/" + NameFolder


        if (!fs.existsSync(downloadDirectory)) {
            fs.mkdirSync(downloadDirectory);
        }
        async function processRows() {


            ///////////////////////////////////////////////////////////////////////
            try {


                for (let rowNumber = 3; rowNumber <= worksheet.rowCount; rowNumber++) {
                    const row = worksheet.getRow(rowNumber);
                    const [name, link, product, variant] = ['C', 'I', 'F', 'E'].map(col => row.getCell(col).value);
                    const dateParts = row.getCell('J').value.split(" ")[0].split("-");
                    const sccccc = GLLM.filter(item =>
                        _.intersection(item.ProductType, [product.toLowerCase().trim().replace(/ /g, '')]).length &&
                        _.intersection(item.variant, [variant.toLowerCase().trim().replace(/ /g, '')]).length
                    );

                    const basePath = path.join('//192.168.1.230/production', ...dateParts, product);
                    const formatLink = link => typeof (link) !== "object" ? link.replace(/www\.dropbox\.com/g, 'dl.dropboxusercontent.com') : link.text.replace(/www\.dropbox\.com/g, 'dl.dropboxusercontent.com');

                    // Function to process image download or copy
                    async function processImage(amountFile, nameSuffix = '') {
                        const imageName = `${name}${nameSuffix}.png`;
                        const imagePath = path.join(basePath, imageName);

                        if (!fs.existsSync(imagePath)) {
                            const splitLink = formatLink(link).split(";");
                            await downloadImage(splitLink[0], `${name}${nameSuffix}`, downloadDirectory);
                            console.log(`link---- ${name}${nameSuffix}`);
                        } else {
                            async function copyFile(source, destination) {
                                return new Promise((resolve, reject) => {
                                    const readStream = fs.createReadStream(source);
                                    const writeStream = fs.createWriteStream(destination);

                                    readStream.on('error', reject);
                                    writeStream.on('error', reject);
                                    writeStream.on('finish', resolve);

                                    readStream.pipe(writeStream);
                                });
                            }
                            try {
                                await copyFile(imagePath, path.join(downloadDirectory, imageName));
                                console.log(`ip---- ${imageName}`);
                            } catch (error) {
                                console.error(`Error copying file: ${error}`);
                            }

                        }
                    }

                    // Handling based on amountFile
                    if (sccccc[0].amountFile === "1") {
                        await processImage("1");
                    } else if (sccccc[0].amountFile === "2") {
                        await Promise.all([processImage("2", ' front'), processImage("2", ' back')]);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        await processRows();
    } catch (err) {
        console.error('Error reading Excel file:', err);
    }
}


module.exports = readExcelAndDownloadImages;