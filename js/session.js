'use strict';

const SESSION_IDENTIFIER = 'PHPSESSID';
const ADMIN_KEY = 'isAdmin';
const CUSTOMER_ID_KEY = 'customer_id';

const session = {
    // flags
    hasSession: function hasSession() {
        if (getCookie(SESSION_IDENTIFIER)){
            return true;
        } else return false;
    },
    hasAdmin(){
        if (getCookie(ADMIN_KEY)){
            return true;
        } else return false;
    },
    getSessionId: function () {
        return getCookie(SESSION_IDENTIFIER);
    },
    isAdmin: function () {
        let adminCookie = getCookie(ADMIN_KEY);
        if (adminCookie){
            if (adminCookie[1] === 'true'){
                return true;
            } else return false;
        } else return false;
    },
    customerId: function () {
        return parseInt(getCookie(CUSTOMER_ID_KEY)[1]);
    },
    hasCustomer: function (){
        if (getCookie(CUSTOMER_ID_KEY)){
            return true;
        } else return false
    },
    clearCookies() {
        let cookies = document.cookie.split(';');

        cookies.forEach(function (cookie) {
            let key = cookie.trim().split('=');
            // set expire date to the past
            document.cookie = key[0] + " =; expires = Thu, 01 Jan 1970 00:00:00 UTC; path = ";
        });
    }
}


function getCookie(name) {
    let cookie = null;

    const cookies = document.cookie.split(';');
    cookies.forEach(function (item, index) {

        let data = item.trim().split('=');
        if (data[0] == name) {
            cookie = data;
        }
    })
    return cookie;
}