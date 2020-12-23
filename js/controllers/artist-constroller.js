'use strict';

// views
const optionsView = $('#artistOptions');
const artistNameField = $('#artistNameField');
const albumTotalField = $('#albumTotalField');

// buttons
const editBtn = $('#artistEditBtn');
const deleteBtn = $('#artistDeleteBtn');
const addBtn = $('#addBtn');
const searchAlbumsBtn = $('#searchAlbum');
const searchTracksBtn = $('#searchTracks');
const previousBtn = $('#previousPageField');
const nextBtn = $('#nextPageField');
const pageBtn = $('#pageField');

// list
const list = $('#aristResultList');

// flags
const isAdmin = session.isAdmin();

// fields
let page = 0;
const artistId = controllerUtil.getParam('id');

$(document).ready(function () {

    controllerUtil.checkForSession();
    if (!controllerUtil.validateQueryParamId(artistId)) return;
    controllerUtil.loadHeaderFooter();

    // remove views based on auth
    if (!isAdmin) {
        optionsView.hide();
        addBtn.hide();
    }

    // setup views
    setupViews();

    // fetch data
    fetchArtist();
    fetchAlbums();
});

function setupViews() {
    // listeners
    $('#aristResultList').on('click', 'div.listItem', function () {
        controllerUtil.handleListItemClicked($(this).data());
    });

    editBtn.on('click', function () {
        // TODO implement edit
    });

    deleteBtn.on('click', function () {
        // TODO implement delete
    });

    addBtn.on('click', function () {
        // TODO implment add
    });

    searchAlbumsBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        fetchAlbums();
        updateSearchOption(searchAlbumsBtn);
    });

    searchTracksBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        fetchTracks();
        updateSearchOption(searchTracksBtn);
    });

    // pagination
    previousBtn.on('click', function () {
        if (page > 0) {
            page--;
            notifyPageChanged();
            handlePageSearch();
        }
    });

    nextBtn.on('click', function () {
        let isDisabled = $(this).attr('disabled');
        // null means it does not have disabled
        if (isDisabled == null) {
            page++;
            notifyPageChanged();
            handlePageSearch();
        }
    });
}

function handlePageSearch() {
    switch (getSearchOptionId()) {
        case searchAlbumsBtn.attr('id'):
            fetchAlbums();
            break;

        case searchTracksBtn.attr('id'):
            fetchTracks();
            break;
    }
}

function getSearchOptionId() {
    return $('.options-container div.option-item-selected').attr('id');
}

function notifyPageChanged() {
    pageBtn.text(page + 1);
}

// requests
function fetchArtist() {
    api.getArtistById(artistId)
        .done(function (data) {
            artistNameField.text(data.name);
            albumTotalField.text(data.album_total);
        })
        .fail(function (reqeust) {
            errorHandler.handleFail(reqeust);
        });
}

function fetchAlbums() {
    let params = {
        'page': page,
        'artist_id': artistId
    };

    api.getAlbums(params)
        .done(function (data) {
            let albums = data.albums;
            updateList(adapter.getAlbumViews(albums));
        })
        .fail(function (request) {
            errorHandler.handleFail(reqeust);
        });
}

function fetchTracks() {
    let params = {
        'page': page,
        'artist_id': artistId
    };

    api.getTracks(params)
        .done(function (data) {
            let tracks = data.tracks;
            updateList(adapter.getTrackViews(tracks));
        })
        .fail(function (requst) {
            errorHandler.handleFail(reqeust);
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

/////////////// UI   /////////////////////////
function updateSearchOption(searchOption) {

    updateAddButtonText(searchOption.attr('id'));

    if (!searchOption.hasClass('option-item-selected')) {
        // add class
        searchOption.addClass('option-item-selected');

        // remove class from other options
        if (searchOption.attr('id') != searchAlbumsBtn.attr('id')) {
            searchAlbumsBtn.removeClass('option-item-selected');
        }

        if (searchOption.attr('id') != searchTracksBtn.attr('id')) {
            searchTracksBtn.removeClass('option-item-selected');
        }
    }
}

function updateAddButtonText(searchOption) {
    switch (searchOption) {
        case searchAlbumsBtn.attr('id'):
            addBtn.text('Add Album');
            break;

        case searchTracksBtn.attr('id'):
            addBtn.html('Add Track');
            break;
    }
}