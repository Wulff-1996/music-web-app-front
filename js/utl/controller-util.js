'use strict';

const controllerUtil = {
    validateCustomer() {
        let hasSessionCookie = session.hasSession();
        let hasCustomerCookie = session.hasCustomer();
        let hasAdminCookie = session.hasAdmin();
        let hasCustomerData = storage.user.hasUser();
        let isAdmin = session.isAdmin() // customer should have isAdmin = false

        if (!hasSessionCookie || !hasCustomerCookie || !hasAdminCookie || !hasCustomerData || isAdmin) {
            // missing required data, clear all data and logout
            session.clearCookies();
            storage.clear();
            this.redirector.toLogin();
        }
    },
    validateAdmin() {
        let hasSessionCookie = session.hasSession();
        let hasAdminCookie = session.hasAdmin();
        let isAdmin = session.isAdmin();

        if (!hasSessionCookie || !hasAdminCookie || !isAdmin) {
            // missing required data, clear all data and logout
            session.clearCookies();
            storage.clear();
            this.redirector.toLogin();
        }
    },
    checkForSession() {
        // user has session, check what kind of user
        if (session.isAdmin()) {
            this.validateAdmin();
        } else {
            this.validateCustomer();
        }
    },
    hasLoggedInUser() {
        if (!session.hasSession()) {
            return false;
        }
        if (this.hasLoggedInCustomer() || this.hasLoggedInAdmin()) {
            return true;
        } else return false;
    },
    hasLoggedInAdmin() {
        let hasAdminCookie = session.hasAdmin();
        let isAdmin = session.isAdmin();

        if (!hasAdminCookie || !isAdmin) {
            return false;
        } else return true;
    },
    hasLoggedInCustomer() {
        let hasCustomerCookie = session.hasCustomer();
        let hasAdminCookie = session.hasAdmin();
        let hasCustomerData = storage.user.hasUser();
        let isAdmin = session.isAdmin() // customer should have isAdmin = false

        if (!hasCustomerCookie || !hasAdminCookie || !hasCustomerData || isAdmin) {
            return false;
        } else return true;
    },
    getParam(param) {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        param = urlParams.get(param);

        if (!isNaN(param) && Number.isInteger(parseInt(param))){
            // param is int
            return parseInt(param);
        } else return null;
    },
    loadHeaderFooter() {
        // ids are the same for each page
        $('#header-container').load('header.html #header');
        $('#footer-container').load('footer.html #footer');
    },
    validateQueryParamId(id) {
        // check if id in url query params

        if (id === null || Number.isInteger(id) === false) {

            controllerUtil.alertDialog.show(
                'Invalid Path Id',
                'You will be redirected to the home page.',
                ALERT_EVENT_INVALID_PATH_ID
            );

            return false;
            // the event: ALERT_EVENT_INVALID_PATH_ID will catch in the errorHandler
        } return true;
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
    valueOrNull(value) {
        if (value == '') {
            return null;
        } else {
            return value;
        }
    },
    logout() {
        // clear data
        storage.clear();
        session.clearCookies();

        let redirector = this.redirector;

        // logout
        api.logout()
            .always(function () {
                redirector.toLogin();
            });
    },
    redirector: {
        toHome() {
            window.location.href = 'index.html';
        },
        toLogin() {
            window.location.href = 'login.html';
        }
    },
    alertDialog: {
        show(title, message, mode = null, options = null) {
            let alert = adapter.getAlertModal(
                title,
                message,
                mode,
                options);

            $('body').append(alert);
        },
        remove() {
            $('div.modal-background').remove();
        }
    },
    header: {
        // TODO update header based on page name
    }

}