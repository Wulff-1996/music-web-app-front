'use strict';

// fields
const emailField = $('#emailField');
const passwordField = $('#passwordField');
const loginBtn = $('#loginBtn');
const signupBtn = $('#signupBtn');
const isAdminField = $('#isAdminToggle');

// flags
let isValidEmail = false;
let isValidPassword = false;
let isAdmin = false;

$(document).ready(function () {

    if (session.hasSession()){
        // redirect to index
        controllerUtil.redirector.toHome();
    }

    setupViews();
});

function setupViews(){
    // listeners
    loginBtn.on('click', function (){
        console.log('clicked')
        handleLogin();
    });

    emailField.keyup(function () {
        isValidEmail = document.getElementById('emailField').checkValidity();
        updateInputField(emailField, isValidEmail);
    });

    passwordField.keyup(function () {
        isValidPassword = document.getElementById('passwordField').checkValidity();
        updateInputField(passwordField, isValidPassword);
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
    });
}

function handleLogin(){
    updateAllInputFields();

    if (isValidInputs()){
        let password = passwordField.val();
        let email = emailField.val();

        if (isAdmin){
            loginAdmin(password)
        } else {
            loginCustomer(email, password);
        }
    }
}

function isValidInputs(){
    isValidEmail = document.getElementById('emailField').checkValidity();
    isValidPassword = document.getElementById('passwordField').checkValidity();

    if (isAdmin){
        if (isValidPassword) return true;
        else return false;
    } else {
        if (isValidEmail && isValidPassword) return true;
        else return false;
    }
}

function updateAllInputFields(){
    updateInputField(emailField, isValidEmail);
    updateInputField(passwordField, isValidPassword);
}

function updateInputField(inputFieldId, isValid) {
    if (isValid) {
        inputFieldId.removeClass('invalid');
    } else {
        inputFieldId.addClass('invalid');
    }
}


// requests
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
            isValidPassword = false;
            updateAllInputFields();

            $('#info').removeClass('invisible');
            $('#info').addClass('auth-container-info-text');
        });
}

function loginCustomer(email, password){
    api.loginCustomer(email, password)
        .done(function (data){
            $('#info').addClass('invisible');
            // logged in
            // save customer in session
            storage.user.set(data);

            // set cookies
            document.cookie = 'isAdmin=false';
            document.cookie = 'customer_id=' + data.id;

            // redirect to index
            window.location.href = 'index.html';
        })
        .fail(function (request){
            // set input to invalid
            isValidEmail = false;
            isValidPassword = false;
            updateAllInputFields();

            // login failed
            $('#info').removeClass('invisible');
            $('#info').addClass('auth-container-info-text');
        });
}