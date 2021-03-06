'use strict';

// views
const albumNameField = $('#albumNameField');
const artistNameField = $('#artistNameField');
const trackTotalField = $('#trackTotal');
const optionsContainer = $('#albumOptions');

// buttons
const editBtn = $('#albumEditBtn');
const deleteBtn = $('#albumDeleteBtn');
const addBtn = $('#addBtn');
const pageBtn = $('#pageField');
const previousBtn = $('#previousPageField');
const nextBtn = $('#nextPageField');

// list
const list = $('#tracksList');

// events
const EVENT_DELETE = 'EVENT_DELETE';
const EVENT_DELETE_SUCCESS = 'EVENT_DELETE_SUCCESS';

// delegates
const albumDelegate = {
    onAlbumUpdated(data){
        album = data;
        populateView();
    },
    onAlbumAdded(album){
        // dont implement
    }
}

const trackDelegate = {
    onTrackAdded(){
        // fetch tracks
        fetchTracks();
    }
}

// fields
const albumId = controllerUtil.getParam('id');
let album = null;
let page = 0;

$(document).ready(function () {

    controllerUtil.checkForSession();
    if (!controllerUtil.validateQueryParamId(albumId)) return;
    controllerUtil.loadHeaderFooter();

    // check if admin
    if (!session.isAdmin()) {
        // remove views for admin
        optionsContainer.hide();
        addBtn.hide()
    }

    setupViews();

    // fetch data
    fetchAlbum();
    fetchTracks();
});

function setupViews() {
    // listensers
    // list item clicked
    $(list).on('click', 'div.listItem', function () {
        controllerUtil.handleListItemClicked($(this).data());
    });

    // artist name clicked go to artist
    artistNameField.on('click', function () {
        window.location.href = 'artist.html?id=' + $(this).data('id');
    });

    // admin modify album buttons
    editBtn.on('click', function (){
        if (album){
            // show modal if album exists and is fetched
            albumModal.show(AlbumModalController.MODE_EDIT, albumDelegate, album);
        }
    });

    deleteBtn.on('click', function (){
        controllerUtil.alertDialog.show(
            'Delete Album',
            'Are you sure you want to delete this album? This action cannot be undone.',
            EVENT_DELETE,
            {
                ALERT_HAS_CANCEL: true,
                ALERT_ACTION_TEXT: 'Delete'
            }
        );
    });

    addBtn.on('click', function (){
        if (album){
            // show modal if album exists and is fetched
            trackModal.show(TrackModalController.MODE_ADD_ALBUM_LOCKED, trackDelegate, null, album);
        }
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
        switch (alertEvent){

            case EVENT_DELETE:
                deleteAlbum();
                break;

            case EVENT_DELETE_SUCCESS:
                controllerUtil.redirector.toHome();
                break;
        }
    });

    // pagination
    previousBtn.on('click', function () {
        if (page > 0) {
            page--;
            notifyPageChanged();
            fetchTracks();
        }
    });

    nextBtn.on('click', function () {
        let isDisabled = $(this).attr('disabled');
        // null means it does not have disabled
        if (isDisabled == null) {
            page++;
            notifyPageChanged();
            fetchTracks();
        }
    });
}

function populateView(){
    albumNameField.text(album.title);
    artistNameField.text(album.artist.name);
    artistNameField.data('id', album.artist.id);
    trackTotalField.text(album.track_total);
}

//////  requests //////////////
function fetchAlbum() {
    api.getAlbumsById(albumId)
        .done(function (data) {
            album = data;
            populateView();
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function fetchTracks() {
    let params = {
        'page': page,
        'album_id': albumId
    };

    api.getTracks(params)
        .done(function (data) {
            let tracks = data.tracks;
            updateList(adapter.getTrackViews(tracks));
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function deleteAlbum(){
    api.deleteAlbum(albumId)
        .done(function (data){
            controllerUtil.alertDialog.show(
                'Album Deleted',
                'The album was successfully deleted. You will now be redirected to home.',
                EVENT_DELETE_SUCCESS
            )
        })
        .fail(function (request){
            errorHandler.handleFail(request);
        });
}

function updateList(views) {
    // padination
    showPagination(views.length == 0);

    list.empty();
    list.append(views);
}

function showPagination(isEmpty) {
    const container = $('#paginationContainer');
    if (isEmpty) {
        if (page > 0) {
            // user has changed by page
            // disable next page
            nextBtn.attr('disabled', 'disabled');
        } else {
            // not by page remove
            container.removeClass('pagination');
            container.addClass('gone');
        }
    } else {
        // enable next button
        nextBtn.removeAttr('disabled');
        container.removeClass('gone');
        container.addClass('pagination');
    }
}

function notifyPageChanged() {
    pageBtn.text(page + 1);
}

