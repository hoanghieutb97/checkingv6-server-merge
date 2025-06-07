const axios = require('axios');

async function checkAwaitPhotoshop(ip) {
    var url = `http://${ip}:4444/checkAwaitPhotoshop`;
    axios.get(url)
        .then(function (response) {

        })
        .catch(function (error) {
            console.log("loi checkAwaitPhotoshop", error);
        })

}
module.exports = checkAwaitPhotoshop;