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
const libraryView = $('#libraryBar');
const addContainerView = $('#addContainer');

// fields
let page = 0;
let isLibrarySearch = false;
let isAdmin = session.isAdmin();

$(document).ready(function () {

    controllerUtil.checkForSession();
    controllerUtil.loadHeaderFooter();

    // remove views based on auth
    if (isAdmin) {
        // remove library option
        libraryView.hide();
    } else {
        // remove add button
        addContainerView.hide();
    }

    setupViews();

    // fetch data
    fetchTracks();
});

function setupViews() {
    // listeners
    // listitem on click
    $(listView).on('click', 'div.listItem', function (event) {
        let target = $(event.target);

        // check if list item or list item button was clicked
        if (!target.is('img.img-list-item-button')) {
            // list item clicked
            controllerUtil.handleListItemClicked($(this).data());
        } else {
            // list item button clicked
            let data = $(target).data();
            let id = data.id;
            let type = data.type;
            let track = data.track;

            if (isAdmin) {
                // TODO handle delete track
            } else {
                // check if item should be added or removed
                if (storage.cart.exists(id)) {
                    // remove from cart
                    storage.cart.removeTrack(id);
                    // update imge
                    target.attr('src', 'icons/icon-cart.svg');
                } else {
                    // add to cart
                    storage.cart.addTrack(track);
                    // update list item
                    target.attr('src', 'icons/icon-cart-success.svg');
                }
            }
        }
    });

    // fade in list item delete button
    $(listView).on('mouseenter', 'div.listItem', function () {
        let listButton = $(this).find('img.img-list-item-button');

        // check if track is in storage
        if (storage.cart.exists(listButton.data('id'))) {
            // update img to green
            listButton.attr('src', 'icons/icon-cart-success.svg');
        } else {
            listButton.attr('src', 'icons/icon-cart.svg');
        }
        listButton.removeClass('gone');
    });

    // fade out list item delete button
    $(listView).on('mouseleave', 'div.listItem', function () {
        let listButton = $(this).find('img.img-list-item-button');
        listButton.addClass('gone');
    });

    // search options
    libraryToggle.on('change', function () {
        isLibrarySearch = $(this).is(':checked');
    });

    addBtn.on('click', function () {
        // TODO show add dialog here

        switch (getSearchOptionId()) {

            case 'searchTracks':
                trackModal.show(TrackModalController.MODE_ADD);
                break;

            case 'searchArtists':
                break;

            case 'searchAlbums':
                albumModal.show(AlbumModalController.MODE_ADD);
                break;
        }
    });

    tracksOptionBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        fetchTracks();
        updateSearchOption(tracksOptionBtn);
    });
    artistsOptionBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        fetchArtists();
        updateSearchOption(artistsOptionBtn);
    });
    albumsOptionBtn.on('click', function () {
        page = 0;
        notifyPageChanged();
        fetchAlbums();
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
    let search = controllerUtil.valueOrNull(searchField.val());

    switch (getSearchOptionId()) {

        case 'searchTracks':
            fetchTracks(search, page);
            break;

        case 'searchArtists':
            fetchArtists(search, page);
            break;

        case 'searchAlbums':
            fetchAlbums(search, page);
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
function fetchTracks(search = null) {
    let params = {'page': page};
    let mode = null;

    if (isAdmin) {
        mode = LIST_ITEM_MODE_DELETE;
    } else {
        mode = LIST_ITEM_MODE_CART_ADD;
    }

    if (isLibrarySearch) {
        params['customer_id'] = storage.user.get().id;
    } else if (search != null) {
        params['search'] = search;
    }

    api.getTracks(params)
        .done(function (data) {
            let tracks = data.tracks;
            updateList(adapter.getTrackViews(tracks, mode));
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function fetchArtists(search = null) {
    let params = {'page': page};
    if (search != null) {
        params['name'] = search;
    }
    let mode = null;

    if (isAdmin) {
        mode = LIST_ITEM_MODE_DELETE;
    }

    api.getArtists(params)
        .done(function (data) {
            let artists = data.artists;
            updateList(adapter.getArtistViews(artists, mode));
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function fetchAlbums(search = null) {
    let params = {'page': page};
    if (search != null) {
        params['title'] = search;
    }
    let mode = null;

    if (isAdmin) {
        mode = LIST_ITEM_MODE_DELETE;
    }

    api.getAlbums(params)
        .done(function (data) {
            let albums = data.albums;
            updateList(adapter.getAlbumViews(albums, mode));
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

function notifyPageChanged() {
    pageBtn.text(page + 1);
}

function updateList(views) {
    // show no results if empty
    showPagination(views.length == 0);

    listView.empty();
    listView.append(views);
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
