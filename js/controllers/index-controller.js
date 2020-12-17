'use strict';

// buttons
const searchBtn = $('#searchButton');
const tracksOptionBtn = $('#searchTracks');
const artistsOptionBtn = $('#searchArtists');
const albumsOptionBtn = $('#searchAlbums');
const previousBtn = $('#previousPageField');
const nextBtn = $('#nextPageField');
const pageBtn = $('#pageField');
const addBtn = $('#addBtn');
const libraryToggle = $('#librarySearchField');

// input fields
const searchField = $('#searchText');

// list
const listView = $('#listView');

// views
const infoTextField = $('#infoTextFieldIndex');
const libraryView = $('#libraryBar');
const addContainerView = $('#addContainer');

// fields
let page = 0;
let isLibrarySearch = false;

$(document).ready(function () {

    controllerUtil.checkForSession();
    controllerUtil.loadHeaderFooter();

    // remove views based on auth
    if (session.isAdmin()) {
        // remove library option
        libraryView.hide();
    } else {
        // remove add button
        addContainerView.hide();
    }

    setupViews();
});

function setupViews() {
    // listeners
    // listitem on click
    $(listView).on('click', 'div.listItem', function () {
        controllerUtil.handleListItemClicked($(this).data());
    });

    // search options
    libraryToggle.on('change', function () {
        isLibrarySearch = $(this).is(':checked');
    });

    addBtn.on('click', function () {
        // TODO show add dialog here
    });

    tracksOptionBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        gettracks();
        updateSearchOption(tracksOptionBtn);
    });
    artistsOptionBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        getArtists();
        updateSearchOption(artistsOptionBtn);
    });
    albumsOptionBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        getAlbums();
        updateSearchOption(albumsOptionBtn);
    });

    // search button
    searchBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        handleSearch();
    });

    // pagination
    previousBtn.on('click', function () {
        if (page > 0) {
            page--;
            notifyPageChanged()
            handleSearch();
        }
    });

    nextBtn.on('click', function () {
        let isDisabled = $(this).attr('disabled');
        // null means it does not have disabled
        if (isDisabled == null) {
            page++;
            notifyPageChanged()
            handleSearch();
        }
    });
}


////////////////  business logic /////////////////
function handleSearch() {
    let search = valueOrNull(searchField.val());

    switch (getSearchOptionId()) {

        case 'searchTracks':
            gettracks(search, page);
            break;

        case 'searchArtists':
            getArtists(search, page);
            break;

        case 'searchAlbums':
            getAlbums(search, page);
            break;
    }

}

/////////////// UI   /////////////////////////
function updateSearchOption(searchOption) {
    updateAddButtonText(searchOption.attr('id'));

    if (!searchOption.hasClass('option-item-selected')) {
        // add class
        searchOption.addClass('option-item-selected');

        // remove class from other options
        if (searchOption.attr('id') != tracksOptionBtn.attr('id')) {
            tracksOptionBtn.removeClass('option-item-selected');
        }

        if (searchOption.attr('id') != artistsOptionBtn.attr('id')) {
            artistsOptionBtn.removeClass('option-item-selected');
        }

        if (searchOption.attr('id') != albumsOptionBtn.attr('id')) {
            albumsOptionBtn.removeClass('option-item-selected');
        }
    }
}

function updateAddButtonText(searchOption) {
    switch (searchOption) {
        case 'searchTracks':
            addBtn.text('Add Track');
            break;

        case 'searchArtists':
            addBtn.html('Add Artist');
            break;

        case 'searchAlbums':
            addBtn.html('Add Album');
            break;
    }
}


////////////////  requests //////////////////////
function gettracks(search = null) {
    let params = {'page': page};

    if (isLibrarySearch) {
        params['customer_id'] = session.customerId();
    } else if (search != null) {
        params['search'] = search;
    }

    api.getTracks(params)
        .done(function (data) {
            let tracks = data.tracks;
            updateList(adapter.getTrackViews(tracks));
        })
        .fail(function (request) {

        });
}

function getArtists(search = null) {
    let params = {'page': page};
    if (search != null) {
        params['name'] = search;
    }

    api.getArtists(params)
        .done(function (data) {
            let artists = data.artists;
            updateList(adapter.getArtistViews(artists));
        })
        .fail(function (request) {

        });
}

function getAlbums(search = null) {
    let params = {'page': page};
    if (search != null) {
        params['title'] = search;
    }

    api.getAlbums(params)
        .done(function (data) {
            let albums = data.albums;
            updateList(adapter.getAlbumViews(albums));
        })
        .fail(function (request) {

        });
}

function notifyPageChanged() {
    pageBtn.text(page + 1);
}

function updateList(views) {
    // show no results if empty
    showNoResults(views.length == 0);
    showPagination(views.length == 0);

    listView.empty();
    listView.append(views);
}

function showNoResults(isEmpty) {
    if (isEmpty) {
        infoTextField.removeClass('gone');
    } else {
        infoTextField.addClass('gone');
    }
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


/////////////// helper functions ///////////////
function getSearchOptionId() {
    return $('#indexOptions .option-item-selected').attr('id');
}

function valueOrNull(value) {
    if (value == '') {
        return null
    } else {
        return value;
    }
}
