export { send, modalStatus, timestampToDate };

async function send(uri, data, sendType = 'POST', type = 'json') {

    const url = 'http://localhost:5000' + uri;

    const sendObject = {
        method: sendType
    };

    switch (sendType, type) {
        case 'POST', 'formData':
            sendObject.contentType = 'multipart/form-data';
            sendObject.body = data;
            break;
        case 'POST', 'json':
            sendObject.headers = {
                'Content-Type': 'application/json; charset=utf-8'
            };
            sendObject.body = JSON.stringify(data);
            break;
    }

    const result = await fetch(url, sendObject);
    let response = type === 'json' ? await result.json() : result;

    return response;
}

async function modalStatus(status, method) {
    return new Promise(function (resolve, reject) {
        if (status === true)
            resolve(console.log('ok'))
        else
            reject(console.log('bad'))
    })
}

function timestampToDate(date, type = 'full') {
    const resDate = new Date(date).getTime();
    const d = new Date();

    d.setTime(resDate);
    switch (type) {
        case "full": return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
        case "justDate": return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
        case "justTime": return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    }
}