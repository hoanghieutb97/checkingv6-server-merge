

function cal_newIPClient(listIp, req_body) {
    var global_listIp = [...listIp];
    let isDuplicate = false; // Biến để kiểm tra xem có item trùng IP không

    for (let i = 0; i < global_listIp.length; i++) {
        if (global_listIp[i].ip[0] === req_body.ip[0]) {
            global_listIp[i] = { ...req_body };
            isDuplicate = true;
            break; // Thoát khỏi vòng lặp
        }
    }

    if (!isDuplicate) { // them ip neu chua co
        global_listIp.push({ ...req_body });
    }
    return global_listIp
}
module.exports = cal_newIPClient;