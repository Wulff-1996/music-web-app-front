'use strict';

const SESSION_IDENTIFIER = 'PHPSESSID';

const session = {
    hasSession: function hasSession() {
        let hasSession = false;
        // cookie format {key=value};{key=value}
        const cookies = document.cookie.split(';');

        cookies.forEach(function (item, index) {
            let cookie = item.trim().split('=');
            if (cookie[0] == SESSION_IDENTIFIER) {
                hasSession = true;
            }
        })
        return hasSession;
    },
    getSessionId: function () {
        let session = null;
        const cookies = document.cookie.split(';');

        cookies.forEach(function (item, index) {
            let cookie = item.trim().split('=');
            if (cookie[0] == SESSION_IDENTIFIER) {
                session = cookie[0];
            }
        })
        return session;
    },
    isAdmin: function (){
        let cookie = getCookie('isAdmin');

        if (cookie != null){
            // cookie value is a string
            if (cookie[1] === 'true'){
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    customerId: function () {
        let cookie = getCookie('customer_id');

        if (cookie != null){
            return cookie[1];
        } else {
            return null;
        }
    }

}


function getCookie(name){
    let cookie = null;

    const cookies = document.cookie.split(';');
    cookies.forEach(function (item, index) {

        let data = item.trim().split('=');
        if (data[0] == name){
            cookie = data;
        }
    })
    return cookie;
}