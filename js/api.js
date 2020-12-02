'use strict';

const BASE_URL = 'http://localhost/music-web-app-api/'

$(document).ready(function (){

    function callback(status, data){

    }


function loginCustomer(email, password, callback){
    const url = BASE_URL + 'customer-login'

    $.ajax({
        url: url,
        type: 'POST'
    })
        .done(function (data) {
            // successful login
            callback('success', data);

        })
        .fail(function (data){
            // login failed
            callback('fail', data)

        });

}


});