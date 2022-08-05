import {config}  from "../urlConf";

export function fetchGet(url) {
    console.log('url : ' + config + url);
    return fetch(config + url).then(response => response.json()).then(data => {
        return data;
    }).catch((e) => { console.log('error : ', e) });
}
export function fetchGetUrl(url) {
    console.log('url : ' + url);
    return fetch(url).then(response => response.json()).then(data => {
        return data;
    }).catch((e) => { console.log('error : ', e) });
}

export function fetchPost(url, dataSend) {
    console.log('url : ' + config + url);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend)
    };
    return fetch(config + url, requestOptions).then(response => response.json()).then(data => {
        return data;
    }).catch(error => {
        console.log(error);
    });
}
export function fetchPostUrl(url, dataSend) {
    console.log('url : ' + url);
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend)
    };
    return fetch(url, requestOptions).then(response => response.json()).then(data => {
        return data;
    }).catch(error => {
        console.log(error);
    });
}
export function fetchPostV2(url, dataSend) {
    const requestOptions = {
        method: 'POST',
        body: dataSend
    };
    return fetch(url, requestOptions).then(response => response.json()).then(data => {
        return data;
    });
}

export function fetchPostV3(url, dataSend) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend)
    };
    return fetch(url, requestOptions).then(response => response.json()).then(data => {
        return data;
    });
}
export function fetchPostIndependent(url, dataSend) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataSend)
    };
    return fetch(url, requestOptions).then(response => response.json()).then(data => {
        return data;
    });
}

// export default fetchGet;