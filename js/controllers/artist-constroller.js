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

// search options
const SEARCH_OPTION_ALBUMS = 'SEARCH_OPTION_ALBUMS';
const SEARCH_OPTION_TRACKS = 'SEARCH_OPTION_TRACKS';

// events
const EVENT_DELETE = 'EVENT_DELETE';
const EVENT_DELETE_SUCCESS = 'EVENT_DELETE_SUCCESS';

// delegates
const artistDelegate = {
    onArtistUpdated(data) {
        artist = data;
        populateView();
    }
}

const albumDelegate = {
    onAlbumAdded(album) {
        if (search === SEARCH_OPTION_ALBUMS) {
            fetchAlbums();
        }
    }
}

// fields
let page = 0;
const artistId = controllerUtil.getParam('id');
let artist = null;
let search = SEARCH_OPTION_ALBUMS;

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
        artistModal.show(ArtistModalController.MODE_EDIT, artistDelegate, artist);
    });

    deleteBtn.on('click', function () {
        controllerUtil.alertDialog.show(
            'Delete Artist',
            'Are you sure you want to delete this artist? This action cannot be undone.',
            EVENT_DELETE,
            {
                ALERT_HAS_CANCEL: true,
                ALERT_ACTION_TEXT: 'Delete'
            }
        );
    });

    addBtn.on('click', function () {
        albumModal.show(AlbumModalController.MODE_ADD_ARTIST_LOCKED, albumDelegate, null, artist);
    });

    searchAlbumsBtn.on('click', function () {
        page = 0;
        search = SEARCH_OPTION_ALBUMS;
        notifyPageChanged();
        fetchAlbums();
        updateSearchOption(searchAlbumsBtn);
    });

    searchTracksBtn.on('click', function () {
        page = 0;
        search = SEARCH_OPTION_TRACKS;
        notifyPageChanged();
        fetchTracks();
        updateSearchOption(searchTracksBtn);
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
                deleteArtist();
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

function populateView() {
    artistNameField.text(artist.name);
    albumTotalField.text(artist.album_total);
}

// requests
function fetchArtist() {
    api.getArtistById(artistId)
        .done(function (data) {
            artist = data;
            populateView();
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

function deleteArtist(){
    api.deleteArtist(artistId)
        .done(function (data){
            controllerUtil.alertDialog.show(
                'Artist Deleted',
                'The artist was successfully deleted. You will now be redirected to home.',
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

/////////////// UI   /////////////////////////
function updateSearchOption(searchOption) {
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