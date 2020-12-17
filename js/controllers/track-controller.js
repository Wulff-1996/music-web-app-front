'use strict';

// views
const trackTitleField = $('#trackTitleField');
const priceField = $('#priceField');
const artistNameField = $('#artistNameField');
const albumTitleField = $('#albumNameField');
const composerField = $('#composerNameField');
const genreField = $('#genreField');
const mediaField = $('#mediaField');
const millisecondsField = $('#millisecondsField');
const bytesField = $('#bytesField');
const optionsContainer = $('#trackOptions');

// buttons
const addToBasketBtn = $('#toBasketBtn');
const deleteBtn = $('#trackDeleteBtn');
const editBtn = $('#trackEditBtn');


// fields
const trackId = parseInt(controllerUtil.getParam('id'));
const isAdmin = session.isAdmin();
let isInCart = storage.cart.exists(trackId);
let track = null;

$(document).ready(function () {

    controllerUtil.checkForSession();
    controllerUtil.validateQueryParamId(trackId);
    controllerUtil.loadHeaderFooter();

    // remove views based on auth
    if (isAdmin) {
        // hide customer views
        addToBasketBtn.hide();
    } else {
        // hide admin views
        optionsContainer.hide();
    }

    // check if in cart already
    if (isInCart) {
        updateAddToBasketButton(true);
        updateAddCartBtnText(true);
    }

    // setup views
    setupViews();

    // fetch data
    fetchTrack();
});

function updateAddToBasketButton(isDisabled) {
    if (isDisabled) {
        addToBasketBtn.prop('disabled', true);
        addToBasketBtn.addClass('button-disabled');
    } else {
        addToBasketBtn.prop('disabled', false);
        addToBasketBtn.removeClass('button-disabled');
    }
}

function updateAddCartBtnText(isDisabled) {
    if (isDisabled) {
        addToBasketBtn.text('Already in Basket');
    } else {
        addToBasketBtn.text('Place in Bakset');
    }
}

function setupViews() {
    // listeners
    addToBasketBtn.on('click', function () {
        // disable button
        updateAddToBasketButton(true);

        // add to storage
        storage.cart.addTrack(track);

        // alert user of item added
        controllerUtil.alertDialog.show(
            'Track Added',
            'Track added to cart.',
            ALERT_MODE_SUCCESS);
    });

    editBtn.on('click', function () {
        // TODO
    });

    deleteBtn.on('click', function () {
        // TODO
    });

    artistNameField.on('click', function () {
        window.location.href = 'artist.html?id=' + $(this).data('id');
    });

    albumTitleField.on('click', function () {
        window.location.href = 'album.html?id=' + $(this).data('id');
    });

    // alert error modal
    $(document).on('click', '#alertModalOkBtn', function () {
        // get mode
        let mode = $(this).data('mode');

        // remove from body
        controllerUtil.alertDialog.remove();

        // check mode
        switch (mode){
            case ALERT_MODE_SUCCESS:
                // track added to cart
                updateAddToBasketButton(true);
                updateAddCartBtnText(true);
                break;

            case ALERT_MODE_ERROR_NOT_FOUND:
                // direct to home
                controllerUtil.redirector.toHome();
                break;

            case ALERT_MODE_ERROR_UNAUTHORIZED:
                controllerUtil.redirector.toLogin();
                break;
        }
    });
}

//////// request ///////////
function fetchTrack() {
    api.getTrackById(trackId)
        .done(function (data) {
            track = data;
            trackTitleField.text(data.title);
            priceField.text(data.unit_price);
            artistNameField.text(data.artist.name);
            artistNameField.data('id', data.artist.id);
            albumTitleField.text(data.album.title);
            albumTitleField.data('id', data.album.id);
            composerField.text(data.composer);
            genreField.text(data.genre.name);
            millisecondsField.text(data.milliseconds);
            mediaField.text(data.media.name);
            bytesField.text(data.bytes);
        })
        .fail(function (request) {
            switch (request.status) {

                case 404:
                    // not found
                    controllerUtil.alertDialog.show(
                        'Not Found',
                        'No resource found with id: ' + trackId + '.\n' +
                        'You will be redirected to home page.',
                        ALERT_MODE_ERROR_NOT_FOUND)
                    break;

                case 401:
                    // unautherized
                    controllerUtil.alertDialog.show(
                        'Unauthorized',
                        'This page require you to be logged in. You will be redirected to the login page.',
                        ALERT_MODE_ERROR_UNAUTHORIZED)
                    break;
            }
        });
}