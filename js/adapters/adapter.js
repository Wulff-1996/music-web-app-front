'use strict';

const adapter = {
    getTrackViews(tracks) {
        return createTrackViews(tracks);
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

function createTrackViews(tracks) {
    let trackViews = [];

    tracks.forEach(function (track) {
        let trackView = $('<div />', {'class': 'listItem pointer'});
        trackView.data('id', track.id);
        trackView.data('type', 'track');

        let header = $('<div />', {
            'class': 'itemHeader',
        }).appendTo(trackView);

        $('<img />', {
            'src': 'icons/icon-track.svg',
            'class': 'icon-small'
        }).appendTo(header);

        $('<h5>' + track.title + '</h5>').appendTo(header);

        let subheader = $('<div />', {
            'class': 'itemSubheader'
        }).appendTo(trackView);

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