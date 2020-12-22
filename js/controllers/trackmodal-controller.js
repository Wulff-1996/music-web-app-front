'use strict';

// dropdowns
const albumDropDown = $('#albumDropDown');

// lists
const albumList = $('#albumList');

// views
const albumField = $('#albumField');
const albumPageField = $('#albumPageField');

// fields
let page = 0;
const RESULT_COUNT = 5;
let albumId = null;

$(document).ready(function () {

    // setup views
    setupViews();
});

function setupViews() {
    // listeners
    albumField.keyup(function (){
        let search = albumField.val();

        // reset page
        page = 0;
        notifyPageChanged(albumPageField);

        // show dropdown if not visible
        showDropDown(albumDropDown, true);

        // fetch data
        fetchAlbums(search);
    });


    // click on list item
    $('ul').on('click', 'p.dropdownchild', function (event) {
        let target = $(event.target);
        let type = target.data('type');

        switch (type){
            case 'album':
                albumId = target.data('title');
                albumField.val(target.data('title'));

                showDropDown(albumDropDown, false);
                break;
        }
    });
}

function showDropDown(dropDown, isShow){
    if (isShow){
        dropDown.addClass('dropdown-show');
    } else {
        dropDown.removeClass('dropdown-show');
    }
}

function createAlbumList(albums){
    let albumViews = [];

    albums.forEach(function (album){

        let item = $('<p/>', {'class': 'margin-normal pointer dropdownchild'});
        item.text(album.title);
        item.data('id', album.id);
        item.data('type', 'album');
        item.data('title', album.title);

        albumViews.push(item);
    });

    albumList.empty();
    albumList.append(albumViews);
}

function notifyPageChanged(pageField) {
    pageField.text(page + 1);
}

// requests
function fetchAlbums(search){
    let params = {
        'title': search,
        'count': RESULT_COUNT,
        'page': page
    }

    console.log(params)

    api.getAlbums(params)
        .done(function (data){
            createAlbumList(data.albums);
        })
        .fail(function (request){

        });
}