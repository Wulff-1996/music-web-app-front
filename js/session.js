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
                console.log('yes has session boblblbla');
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
    }
}