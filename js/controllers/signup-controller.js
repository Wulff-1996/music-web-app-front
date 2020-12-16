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

// infoText
const infoTextField = $('#info');

$(document).ready(function () {

    signupBtn.on('click', function () {

        // update input fields UI
        validateAllInputs();

        // check if inputs are valid
        if (validateInput()) {

            // remove info text
            updateInfoText(true);

            // create customer from input
            let customer = new Customer(
                valueOrNull(firstNameField.val()),
                valueOrNull(lastNameField.val()),
                valueOrNull(emailField.val()),
                valueOrNull(passwordField.val()),
                valueOrNull(phoneField.val()),
                valueOrNull(faxField.val()),
                valueOrNull(companyField.val()),
                valueOrNull(addressField.val()),
                valueOrNull(cityField.val()),
                valueOrNull(stateField.val()),
                valueOrNull(countryField.val()),
                valueOrNull(postalcodeField.val())
            );

            // make api call
            signupCustomer(customer.toJson());
        } else {
            // show infoText
            updateInfoText(false, 'Enter required fields, or format input correctly');
        }
    });

    backBtn.on('click', function (){
        window.location.href = 'login.html';
    })

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
});

function signupCustomer(customer) {

    api.signupCustomer(customer)
        .done(function (data) {
            console.log(data);

            // remove error message
            updateInfoText(true, '')

            // alert user the user has been created
            alert('Customer Saved. You will be redirected to login.')

            // redirect to login
            window.location.href = 'login.html';
        })
        .fail(function (request) {
            updateInfoText(false, request.responseText);
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

function updateInfoText(isValid, message){
    infoTextField.text(message);
    if (isValid){
        infoTextField.addClass('invisible');
    } else {
        infoTextField.removeClass('invisible');
        infoTextField.addClass('auth-container-info-text');
    }
}

function validateAllInputs(){
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

function valueOrNull(value) {
    if (value == '') {
        return null;
    } else {
        return value;
    }
}