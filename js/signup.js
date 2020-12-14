'use strict';

// entity
let customer = new Customer();

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

$(document).ready(function () {

    // buttons
    const signupBtn = $('#signupBtn');

    firstNameField.keyup(function () {
        customer.firstname = firstNameField.val();
        customer.isValidFirstName = document.getElementById('firstnameField').checkValidity();

        if (customer.isValidFirstName) {
            firstNameField.removeClass('invalid');
        } else {
            firstNameField.addClass('invalid');
        }
    });

    lastNameField.keyup(function () {
        customer.lastname = lastNameField.val();
        customer.isValidLastName = document.getElementById('lastnameField').checkValidity();

        if (customer.isValidLastName) {
            lastNameField.removeClass('invalid');
        } else {
            lastNameField.addClass('invalid');
        }
    });

    emailField.keyup(function () {
        customer.email = emailField.val();
        customer.isValidEmail = document.getElementById('emailField').checkValidity();

        if (customer.isValidEmail) {
            emailField.removeClass('invalid');
        } else {
            emailField.addClass('invalid');
        }

        shouldEnableButton();
    });

    passwordField.keyup(function () {
        customer.password = passwordField.val();
        customer.isValidPassword = document.getElementById('passwordField').checkValidity();

        if (customer.isValidPassword) {
            passwordField.removeClass('invalid');
        } else {
            passwordField.addClass('invalid');
        }

        shouldEnableButton();
    });

    phoneField.keyup(function () {
        customer.phone = phoneField.val();
        customer.isValidPhone = document.getElementById('phoneField').checkValidity();

        if (customer.isValidPhone) {
            phoneField.removeClass('invalid');
        } else {
            phoneField.addClass('invalid');
        }

        shouldEnableButton();

    });

    // TODO make input listeners for all the fields

    signupBtn.on('click', function () {
        signupCustomer(customer);
    });

});

function shouldEnableButton() {
    const signupBtn = $('#signupBtn');

    if (customer) {
        signupBtn.removeClass('disabled');
        signupBtn.prop('disabled', false);
    } else {
        signupBtn.addClass('disabled');
        signupBtn.prop('disabled', true);
    }
}

function signupCustomer(customer) {

    $.ajax({
        url: 'http://localhost/music-web-app-api/public/customer-signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'email': customer.email, 'password': customer.password}),
        statusCode: {
            204: function (data) {
                $('#info').addClass('invisible');

                // logged in
                document.cookie = 'isAdmin=false';

                // save user in session
                let user = JSON.stringify(data);
                sessionStorage.setItem('user', user);

                // redirect to index
                window.location.href = 'index.html';
            },
            401: function (data) {
                $('#info').removeClass('invisible');
                $('#info').addClass('auth-container-info-text');


                $('#info').text(data)
            }
        }
    });
}