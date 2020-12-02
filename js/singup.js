'use strict';

$(document).ready(function () {

    const emailField = $('#emailField');
    const passwordField = $('#passwordField');
    const signupBtn = $('#signupBtn');

    let isValidEmail = false;
    let isValidPassword = false;

    emailField.keyup(function () {

        isValidEmail = document.getElementById('emailField').checkValidity();

        if (isValidEmail) {
            emailField.removeClass('invalid');
        } else {
            emailField.addClass('invalid');
        }

        shouldEnableButton(isValidEmail, isValidPassword);
    });

    passwordField.keyup(function () {

        isValidPassword = document.getElementById('passwordField').checkValidity();

        if (isValidPassword) {
            passwordField.removeClass('invalid');
        } else {
            passwordField.addClass('invalid');
        }

        shouldEnableButton(isValidEmail, isValidPassword);
    });

    signupBtn.on('click', function () {
        const emailValue = emailField.val();
        const passwordValue = passwordField.val();
        signupCustomer(emailValue, passwordValue);
    });

});

function shouldEnableButton(isValidEmail, isValidPassword){
    const signupBtn = $('#signupBtn');

    if (isValidEmail && isValidPassword){
        signupBtn.removeClass('disabled');
        signupBtn.prop('disabled', false);
    } else {
        signupBtn.addClass('disabled');
        signupBtn.prop('disabled', true);
    }
}

function signupCustomer(email, password) {

    // TODO make this endpoint
    const url = ""

    $.ajax({
        url: 'http://localhost/music-web-app-api/public/customer-signup',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'email': email, 'password': password}),
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