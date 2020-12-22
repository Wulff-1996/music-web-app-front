'use strict';

// dropdowns
const albumDropDown = $('#trackModalAlbumDropDown');
const genreDropDown = $('#trackModalGenreDropDown');
const mediaDropDown = $('#trackModalMediaDropDown');

// lists
const albumList = $('#trackModalAlbumList');
const genreList = $('#trackModalGenreList');
const mediaList = $('#trackModalMediaList');

// views
const titleField = $('#trackModalTitleField');
const priceField = $('#trackModalPriceField');
const albumField = $('#trackModalAlbumField');
const composerField = $('#trackModalComposerField');
const genreField = $('#trackModalGenreField');
const mediaField = $('#trackModalMediaField');
const millisecondsField = $('#trackModalMillisecondsField');
const bytesField = $('#trackModalBytesField');

const albumPageField = $('#trackModalAlbumPageField');
const genrePageField = $('#trackModalGenrePageField');
const mediaPageField = $('#trackModalMediaPageField');

// fields
let trackModalPage = 0;
const RESULT_COUNT = 5;
let track = null;
let editTrack = new Track();
let searchMode = null;

const SEARCH_MODE_ALBUM = 'SEARCH_MODE_ALBUM';
const SEARCH_MODE_GENRE = 'SEARCH_MODE_GENRE';
const SEARCH_MODE_MEDIA = 'SEARCH_MODE_MEDIA';

const TYPE_ALBUM = 'TYPE_ALBUM';
const TYPE_GENRE = 'TYPE_GENRE';
const TYPE_MEDIA = 'TYPE_MEDIA';

$(document).ready(function () {
    // setup Views
    setupViews();
});

function setupViews() {

    // listeners
    albumField.keyup(function (){
        editTrack.albumId = null
        let search = albumField.val();
        searchMode = SEARCH_MODE_ALBUM;

        // show dropdown if not visible
        showDropDown();

        // fetch data
        fetchAlbums(search);
    });

    genreField.keyup(function (){
        editTrack.genreId = null;
        let search = genreField.val();
        searchMode = SEARCH_MODE_GENRE;

        // show dropdown if not visible
        showDropDown();

        // fetch data
        fetchGenres(search);
    });

    mediaField.keyup(function (){
        editTrack.mediaTypeId = null;
        let search = mediaField.val();
        searchMode = SEARCH_MODE_MEDIA;

        // show dropdown if not visible
        showDropDown();

        // fetch data
        fetchMedia(search);
    });

    albumField.on('click', function (){
        let search = albumField.val();
        searchMode = SEARCH_MODE_ALBUM;

        // show dropdown if not visible
        showDropDown();

        // fetch data
        fetchAlbums(search);
    });

    genreField.on('click', function (){
        let search = genreField.val();
        searchMode = SEARCH_MODE_GENRE;

        // show dropdown if not visible
        showDropDown();

        // fetch data
        fetchGenres(search);
    });

    mediaField.on('click', function (){
        let search = mediaField.val();
        searchMode = SEARCH_MODE_MEDIA;

        // show dropdown if not visible
        showDropDown();

        // fetch data
        fetchMedia(search);
    });

    // click on list item
    $('ul').on('click', 'p.dropdownchild', function (event) {
        let target = $(event.target);
        let type = target.data('type');
        let id = target.data('id');
        let title = target.data('title');

        switch (type){
            case TYPE_ALBUM:
                editTrack.albumId = id;
                albumField.val(title);
                hideDropDown();
                break;

            case TYPE_GENRE:
                editTrack.genreId = id;
                genreField.val(title);
                hideDropDown();
                break;

            case TYPE_MEDIA:
                editTrack.mediaTypeId = id;
                mediaField.val(title);
                hideDropDown();
                break;
        }
    });

    // pagination
    $('img.trackModalPreviousPage').on('click', function (){
        if (trackModalPage > 0){
            trackModalPage--;
            notifyPageChanged();
            handleSearch();
        }
    });

    $('img.trackModalNextPage').on('click', function (){
        let isDisabled = $(this).attr('disabled');
        // null means it does not have disabled
        if (isDisabled == null) {
            trackModalPage++;
            notifyPageChanged();
            handleSearch();
        }
    });
}

function handleSearch(){
    let search = null;

    switch (searchMode) {
        case SEARCH_MODE_ALBUM:
            search = albumField.val();
            fetchAlbums(search);
            break;

        case SEARCH_MODE_GENRE:
            search = genreField.val();
            fetchGenres(search);
            break;

        case SEARCH_MODE_MEDIA:
            search = mediaField.val();
            fetchMedia(search);
            break;
    }
}

function hideDropDown(){
    albumDropDown.removeClass('dropdown-show');
    genreDropDown.removeClass('dropdown-show');
    mediaDropDown.removeClass('dropdown-show');
}

function showDropDown(){
    // reset page
    trackModalPage = 0;
    notifyPageChanged();

    switch (searchMode){
        case SEARCH_MODE_ALBUM:
            albumDropDown.addClass('dropdown-show');
            genreDropDown.removeClass('dropdown-show');
            mediaDropDown.removeClass('dropdown-show');
            break;

        case SEARCH_MODE_GENRE:
            genreDropDown.addClass('dropdown-show');
            albumDropDown.removeClass('dropdown-show');
            mediaDropDown.removeClass('dropdown-show');
            break;

        case SEARCH_MODE_MEDIA:
            mediaDropDown.addClass('dropdown-show');
            albumDropDown.removeClass('dropdown-show');
            genreDropDown.removeClass('dropdown-show');
            break;
    }
}

function populateList(list, type){
    let views = [];
    let listView = null;

    switch (type){
        case TYPE_ALBUM:
            listView = albumList;
            break;

        case TYPE_GENRE:
            listView = genreList;
            break;

        case TYPE_MEDIA:
            listView = mediaList;
            break;
    }

    list.forEach(function (element){

        let item = $('<p/>', {'class': 'margin-normal pointer dropdownchild'});

        switch (type){
            case TYPE_ALBUM:
                item.text(element.title);
                item.data('id', element.id);
                item.data('type', TYPE_ALBUM);
                item.data('title', element.title);
                break;

            case TYPE_GENRE:
                item.text(element.name);
                item.data('id', element.id);
                item.data('type', TYPE_GENRE);
                item.data('title', element.name);
                break;

            case TYPE_MEDIA:
                item.text(element.name);
                item.data('id', element.id);
                item.data('type', TYPE_MEDIA);
                item.data('title', element.name);
                break;
        }

        views.push(item);
    });

    listView.empty();
    listView.append(views);
}

function notifyPageChanged() {
    albumPageField.text(trackModalPage + 1);
    genrePageField.text(trackModalPage + 1);
    mediaPageField.text(trackModalPage + 1);
}

function enableNextPage(isEnable){
    if (isEnable){
        $('img.trackModalNextPage').removeAttr('disabled');
    } else {
        $('img.trackModalNextPage').attr('disabled', 'disabled');
    }
}

// requests
function fetchAlbums(search){
    let params = {
        'title': search,
        'count': RESULT_COUNT,
        'page': trackModalPage
    }

    api.getAlbums(params)
        .done(function (data){
            enableNextPage(data.albums.length == 5);
            populateList(data.albums, TYPE_ALBUM);
        })
        .fail(function (request){

        });
}

function fetchGenres(search){
    let params = {
        'search': search,
        'page':trackModalPage
    }

    api.getGenres(params)
        .done(function (data){
            enableNextPage(data.genres.length == 5);
            populateList(data.genres, TYPE_GENRE);
        })
        .fail(function (request){

        });
}

function fetchMedia(search){
    let params = {
        'search': search,
        'page':trackModalPage
    }

    api.getMedia(params)
        .done(function (data){
            enableNextPage(data.media.length == 5);
            populateList(data.media, TYPE_MEDIA);
        })
        .fail(function (request){

        });
}