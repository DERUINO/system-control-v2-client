export { send, modalStatus, timestampToDate, getCookie, setCookie };

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
        updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

async function send(uri, data, sendType = 'POST', type = 'json') {

    const url = 'http://localhost:5000' + uri;

    const sendObject = {
        method: sendType
    };

    switch (sendType, type) {
        case 'POST', 'formData':
            sendObject.headers = {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getCookie('token')}`
            };
            sendObject.body = data;
            break;
        case 'POST', 'json':
            sendObject.headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${getCookie('token')}`
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