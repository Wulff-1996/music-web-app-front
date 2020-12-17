'use strict';

const controllerUtil = {
    getParam(param) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(param);
    },
    checkForSession() {
        // check if has session
        if (!session.hasSession()) {
            // not logged in, redirect to login
            window.location.href = 'login.html';
        }
    },
    loadHeaderFooter() {
        // ids are the same for each page
        $('#header-container').load('header.html #header');
        $('#footer-container').load('footer.html #footer');
    },
    validateQueryParamId(id) {
        // check if id in url query params
        id = parseInt(id); // if 99.99 => 99 if string => NaN
        if (id === null || Number.isInteger(id) === false) {
            alert('need to pass id in url. You will be redirected to home page.');

            // redirect user to home
            window.location.href = 'index.html';
        }
    },
    handleListItemClicked(data) {
        switch (data.type) {
            case 'track':
                window.location.href = 'track.html?id=' + data.id;
                break;

            case 'artist':
                window.location.href = 'artist.html?id=' + data.id;
                break;

            case 'album':
                window.location.href = 'album.html?id=' + data.id;
                break;
        }
    },
    redirector: {
        toHome(){
            window.location.href = 'index.html';
        },
        toLogin(){
            window.location.href = 'login.html';
        }
    },
    alertDialog: {
        show(title, message, mode){
            let alert = adapter.getAlertErrorModal(
                title,
                message,
                mode);

            $('body').append(alert);
        },
        remove(){
            $('div.modal-background').remove();
        }
    }

}