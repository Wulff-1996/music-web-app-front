'use strict';

function getUrlWithParams(url, params) {
    if (params) {
        url = url + '?' + new URLSearchParams(params);
    }

    return 'http://localhost/music-web-app-api/public/' + url;
}

const http = {
    get: async function (url, params = null) {
        url = getUrlWithParams(url, params);

        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        })
    },
    post: async function (url, data = null, params = null) {
        url = getUrlWithParams(url, params);

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    },
    put: async function (url, data = null, params = null) {
        url = getUrlWithParams(url, params);

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    },
    delete: async function (url, params = null) {
        url = getUrlWithParams(url, params);

        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    }
}

const api = {
    async getAlbums() {
        return http.get('albums');
    },
    async getTracks(id) {
        return http.get(`tracks/${id}`)
    },
    async loginCustomer(email, password) {
        return http.post('customer-login', {email, password})
    },
}
// TODO implement this api class in the other files
api.getAlbums()
    .then((res) => {
        console.log(res);
        return res.json();
    })
    .then((json) => {
        console.log(json);
    })
    .catch((err) => {
        console.log(err);
    })

