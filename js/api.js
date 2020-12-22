'use strict';

const BASE_URL = 'http://localhost/music-web-app-api/public/';

function getUrlWithParams(url, params) {
    if (params) {
        url = url + '?' + new URLSearchParams(params);
    }
    return BASE_URL + url;
}

const http = {
    get: function (url, params = null) {
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
        console.log(data)
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
    signupCustomer(customer){
        return http.post('customer-signup', customer);
    },
    logout(){
        return http.post('logout');
    },
    getTrackById(id){
        return http.get('tracks/' + id);
    },
    getTracks(params = null){
        return http.get('tracks', params);
    },
    getArtistById(id){
        return http.get('artists/' + id);
    },
    getArtists(params = null){
        return http.get('artists', params);
    },
    getAlbums(params = null) {
        return http.get('albums', params);
    },
    getAlbumsById(id) {
        return http.get('albums/' + id)
    },
    postOrder(data){
        return http.post('customer-invoices', data);
    },
    updateCustomer(id, data){
        return http.post('customers/' + id, data);
    },
    deleteCustomer(id){
        return http.delete('customers/' + id);
    },
    getGenres(params = null){
        return http.get('search-genres', params);
    },
    getMedia(params = null){
        return http.get('search-media', params);
    }
}