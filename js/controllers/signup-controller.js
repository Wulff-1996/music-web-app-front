'use strict';

// flags
let isValidFirstName = false;
let isValidLastName = false;
let isValidEmail = false;
let isValidPassword = false;
let isValidPhone = true;
let isValidFax = true;
let isValidCompany = true;
let isValidAddress = true;
let isValidCity = true;
let isValidState = true;
let isValidCountry = true;
let isValidPostalCode = true;

// buttons
const signupBtn = $('#signupBtn');
const backBtn = $('#backLogin');

// fields
// required fields
const firstNameField = $('#firstnameField');
const lastNameField = $('#lastnameField');
const emailField = $('#emailField');
const passwordField = $('#passwordField');

// optional fields
const phoneField = $('#phoneField');
const faxField = $('#faxField');
const companyField = $('#companyField');
const addressField = $('#addressField');
const cityField = $('#cityField');
const stateField = $('#stateField');
const countryField = $('#countryField');
const postalcodeField = $('#postalCodeField');

// events
const EVENT_SIGN_UP_SUCCESS = 'EVENT_SIGN_UP_SUCCESS';
const EVENT_SIGN_UP_FAILED = 'EVENT_SIGN_UP_FAILED';

$(document).ready(function () {

    setupViews();
});

function setupViews() {
    signupBtn.on('click', function () {
        handleSignupCustomer();
    });

    backBtn.on('click', function () {
        window.location.href = 'login.html';
    });

    // alert modal
    $(document).on('click', 'button.alert-button', function () {
        let target = $(event.target);
        let alertEvent = $(this).data('mode');
        let isOkAction = (target.attr('id') === 'alertModalOkBtn') ? true : false;

        // remove from body
        controllerUtil.alertDialog.remove();

        if (!isOkAction) return;

        // check mode
        switch (alertEvent) {
            case EVENT_SIGN_UP_SUCCESS:
                controllerUtil.redirector.toLogin();
                break;
        }
    });

    // listeners
    firstNameField.keyup(function () {
        isValidFirstName = document.getElementById('firstnameField').checkValidity();
        updateInputField(firstNameField, isValidFirstName);
    });

    lastNameField.keyup(function () {
        isValidLastName = document.getElementById('lastnameField').checkValidity();
        updateInputField(lastNameField, isValidLastName);
    });

    emailField.keyup(function () {
        isValidEmail = document.getElementById('emailField').checkValidity();
        updateInputField(emailField, isValidEmail);
    });

    passwordField.keyup(function () {
        isValidPassword = document.getElementById('passwordField').checkValidity();
        updateInputField(passwordField, isValidPassword);
    });

    phoneField.keyup(function () {
        isValidPhone = document.getElementById('phoneField').checkValidity();
        updateInputField(phoneField, isValidPhone);
    });

    faxField.keyup(function () {
        isValidFax = document.getElementById('faxField').checkValidity();
        updateInputField(faxField, isValidFax);
    });

    companyField.keyup(function () {
        isValidCompany = document.getElementById('companyField').checkValidity();
        updateInputField(companyField, isValidCompany);
    });

    addressField.keyup(function () {
        isValidAddress = document.getElementById('addressField').checkValidity();
        updateInputField(addressField, isValidAddress);
    });

    cityField.keyup(function () {
        isValidCity = document.getElementById('cityField').checkValidity();
        updateInputField(cityField, isValidCity);
    });

    stateField.keyup(function () {
        isValidState = document.getElementById('stateField').checkValidity();
        updateInputField(stateField, isValidState);
    });

    countryField.keyup(function () {
        isValidCountry = document.getElementById('countryField').checkValidity();
        updateInputField(countryField, ValidCountry);
    });

    postalcodeField.keyup(function () {
        isValidPostalCode = document.getElementById('postalcodeField').checkValidity();
        updateInputField(isValidPostalCode);
    });
}

function handleSignupCustomer() {
    // update input fields UI
    validateAllInputs();

    // check if inputs are valid
    if (validateInput()) {

        let customer = {
            'first_name': controllerUtil.valueOrNull(firstNameField.val()),
            "last_name": controllerUtil.valueOrNull(lastNameField.val()),
            "email": controllerUtil.valueOrNull(emailField.val()),
            "password": controllerUtil.valueOrNull(passwordField.val()),
            "phone": controllerUtil.valueOrNull(phoneField.val()),
            "fax": controllerUtil.valueOrNull(faxField.val()),
            "company": controllerUtil.valueOrNull(companyField.val()),
            "address": controllerUtil.valueOrNull(addressField.val()),
            "city": controllerUtil.valueOrNull(cityField.val()),
            "postal_code": controllerUtil.valueOrNull(postalcodeField.val()),
            "state": controllerUtil.valueOrNull(stateField.val()),
            "country": controllerUtil.valueOrNull(countryField.val())
        };

        // make api call
        signupCustomer(customer);
    }
}

function signupCustomer(customer) {

    api.signupCustomer(customer)
        .done(function (data) {
            controllerUtil.alertDialog.show(
                'Account Created',
                'You have successfully created an account. You will now be redirected to the login page. Provide your Mail and Password to access your newly created account.',
                EVENT_SIGN_UP_SUCCESS
            );
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function validateInput() {
    if (isValidFirstName && isValidLastName && isValidEmail && isValidPassword &&
        isValidPhone && isValidFax && isValidCompany && isValidAddress && isValidCity &&
        isValidState && isValidCountry && isValidPostalCode) {
        return true;
    } else {
        return false;
    }
}

function validateAllInputs() {
    updateInputField(firstNameField, isValidFirstName);
    updateInputField(lastNameField, isValidLastName);
    updateInputField(emailField, isValidEmail);
    updateInputField(passwordField, isValidPassword);
    updateInputField(phoneField, isValidPhone);
    updateInputField(faxField, isValidFax);
    updateInputField(companyField, isValidCompany);
    updateInputField(addressField, isValidAddress);
    updateInputField(cityField, isValidCity);
    updateInputField(stateField, isValidState);
    updateInputField(countryField, isValidCountry);
    updateInputField(postalcodeField, isValidPostalCode);
}

function updateInputField(inputFieldId, isValid) {
    if (isValid) {
        inputFieldId.removeClass('invalid');
    } else {
        inputFieldId.addClass('invalid');
    }
}