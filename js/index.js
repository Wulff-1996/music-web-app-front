'use strict';

if (!session.hasSession()){
    // not logged in, redirect to login
    window.location.href = 'login.html';
}

$(document).ready(function (){

    api.getAlbums();

});