'use strict';

const BASE_URL = 'http://localhost/music-web-app-api/public/';

function getUrlWithParams(url, params) {
    if (params) {
        url = url + '?' + new URLSearchParams(params);
    }
    return BASE_URL + url;
}

const http = {
    get: function (url, params = null, data = null) {
        url = getUrlWithParams(url, params);
        return $.ajax({
            url: url,
            type: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
    },
    post: function (url, data = null) {
        url = getUrlWithParams(url, null)
        return $.ajax({
            url: url,
            type: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        });
    },
    put: function (url, data = null) {
        url = getUrlWithParams(url, null)
        return $.ajax({
            url: url,
            type: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    },
    patch: function (url, data = null) {
        url = getUrlWithParams(url, null)
        return $.ajax({
            url: url,
            type: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    },
    delete: function (url) {
        url = getUrlWithParams(url, null)
        return $.ajax({
            url: url,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
            }
        });
    }
}

const api = {
    loginCustomer(email, password) {
        let data = {
            'email': email,
            'password': password
        };
        return http.post('customer-login', data);
    },
    loginAdmin(password) {
        return http.post('admin-login', {'password': password});
    },
    getAlbums(params = null) {
        return http.get('albums', params);
    },
    getAlbumsById(id) {
        return http.get('albums/' + id)
    }
}

// how to use
/*
api2.getAlbums({'artist_id':'dfsf'})
    .done(function (data) {
        // get data
        console.log(data);

    })
    .fail(function(request, status) {
        // get server error message
        console.log(request.responseJSON);

        // server error code 404/401
        console.log(request.status);

        // status will give: 'error'
        console.log(status);
});
 */

////// fetch implementation ///////////////////
/*
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
            credentials: 'include',
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
        return http.get('tracks/' + id)
    },
    async loginCustomer(email, password) {
        return http.post('customer-login', {'email': email, 'password': password})
    },
    async loginAdmin(passowrd) {
        return http.post('admin-login', {'password': passowrd})
    }
}
 */

