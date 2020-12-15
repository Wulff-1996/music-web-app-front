'use strict';

if (session.hasSession()){
    // redirect to index
    window.location.href = 'index.html';
}

$(document).ready(function () {

    const emailField = $('#emailField');
    const passwordField = $('#passwordField');
    const loginBtn = $('#loginBtn');
    const signupBtn = $('#signupBtn');
    const isAdminField = $('#isAdminToggle');

    let isValidEmail = false;
    let isValidPassword = false;
    let isAdmin = false;

    emailField.keyup(function () {
        if (!isAdmin) {
            isValidEmail = document.getElementById('emailField').checkValidity();

            if (isValidEmail) {
                emailField.removeClass('invalid');
            } else {
                emailField.addClass('invalid');
            }

            shouldEnableButton(isValidEmail, isValidPassword, false);
        }
    });

    passwordField.keyup(function () {

        isValidPassword = document.getElementById('passwordField').checkValidity();

        if (isValidPassword) {
            passwordField.removeClass('invalid');
        } else {
            passwordField.addClass('invalid');
        }

        shouldEnableButton(isValidEmail, isValidPassword, isAdmin);
    });

    loginBtn.on('click', function (){

        const emailValue = emailField.val();
        const passwordValue = passwordField.val();

        if (isAdmin){
            loginAdmin(passwordValue);
        } else {
            loginCustomer(emailValue, passwordValue);
        }
    });

    signupBtn.on('click', function (){
        window.location.href = 'signup.html';
    });

    // fade email field in
    isAdminField.on('change', function () {
        isAdmin = isAdminField.is(':checked')

        if (this.checked) {
            // fade out email field
            emailField.fadeOut();
        } else {
            emailField.fadeIn();
        }

        shouldEnableButton(isValidEmail, isValidPassword, isAdmin);
    })
});

function shouldEnableButton(isValidEmail, isValidPassword = null, isAdmin) {
    const loginBtn = $('#loginBtn');

    if (isAdmin) {
        if (isValidPassword) {
            loginBtn.removeClass('disabled');
            loginBtn.prop('disabled', false);
        } else {
            loginBtn.addClass('disabled');
            loginBtn.prop('disabled', true);
        }
    } else {
        if (isValidEmail && isValidPassword) {
            loginBtn.removeClass('disabled');
            loginBtn.prop('disabled', false);
        } else {
            loginBtn.addClass('disabled');
            loginBtn.prop('disabled', true);
        }
    }
}

function loginAdmin(password) {

    api.loginAdmin(password)
        .done(function (data){
            $('#info').addClass('invisible');

            // logged in
            document.cookie = 'isAdmin=true';

            // redirect to index
            window.location.href = 'index.html';
        })
        .fail(function (reqest){
            // login failed
            $('#info').removeClass('invisible');
            $('#info').addClass('auth-container-info-text');
        });
}

function loginCustomer(email, password){
    api.loginCustomer(email, password)
        .done(function (data){
            $('#info').addClass('invisible');
            // logged in
            document.cookie = 'isAdmin=false';

            // redirect to index
            window.location.href = 'index.html';
        })
        .fail(function (request){
            // login failed
            $('#info').removeClass('invisible');
            $('#info').addClass('auth-container-info-text');
        });
}