'use strict';

// views
const firstnameField = $('#firstnameField');
const lastnameField = $('#lastnameField');
const emailField = $('#emailField');
const passwordField = $('#passwordField');
const phoneField = $('#phoneField');
const faxField = $('#faxField');
const companyField = $('#companyField');
const addressField = $('#addressField');
const cityField = $('#cityField');
const stateField = $('#stateField');
const postalCodeField = $('#postalCodeField');
const countryField = $('#countryField');

// buttons
const editBtn = $('#profileEditBtn');
const deleteBtn = $('#profileDeleteBtn');
const logoutBtn = $('#profileSignOutBtn');
const saveBtn = $('#profileSaveBtn');

// fields
let customer = null;
let customerId = null;

// flags
let isInEditMode = false;

// input field flags
let isvalidFirstname = true;
let isvalidLastname = true;
let isvalidEmail = true;
let isvalidPassword = true;
let isvalidPhone = true;
let isvalidFax = true;
let isvalidCompany = true;
let isvalidAddress = true;
let isvalidCity = true;
let isvalidState = true;
let isvalidPostalCode = true;
let isvalidCountry = true;

// alert modal modes
const EVENT_UPDATE_SUCCESS = 'EVENT_UPDATE_SUCCESS';
const EVENT_UPDATE_FAIL = 'EVENT_UPDATE_FAIL';
const EVENT_DELETE = 'EVENT_DELETE';
const EVENT_DELETE_SUCCESS = 'EVENT_DELETE_SUCCESS';
const EVENT_LOGOUT = 'EVENT_LOGOUT';
const EVENT_ADMIN_LOGIN = 'EVENT_ADMIN_LOGIN';

$(document).ready(function () {

    controllerUtil.checkForSession();
    controllerUtil.loadHeaderFooter();

    // set fields
    customer = storage.user.get();
    customerId = session.customerId();

    // check if admin
    if (session.isAdmin()) {
        // this page is not allowed for admins, redirect to home
        controllerUtil.alertDialog.show(
            'Logout',
            'Are you sure you want to logout?',
            EVENT_ADMIN_LOGIN,
            {
                ALERT_HAS_CANCEL: true,
                ALERT_ACTION_TEXT: 'Logout',
                ALERT_CANCEL_TEXT: 'To Home'
            }
        );
    }

    setupViews();
    populateViews();

});

function setupViews() {
    // listeners
    editBtn.on('click', function () {
        isInEditMode = !isInEditMode;

        if (isInEditMode) {
            updateEditButton(true);
            enableAllInputs(true);
            showSaveButton(true);

        } else {
            resetInputs();
            updateEditButton(false);
            enableAllInputs(false);
            showSaveButton(false);
        }
    });

    deleteBtn.on('click', function (){
       controllerUtil.alertDialog.show(
           'Delete Account',
           'Are you sure you want to delete this account? this action cannot be undone.',
           EVENT_DELETE,
           {
               ALERT_HAS_CANCEL: true,
               ALERT_ACTION_TEXT: 'Delete'
           }
       )
    });

    saveBtn.on('click', function () {
        // disable to prevent multiple clicks
        enableButton(saveBtn, false);
        handleUpdateCustomer();
    });

    logoutBtn.on('click', function () {
        controllerUtil.alertDialog.show(
            'Logout',
            'Are you sure you want to logout?',
            EVENT_LOGOUT,
            {
                ALERT_HAS_CANCEL: true,
                ALERT_ACTION_TEXT: 'Logout'
            }
        );
    });

    // alert dialog
    // alert modal button
    $(document).on('click', 'button.alert-button', function (event) {
        let target = $(event.target);
        let alertEvent = $(this).data('mode');
        let isOkAction = (target.attr('id') === 'alertModalOkBtn') ? true : false;

        // remove alert modal
        controllerUtil.alertDialog.remove();

        switch (alertEvent) {

            case EVENT_UPDATE_SUCCESS:
            case EVENT_UPDATE_FAIL:
                enableButton(saveBtn, true);
                break;

            case EVENT_DELETE:
                if (isOkAction) {
                    deleteAccount();
                }
                break;

            case EVENT_DELETE_SUCCESS:
                controllerUtil.logout();
                break;

            case EVENT_LOGOUT:
                if (isOkAction) {
                    controllerUtil.logout();
                }
                break;

            case EVENT_ADMIN_LOGIN:
                if (isOkAction){
                    // logout
                    controllerUtil.logout();
                } else {
                    // to home
                    controllerUtil.redirector.toHome();
                }
                break;

            case ALERT_MODE_ERROR_UNAUTHORIZED:
                // clear all data and redirect to login
                controllerUtil.logout();
                break;

        }

        // input fields
        firstnameField.keyup(function () {
            isvalidFirstname = document.getElementById(firstnameField.attr('id')).checkValidity();
            updateInputField(firstnameField, isvalidFirstname);
        });

        lastnameField.keyup(function () {
            isvalidLastname = document.getElementById(lastnameField.attr('id')).checkValidity();
            updateInputField(lastnameField, isvalidLastname);
        });

        emailField.keyup(function () {
            isvalidEmail = document.getElementById(emailField.attr('id')).checkValidity();
            updateInputField(emailField, isvalidEmail);
        });

        passwordField.keyup(function () {
            isvalidPassword = document.getElementById(passwordField.attr('id')).checkValidity();
            updateInputField(passwordField, isvalidPassword);
        });

        phoneField.keyup(function () {
            isvalidPhone = document.getElementById(phoneField.attr('id')).checkValidity();
            updateInputField(phoneField, isvalidPhone);
        });

        faxField.keyup(function () {
            isvalidFax = document.getElementById(faxField.attr('id')).checkValidity();
            updateInputField(faxField, isvalidFax);
        });

        companyField.keyup(function () {
            isvalidCompany = document.getElementById(companyField.attr('id')).checkValidity();
            updateInputField(companyField, isvalidCompany);
        });

        addressField.keyup(function () {
            isvalidAddress = document.getElementById(addressField.attr('id')).checkValidity();
            updateInputField(addressField, isvalidAddress);
        });

        cityField.keyup(function () {
            isvalidCity = document.getElementById(cityField.attr('id')).checkValidity();
            updateInputField(cityField, isvalidCity);
        });

        stateField.keyup(function () {
            isvalidState = document.getElementById(stateField.attr('id')).checkValidity();
            updateInputField(stateField, isvalidState);
        });

        countryField.keyup(function () {
            isvalidCountry = document.getElementById(countryField.attr('id')).checkValidity();
            updateInputField(countryField, isvalidCountry);
        });

        postalCodeField.keyup(function () {
            isvalidPostalCode = document.getElementById(postalCodeField.attr('id')).checkValidity();
            updateInputField(postalCodeField, isvalidPostalCode);
        });
    });
}

function populateViews() {
    firstnameField.val(customer.first_name);
    lastnameField.val(customer.last_name);
    emailField.val(customer.email);
    passwordField.val(null);
    phoneField.val(customer.phone);
    faxField.val(customer.fax);
    companyField.val(customer.company);
    addressField.val(customer.address);
    cityField.val(customer.city);
    stateField.val(customer.state);
    postalCodeField.val(customer.postal_code);
    countryField.val(customer.country);
}


function handleUpdateCustomer() {
    validateAllInputs();

    if (isInputsValid()) {

        // create customer from input
        let customer = {
            "first_name": controllerUtil.valueOrNull(firstnameField.val()),
            "last_name": controllerUtil.valueOrNull(lastnameField.val()),
            "email": controllerUtil.valueOrNull(emailField.val()),
            "password": controllerUtil.valueOrNull(passwordField.val()),
            "phone": controllerUtil.valueOrNull(phoneField.val()),
            "fax": controllerUtil.valueOrNull(faxField.val()),
            "company": controllerUtil.valueOrNull(companyField.val()),
            "address": controllerUtil.valueOrNull(addressField.val()),
            "city": controllerUtil.valueOrNull(cityField.val()),
            "postal_code": controllerUtil.valueOrNull(postalCodeField.val()),
            "state": controllerUtil.valueOrNull(stateField.val()),
            "country": controllerUtil.valueOrNull(countryField.val())
        };

        updateCustomer(customer);
    }
}


function showSaveButton(isShow) {
    if (isShow) {
        saveBtn.removeClass('gone');
    } else {
        saveBtn.addClass('gone');
    }
}

function updateEditButton(isInEditMode) {
    if (isInEditMode) {
        // set edit icon to accent
        editBtn.attr('src', 'icons/icon-edit-accent.svg');
    } else {
        // set edit to white
        editBtn.attr('src', 'icons/icon-edit.svg');
    }
}

function enableButton(button, isEnabled) {
    if (isEnabled) {
        button.removeClass('button-disabled');
        button.prop('disabled', false);
    } else {
        button.addClass('button-disabled');
        button.prop('disabled', true);
    }
}

function enableAllInputs(isEnabled) {
    enableInput(firstnameField, isEnabled);
    enableInput(lastnameField, isEnabled);
    enableInput(emailField, isEnabled);
    enableInput(passwordField, isEnabled);
    enableInput(phoneField, isEnabled);
    enableInput(faxField, isEnabled);
    enableInput(companyField, isEnabled);
    enableInput(addressField, isEnabled);
    enableInput(cityField, isEnabled);
    enableInput(stateField, isEnabled);
    enableInput(postalCodeField, isEnabled);
    enableInput(countryField, isEnabled);
}

function enableInput(view, isEnabled) {
    if (isEnabled) {
        view.prop('disabled', false);
    } else {
        view.prop('disabled', true);
    }
}

function updateInputField(inputFieldId, isValid) {
    if (isValid) {
        inputFieldId.removeClass('invalid');
    } else {
        inputFieldId.addClass('invalid');
    }
}

function validateAllInputs() {
    updateInputField(firstnameField, isvalidFirstname);
    updateInputField(lastnameField, isvalidLastname);
    updateInputField(emailField, isvalidEmail);
    updateInputField(passwordField, isvalidPassword);
    updateInputField(phoneField, isvalidPhone);
    updateInputField(faxField, isvalidFax);
    updateInputField(companyField, isvalidCompany);
    updateInputField(addressField, isvalidAddress);
    updateInputField(cityField, isvalidCity);
    updateInputField(stateField, isvalidState);
    updateInputField(postalCodeField, isvalidPostalCode);
    updateInputField(countryField, isvalidCountry);
}

function isInputsValid() {
    if (isvalidFirstname && isvalidLastname && isvalidEmail && isvalidPassword &&
        isvalidPhone && isvalidFax && isvalidCompany && isvalidAddress && isvalidCity &&
        isvalidState && isvalidCountry && isvalidPostalCode) {
        return true;
    } else {
        return false;
    }
}

function resetInputs() {
    // reset flags
    isvalidFirstname = true;
    isvalidLastname = true;
    isvalidEmail = true;
    isvalidPassword = true;
    isvalidPhone = true;
    isvalidFax = true;
    isvalidCompany = true;
    isvalidAddress = true;
    isvalidCity = true;
    isvalidState = true;
    isvalidPostalCode = true;
    isvalidCountry = true;

    // remove fields that are invalid, now all flags are valid
    validateAllInputs();

    // reset input values
    populateViews();
}

function updateCustomer(customer) {
    api.updateCustomer(customerId, customer)
        .done(function (data) {
            // update stored user
            storage.user.set(data);

            // get updated user
            this.customer = storage.user.get();
            // update ui fields
            populateViews();

            // alert user is updated
            controllerUtil.alertDialog.show(
                'Account Updated',
                'The account was updated successfully.',
                EVENT_UPDATE_SUCCESS
            );
        })
        .fail(function (request) {

            if (request.status === 401) {
                // not authorized
                controllerUtil.alertDialog.show(
                    'Unauthorized',
                    request.responseJSON.message,
                    ALERT_MODE_ERROR_UNAUTHORIZED
                );
            } else {
                // any other error
                controllerUtil.alertDialog.show(
                    'Unauthorized',
                    request.responseJSON.message,
                    EVENT_UPDATE_FAIL
                );
            }
        });
}

function deleteAccount() {
    api.deleteCustomer(customerId)
        .done(function (data) {
            controllerUtil.alertDialog.show(
                'Account Deleted',
                'Your account has successfully been deleted. You will be redirected login.',
                EVENT_DELETE_SUCCESS
            );
        })
        .fail(function (request) {
            controllerUtil.alertDialog.show(
                'Delete Failed',
                'You cannot delete this account since it has data associated to this account.'
            );
        });
}

function logout() {
    api.logout()
        .done(function (data) {

        })
        .fail(function (request) {

        });
}

