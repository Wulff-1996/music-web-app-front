'use strict';

if (!session.hasSession()) {
    // not logged in, redirect to login
    window.location.href = 'login.html';
}

// load in header and footer
$('#header-container').load('header.html #header');
$('#footer-container').load('footer.html #footer');

// buttons
const searchBtn = $('#searchButton');
const tracksOptionBtn = $('#searchTracks');
const artistsOptionBtn = $('#searchArtist');
const albumsOptionBtn = $('#searchAlbum');
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

    console.log(typeof(session.isAdmin()))
    console.log(session.isAdmin())

    // remove views based on auth
    if (session.isAdmin() == true){
        // remove library option
        libraryView.hide();
    } else {
        // remove add button
        addContainerView.hide();
    }

    // listeners
    // search options
    libraryToggle.on('change', function (){
        isLibrarySearch = $(this).is(':checked');
    });

    addBtn.on('click', function (){
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
        if (isDisabled == null){
            page++;
            notifyPageChanged()
            handleSearch();
        }
    });
});


////////////////  business logic /////////////////
function handleSearch() {

    let search = valueOrNull(searchField.val());

    switch (getSearchOptionId()) {

        case 'searchTracks':
            gettracks(search, page);
            break;

        case 'searchArtist':
            getArtists(search, page);
            break;

        case 'searchAlbum':
            getAlbums(search, page);
            break;
    }

}

/////////////// UI   /////////////////////////
function updateSearchOption(searchOption) {

    updateAddButtonText(searchOption.attr('id'));

    if (!searchOption.hasClass('selected')) {
        // add class
        searchOption.addClass('selected');

        // remove class from other options
        if (searchOption.attr('id') != 'searchTracks') {
            tracksOptionBtn.removeClass('selected');
        }

        if (searchOption.attr('id') != 'searchArtist') {
            artistsOptionBtn.removeClass('selected');
        }

        if (searchOption.attr('id') != 'searchAlbum') {
            albumsOptionBtn.removeClass('selected');
        }
    }
}

function updateAddButtonText(searchOption){
    switch (searchOption) {
        case 'searchTracks':
            addBtn.text('Add Track');
            break;

        case 'searchArtist':
            addBtn.html('Add Artist');
            break;

        case 'searchAlbum':
            addBtn.html('Add Album');
            break;
    }
}


////////////////  requests //////////////////////
function gettracks(search = null) {
    let params = {'page': page};

    if (isLibrarySearch){
        params['customer_id'] = session.customerId();
    } else if (search != null){
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

function showNoResults(isEmpty){
    if (isEmpty){
        infoTextField.removeClass('gone');
    } else {
        infoTextField.addClass('gone');
    }
}

function showPagination(isEmpty){
    const container = $('#paginationContainer');
    if (isEmpty){
        if (page > 0){
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
    return $('#optionsBar .selected').attr('id');
}

function valueOrNull(value) {
    if (value == '') {
        return null
    } else {
        return value;
    }
}
