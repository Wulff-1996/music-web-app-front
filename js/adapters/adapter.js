'use strict';

const adapter = {
    getTrackViews(tracks, mode = null) {
        return createTrackViews(tracks, mode);
    },
    getArtistViews(artists) {
        return createArtistViews(artists);
    },
    getAlbumViews(albums) {
        return createAlbumViews(albums);
    },
    getAlertErrorModal(title, message, mode){
        return createAlertErrorModal(title, message, mode);
    }
};

// list item types
const LIST_ITEM_TYPE_TRACK = 'LIST_ITEM_TYPE_TRACK';
const LIST_ITEM_TYPE_ALBUM = 'LIST_ITEM_TYPE_ALBUM';
const LIST_ITEM_TYPE_ARTIST = 'LIST_ITEM_TYPE_ARTIST';


const LIST_ITEM_MODE_DELETE = 'LIST_ITEM_MODE_DELETE';
const LIST_ITEM_MODE_CART_ADD = 'LIST_ITEM_MODE_CART_ADD';

function createTrackViews(tracks, mode = null) {
    let trackViews = [];

    tracks.forEach(function (track) {
        let trackView = $('<div />', {'class': 'listItem pointer flex'});
        trackView.data('id', track.id);
        trackView.data('type', 'track');

        const leftContainer = $('<div/>', {'class': 'flex-child-fill'}).appendTo(trackView);

        let header = $('<div />', {
            'class': 'itemHeader',
        }).appendTo(leftContainer);

        $('<img />', {
            'src': 'icons/icon-track.svg',
            'class': 'icon-small'
        }).appendTo(header);

        $('<h5>' + track.title + '</h5>').appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(leftContainer);

        $('<img/>', {
            'src': 'icons/icon-artist-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + track.artist['name'] + '</p>').appendTo(subheader);
        $('<div/>', {'class': 'verticalDivider marginleft marginright'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-album-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + track.album['title'] + '</p>').appendTo(subheader);
        $('<div/>', {'class': 'verticalDivider marginleft marginright'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-price-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + track.unit_price + '</p>').appendTo(subheader);

        const rightContainer = $('<div/>', {'class':'flex-center'}).appendTo(trackView);

        switch (mode){
            case LIST_ITEM_MODE_DELETE:
                // add delete button
                const deleteButton = $('<img/>', {
                    'src':'icons/icon-delete.svg',
                    'class':'icon-medium gone delete img-list-item-button'
                }).appendTo(rightContainer);
                deleteButton.data('id', track.id);
                deleteButton.data('type', LIST_ITEM_TYPE_TRACK);
                break;

            case LIST_ITEM_MODE_CART_ADD:
                const cartBtn = $('<img/>', {
                    'src':'icons/icon-cart.svg',
                    'class':'icon-medium gone cart img-list-item-button'
                }).appendTo(rightContainer);
                cartBtn.data('id', track.id);
                cartBtn.data('type', LIST_ITEM_TYPE_TRACK);
                cartBtn.data('track', track);

                break;
        }

        trackViews.push(trackView);
    });

    return trackViews;
}

function createArtistViews(artists) {
    let artistViews = [];

    artists.forEach(function (artist) {
        let artistView = $('<div />', {'class': 'listItem pointer'});
        artistView.data('id', artist.id);
        artistView.data('type', 'artist');

        let header = $('<div />', {
            'class': 'itemHeader',
        }).appendTo(artistView);

        $('<img />', {
            'src': 'icons/icon-artist.svg',
            'class': 'icon-small'
        }).appendTo(header);

        $('<h5>' + artist.name + '</h5>').appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(artistView);

        $('<img/>', {
            'src': 'icons/icon-album-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + artist.album_total + '</p>').appendTo(subheader);

        artistViews.push(artistView);
    });

    return artistViews;
}

function createAlbumViews(albums) {
    let albumViews = [];

    albums.forEach(function (album) {
        let albumView = $('<div />', {'class': 'listItem pointer'});
        albumView.data('id', album.id);
        albumView.data('type', 'album');

        let header = $('<div />', {
            'class': 'itemHeader',
        }).appendTo(albumView);

        $('<img />', {
            'src': 'icons/icon-album.svg',
            'class': 'icon-small'
        }).appendTo(header);

        $('<h5>' + album.title + '</h5>').appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(albumView);

        $('<img/>', {
            'src': 'icons/icon-artist-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + album.artist.name + '</p>').appendTo(subheader);
        $('<div/>', {'class': 'verticalDivider marginleft marginright'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-track-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + album.track_total + '</p>').appendTo(subheader);

        albumViews.push(albumView);
    });

    return albumViews;
}

const ALERT_MODE_SUCCESS = 'ALERT_MODE_SUCCESS';
const ALERT_MODE_ERROR_NOT_FOUND = 'ALERT_MODE_ERROR_NOT_FOUND';
const ALERT_MODE_ERROR_UNAUTHORIZED = 'ALERT_MODE_ERROR_UNAUTHORIZED';

function createAlertErrorModal(title, message, mode){
    const alertbackground = $('<div/>', {'class': 'modal-background'});
    const alertModal = $('<div/>', {'class':'alert-modal center'}).appendTo(alertbackground);

    // header container
    const header = $('<div/>', {'class':'alert-header'}).appendTo(alertModal);

    // title
    const titleView = $('<h3/>', {'class':'text-center'}).appendTo(header);
    titleView.text(title);

    // message
    const messageView = $('<p/>', {'class':'alert-message text-center margintop'}).appendTo(header);
    messageView.text(message);


    // buttons container
    const buttonContainer = $('<div/>', {'class': 'margintop-big flex-center'}).appendTo(alertModal);

    // ok button
    const okButton = $('<button/>', {
        'id': 'alertModalOkBtn',
        'class': 'alert-button with-fit'
    }).appendTo(buttonContainer);

    okButton.text('OK');
    okButton.data('mode', mode);

    return alertbackground;
}