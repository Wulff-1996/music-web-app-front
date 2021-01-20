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
    getAlertModal(title, message, mode = null, options = null){
        return createAlertModal(title, message, mode, options);
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

        $('<h5 />')
            .text(track.title)
            .appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(leftContainer);

        $('<img/>', {
            'src': 'icons/icon-artist-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p />')
            .text(track.artist['name'])
            .appendTo(subheader);
        $('<div/>', {'class': 'verticalDivider marginleft marginright'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-album-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p />')
            .text(track.album['title'])
            .appendTo(subheader);
        $('<div/>', {'class': 'verticalDivider marginleft marginright'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-price-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p />')
            .text(track.unit_price)
            .appendTo(subheader);

        const rightContainer = $('<div/>', {'class':'flex-center'}).appendTo(trackView);

        switch (mode){
            case LIST_ITEM_MODE_DELETE:
                // add delete button
                const deleteButton = $('<img/>', {
                    'src':'icons/icon-delete.svg',
                    'class':'icon-extra-small gone delete img-list-item-button'
                }).appendTo(rightContainer);
                deleteButton.data('id', track.id);
                deleteButton.data('type', LIST_ITEM_TYPE_TRACK);
                break;

            case LIST_ITEM_MODE_CART_ADD:
                const cartBtn = $('<img/>', {
                    'src':'icons/icon-cart.svg',
                    'class':'icon-extra-small gone cart img-list-item-button'
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

        $('<h5 />')
            .text(artist.name)
            .appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(artistView);

        $('<img/>', {
            'src': 'icons/icon-album-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p />')
            .text(artist.album_total)
            .appendTo(subheader);

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

        $('<h5 />')
            .text(album.title)
            .appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(albumView);

        $('<img/>', {
            'src': 'icons/icon-artist-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p />')
            .text(album.artist.name)
            .appendTo(subheader);
        $('<div/>', {'class': 'verticalDivider marginleft marginright'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-track-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p />')
            .text(album.track_total)
            .appendTo(subheader);

        albumViews.push(albumView);
    });

    return albumViews;
}

const ALERT_EVENT_UNAUTHORIZED = 'ALERT_EVENT_UNAUTHORIZED';
const ALERT_EVENT_BAD_REQUEST = 'ALERT_EVENT_BAD_REQUEST';
const ALERT_EVENT_CONFLICT = 'ALERT_EVENT_CONFLICT';
const ALERT_EVENT_NOT_FOUND = 'ALERT_EVENT_NOT_FOUND';
const ALERT_EVENT_INVALID_PATH_ID = 'ALERT_EVENT_INVALID_PATH_ID';


// options
const ALERT_HAS_CANCEL = 'ALERT_HAS_CANCEL';
const ALERT_ACTION_TEXT = 'ALERT_ACTION_TEXT';
const ALERT_CANCEL_TEXT = 'ALERT_CANCEL_TEXT';

function createAlertModal(title, message, mode = null, options = null){
    let hasCancel = false;
    let actionText = 'OK';
    let cancelText = 'Cancel';

    /*options dict of options to the alert model
    * -hasCancel: Boolean
    * -actionText: string
    * -cancelText: string
    */
    if (options != null){
        hasCancel = (options[ALERT_HAS_CANCEL]) ? options[ALERT_HAS_CANCEL] : hasCancel;
        actionText = (options[ALERT_ACTION_TEXT]) ? options[ALERT_ACTION_TEXT] : actionText;
        cancelText = (options[ALERT_CANCEL_TEXT]) ? options[ALERT_CANCEL_TEXT] : cancelText;
    }

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

    if (hasCancel){
        // cancel button
        const cancelButton = $('<button/>', {
            'id': 'alertModalCancelBtn',
            'class': 'alert-button with-fit marginright'
        }).appendTo(buttonContainer);

        cancelButton.text(cancelText);
        cancelButton.data('mode', mode);
    }

    // ok button
    const okButton = $('<button/>', {
        'id': 'alertModalOkBtn',
        'class': 'alert-button with-fit'
    }).appendTo(buttonContainer);

    okButton.text(actionText);
    okButton.data('mode', mode);

    return alertbackground;
}