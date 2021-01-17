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

// events
const EVENT_DELETE = 'EVENT_DELETE';
const EVENT_DELETE_SUCCESS = 'EVENT_DELETE_SUCCESS';


// fields
const trackId = controllerUtil.getParam('id');
const isAdmin = session.isAdmin();
let isInCart = storage.cart.exists(trackId);
let track = null;

let trackModalDelegate = {
    onTrackUpdated(data){
        track = data;
        populateView();
    },
    onTrackAdded(data){
        // dont implement
    }
}

$(document).ready(function () {

    controllerUtil.checkForSession();
    if (!controllerUtil.validateQueryParamId(trackId)) return;
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
        // add to storage
        storage.cart.addTrack(track);

        // enable and update cart button
        updateAddCartBtnText(true);

        // alert user of item added
        controllerUtil.alertDialog.show(
            'Track Added',
            'Track added to cart.'
        );
    });

    editBtn.on('click', function () {
        trackModal.show(TrackModalController.MODE_EDIT, trackModalDelegate, track)
    });

    deleteBtn.on('click', function () {
        controllerUtil.alertDialog.show(
            'Delete Track',
            'Are you sure you want to delete this track? This action cannot be undone.',
            EVENT_DELETE,
            {
                ALERT_HAS_CANCEL: true,
                ALERT_ACTION_TEXT: 'Delete'
            }
        )
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

            case EVENT_DELETE:
                deleteTrack();
                break;

            case EVENT_DELETE_SUCCESS:
                controllerUtil.redirector.toHome();
                break;
        }
    });
}

function populateView(){
    trackTitleField.text(track.title);
    priceField.text(track.unit_price);
    artistNameField.text(track.artist.name);
    artistNameField.data('id', track.artist.id);
    albumTitleField.text(track.album.title);
    albumTitleField.data('id', track.album.id);
    composerField.text(track.composer);
    genreField.text(track.genre.name);
    millisecondsField.text(track.milliseconds);
    mediaField.text(track.media.name);
    bytesField.text(track.bytes);
}

//////// request ///////////
function fetchTrack() {
    api.getTrackById(trackId)
        .done(function (data) {
            track = data;
            populateView();
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function deleteTrack(){
    api.deleteTrack(trackId)
        .done(function (data){
            controllerUtil.alertDialog.show(
                'Track Deleted',
                'The track was successfully deleted. You will now be redirected to home.',
                EVENT_DELETE_SUCCESS
            )
        })
        .fail(function (request){
            errorHandler.handleFail(request);
        });
}