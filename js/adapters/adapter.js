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
    }
};

function createTrackViews(tracks) {
    let trackViews = [];

    tracks.forEach(function (track) {
        let trackView = $('<div />', {'class': 'listItem'});
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
        $('<div/>', {'class': 'vertialDivider'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-album-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + track.album['title'] + '</p>').appendTo(subheader);
        $('<div/>', {'class': 'vertialDivider'}).appendTo(subheader);

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
        let artistView = $('<div />', {'class': 'listItem'});
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
        let albumView = $('<div />', {'class': 'listItem'});
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
        $('<div/>', {'class': 'vertialDivider'}).appendTo(subheader);

        $('<img/>', {
            'src': 'icons/icon-track-muted.svg',
            'class': 'icon-extra-small icon-margin'
        }).appendTo(subheader);
        $('<p>' + album.track_total + '</p>').appendTo(subheader);

        albumViews.push(albumView);
    });

    return albumViews;
}