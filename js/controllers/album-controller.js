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

// fields
const albumId = controllerUtil.getParam('id');
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
        // TODO implement
    });

    deleteBtn.on('click', function (){
        // TODO implement
    });

    addBtn.on('click', function (){
        // TODO implement
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

//////  requests //////////////
function fetchAlbum() {
    api.getAlbumsById(albumId)
        .done(function (data) {
            albumNameField.text(data.title);
            artistNameField.text(data.artist.name);
            artistNameField.data('id', data.artist.id);
            trackTotalField.text(data.track_total);
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

