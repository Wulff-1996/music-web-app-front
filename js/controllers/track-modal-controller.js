'use strict';

let _this;

class TrackModalController {
    // buttons
    closeBtn = $('#trackModalCloseBtn');
    saveBtn = $('#trackModalSaveBtn');

    // dropdowns
    albumDropDown = $('#trackModalAlbumDropDown');
    genreDropDown = $('#trackModalGenreDropDown');
    mediaDropDown = $('#trackModalMediaDropDown');

    // lists
    albumList = $('#trackModalAlbumList');
    genreList = $('#trackModalGenreList');
    mediaList = $('#trackModalMediaList');

    // views
    header = $('#trackModalHeader');
    titleField = $('#trackModalTitleField');
    priceField = $('#trackModalPriceField');
    albumField = $('#trackModalAlbumField');
    composerField = $('#trackModalComposerField');
    genreField = $('#trackModalGenreField');
    mediaField = $('#trackModalMediaField');
    millisecondsField = $('#trackModalMillisecondsField');
    bytesField = $('#trackModalBytesField');

    albumPageField = $('#trackModalAlbumPageField');
    genrePageField = $('#trackModalGenrePageField');
    mediaPageField = $('#trackModalMediaPageField');

    // fields
    trackModalPage = 0;
    RESULT_COUNT = 5;
    track = null; // ? this is a json track (needed to store both title and ids of ex album)
    editTrack = new Track(); // this is a class
    searchMode = null;

    SEARCH_MODE_ALBUM = 'SEARCH_MODE_ALBUM';
    SEARCH_MODE_GENRE = 'SEARCH_MODE_GENRE';
    SEARCH_MODE_MEDIA = 'SEARCH_MODE_MEDIA';

    TYPE_ALBUM = 'TYPE_ALBUM';
    TYPE_GENRE = 'TYPE_GENRE';
    TYPE_MEDIA = 'TYPE_MEDIA';

    // delegate
    delegate = null;

    // mode
    mode;

    // modes
    static get MODE_EDIT() {
        return 'MODE_EDIT'
    };

    static get MODE_ADD() {
        return 'MODE_ADD'
    };

    // events
    static get EVENT_TRACK_UPDATED() {
        return 'EVENT_TRACK_UPDATED'
    };

    static get EVENT_TRACK_ADDED() {
        return 'EVENT_TRACK_ADDED'
    };

    // flags
    isValidTitle = true;
    isValidPrice = true;
    isValidAlbum = true;
    isValidComposer = true;
    isValidGenre = true;
    isValidMedia = true;
    isValidMilliseconds = true;
    isValidBytes = true;

    constructor(mode, delegate = null, track = null) {
        _this = this;
        this.track = track;
        this.mode = mode;
        this.delegate = delegate;

        if (mode === TrackModalController.MODE_EDIT) {
            if (this.track == null) {
                throw 'Error: track needed for MODE_EDIT.';
            }

            // parse values from json track to class Track named editTrack
            this.editTrack = new Track(
                null,
                this.track.title,
                this.track.album.id,
                this.track.media.id,
                this.track.genre.id,
                this.track.composer,
                this.track.milliseconds,
                this.track.bytes,
                this.track.unit_price
            );
        } else {
            // update flags
            this.isValidTitle = false;
            this.isValidPrice = false;
            this.isValidMilliseconds = false;
            this.isValidMedia = false;
        }
    }

    dismiss() {
        $('#trackModalBackground').remove();
    }

    show() {
        // load html and bind views to intance
        $('#trackModalContainer').load('trackmodal.html #trackModalBackground', function () {
            // bind views

            _this.header = $('#trackModalHeader');
            // buttons
            _this.saveBtn = $('#trackModalSaveBtn');
            _this.closeBtn = $('#trackModalCloseBtn');

            // drop downs
            _this.albumDropDown = $('#trackModalAlbumDropDown');
            _this.genreDropDown = $('#trackModalGenreDropDown');
            _this.mediaDropDown = $('#trackModalMediaDropDown');

            // lists
            _this.albumList = $('#trackModalAlbumList');
            _this.genreList = $('#trackModalGenreList');
            _this.mediaList = $('#trackModalMediaList');

            // views
            _this.titleField = $('#trackModalTitleField');
            _this.priceField = $('#trackModalPriceField');
            _this.albumField = $('#trackModalAlbumField');
            _this.composerField = $('#trackModalComposerField');
            _this.genreField = $('#trackModalGenreField');
            _this.mediaField = $('#trackModalMediaField');
            _this.millisecondsField = $('#trackModalMillisecondsField');
            _this.bytesField = $('#trackModalBytesField');

            _this.albumPageField = $('#trackModalAlbumPageField');
            _this.genrePageField = $('#trackModalGenrePageField');
            _this.mediaPageField = $('#trackModalMediaPageField');

            switch (_this.mode) {
                case TrackModalController.MODE_EDIT:
                    _this.header.text('Edit Track');
                    _this.populateView();
                    break;

                case TrackModalController.MODE_ADD:
                    _this.header.text('Add Track');
                    break;
            }
            _this.setupViews();
        });
    }

    populateView() {
        this.titleField.val(this.track.title);
        this.priceField.val(this.track.unit_price);
        this.albumField.val(this.track.album.title);
        this.composerField.val(this.track.composer);
        this.genreField.val(this.track.genre.name);
        this.mediaField.val(this.track.media.name);
        this.millisecondsField.val(this.track.milliseconds);
        this.bytesField.val(this.track.bytes);
    }

    setupViews() {
        // listeners
        // buttons
        this.saveBtn.on('click', function () {
            _this.validateInputs();
            _this.updateAllInputFields();

            if (_this.isInputsValid()) {

                let milliseconds = controllerUtil.valueOrNull(_this.millisecondsField.val());
                milliseconds = (milliseconds) ? parseInt(milliseconds) : null;

                let bytes = controllerUtil.valueOrNull(_this.bytesField.val());
                bytes = (bytes) ? parseInt(bytes) : null;

                // get customer info
                let track = {
                    'name': _this.titleField.val(),
                    'unit_price': _this.priceField.val(),
                    'composer': controllerUtil.valueOrNull(_this.composerField.val()),
                    'milliseconds': milliseconds,
                    'bytes': bytes,
                    'album_id': _this.editTrack.albumId,
                    'genre_id': _this.editTrack.genreId,
                    'media_type_id': _this.editTrack.mediaTypeId
                }

                switch (_this.mode) {
                    case TrackModalController.MODE_EDIT:
                        _this.updateTrack(track);
                        break;

                    case TrackModalController.MODE_ADD:
                        _this.addTrack(track)
                        break;
                }
            }
        });

        this.closeBtn.on('click', function () {
            _this.dismiss();
        });

        // alert modal button
        $(document).on('click', 'button.alert-button', function (event) {
            let target = $(event.target);
            let alertEvent = $(this).data('mode');
            let isOkAction = (target.attr('id') === 'alertModalOkBtn') ? true : false;

            // remove alert modal
            controllerUtil.alertDialog.remove();
        });

        // dropdown from input
        this.albumField.keyup(function () {
            // update flag and input field UI
            _this.isValidAlbum = _this.validateAlbum();
            _this.updateInputField(_this.albumField, _this.isValidAlbum);

            // update data
            _this.editTrack.albumId = null;

            // get search
            let search = _this.albumField.val();
            _this.searchMode = _this.SEARCH_MODE_ALBUM;

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchAlbums(search);
        });

        this.genreField.keyup(function () {
            // update flag and input field UI
            _this.isValidGenre = _this.validateGenre();
            _this.updateInputField(_this.genreField, _this.isValidGenre);

            // update data
            _this.editTrack.genreId = null;

            // get search
            let search = _this.genreField.val();
            _this.searchMode = _this.SEARCH_MODE_GENRE;

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchGenres(search);
        });

        this.mediaField.keyup(function () {
            // update flag and input field UI
            _this.isValidMedia = _this.validateMedia();
            _this.updateInputField(_this.mediaField, _this.isValidMedia);

            // update data
            _this.editTrack.mediaTypeId = null;

            // get search
            let search = _this.mediaField.val();
            _this.searchMode = _this.SEARCH_MODE_MEDIA;

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchMedia(search);
        });

        this.albumField.on('click', function (e) {
            e.stopPropagation();
            let search = _this.albumField.val();
            _this.searchMode = _this.SEARCH_MODE_ALBUM;

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchAlbums(search);
        });

        this.genreField.on('click', function (e) {
            e.stopPropagation();

            let search = _this.genreField.val();
            _this.searchMode = _this.SEARCH_MODE_GENRE;

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchGenres(search);
        });

        this.mediaField.on('click', function (e) {
            e.stopPropagation();

            let search = _this.mediaField.val();
            _this.searchMode = _this.SEARCH_MODE_MEDIA;

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchMedia(search);
        });

        this.titleField.keyup(function (){
            _this.isValidTitle = _this.validateInput(_this.titleField);
            _this.updateInputField(_this.titleField, _this.isValidTitle);
        });

        this.priceField.keyup(function (){
            _this.isValidPrice = _this.validateInput(_this.priceField);
            _this.updateInputField(_this.priceField, _this.isValidPrice);
        });

        this.composerField.keyup(function (){
            _this.isValidComposer = _this.validateInput(_this.composerField);
            _this.updateInputField(_this.composerField, _this.isValidComposer);
        });

        this.millisecondsField.keyup(function (){
            _this.isValidMilliseconds = _this.validateInput(_this.millisecondsField);
            _this.updateInputField(_this.millisecondsField, _this.isValidMilliseconds);
        });

        this.bytesField.keyup(function (){
            _this.isValidBytes = _this.validateInput(_this.bytesField);
            _this.updateInputField(_this.bytesField, _this.isValidBytes);
        });


        // document listeners
        $('#trackModalBackground').on('click', function (event) {

            // hide dropdown if outside dropdown
            if (!_this.albumDropDown.is(event.target) &&
                _this.albumDropDown.has(event.target).length === 0 &&
                !_this.genreDropDown.is(event.target) &&
                _this.genreDropDown.has(event.target).length === 0 &&
                !_this.mediaDropDown.is(event.target) &&
                _this.mediaDropDown.has(event.target).length === 0) {
                _this.hideDropDown()
            }
        });

        // click on list item
        $('ul').on('click', 'p.dropdownchild', function (event) {
            let target = $(event.target);
            let type = target.data('type');
            let id = target.data('id');
            let title = target.data('title');

            switch (type) {
                case _this.TYPE_ALBUM:
                    _this.editTrack.albumId = id;
                    _this.albumField.val(title);
                    _this.isValidAlbum = true;
                    _this.updateInputField(_this.albumField, _this.isValidAlbum);
                    _this.hideDropDown();
                    break;

                case _this.TYPE_GENRE:
                    _this.editTrack.genreId = id;
                    _this.genreField.val(title);
                    _this.isValidGenre = true;
                    _this.updateInputField(_this.genreField, _this.isValidGenre);
                    _this.hideDropDown();
                    break;

                case _this.TYPE_MEDIA:
                    _this.editTrack.mediaTypeId = id;
                    _this.mediaField.val(title);
                    _this.isValidMedia = true;
                    _this.updateInputField(_this.mediaField, _this.isValidMedia);
                    _this.hideDropDown();
                    break;
            }
        });

        // pagination
        $('img.trackModalPreviousPage').on('click', function () {
            if (_this.trackModalPage > 0) {
                _this.trackModalPage--;
                _this.notifyPageChanged();
                _this.handleSearch();
            }
        });

        $('img.trackModalNextPage').on('click', function () {
            let isDisabled = $(this).attr('disabled');
            // null means it does not have disabled
            if (isDisabled == null) {
                _this.trackModalPage++;
                _this.notifyPageChanged();
                _this.handleSearch();
            }
        });
    }

    handleSearch() {
        let search = null;

        switch (this.searchMode) {
            case this.SEARCH_MODE_ALBUM:
                search = this.albumField.val();
                this.fetchAlbums(search);
                break;

            case this.SEARCH_MODE_GENRE:
                search = this.genreField.val();
                this.fetchGenres(search);
                break;

            case this.SEARCH_MODE_MEDIA:
                search = this.mediaField.val();
                this.fetchMedia(search);
                break;
        }
    }

    hideDropDown() {
        this.albumDropDown.removeClass('dropdown-show');
        this.genreDropDown.removeClass('dropdown-show');
        this.mediaDropDown.removeClass('dropdown-show');
    }

    showDropDown() {
        // reset page
        this.trackModalPage = 0;
        this.notifyPageChanged();

        switch (this.searchMode) {
            case this.SEARCH_MODE_ALBUM:
                this.albumDropDown.addClass('dropdown-show');
                this.genreDropDown.removeClass('dropdown-show');
                this.mediaDropDown.removeClass('dropdown-show');
                break;

            case this.SEARCH_MODE_GENRE:
                this.genreDropDown.addClass('dropdown-show');
                this.albumDropDown.removeClass('dropdown-show');
                this.mediaDropDown.removeClass('dropdown-show');
                break;

            case this.SEARCH_MODE_MEDIA:
                this.mediaDropDown.addClass('dropdown-show');
                this.albumDropDown.removeClass('dropdown-show');
                this.genreDropDown.removeClass('dropdown-show');
                break;
        }
    }

    populateList(list, type) {
        let views = [];
        let listView = null;

        switch (type) {
            case this.TYPE_ALBUM:
                listView = this.albumList;
                break;

            case this.TYPE_GENRE:
                listView = this.genreList;
                break;

            case this.TYPE_MEDIA:
                listView = this.mediaList;
                break;
        }

        list.forEach(function (element) {

            let item = $('<p/>', {'class': 'margin-normal pointer dropdownchild'});

            switch (type) {
                case _this.TYPE_ALBUM:
                    item.text(element.title);
                    item.data('id', element.id);
                    item.data('type', _this.TYPE_ALBUM);
                    item.data('title', element.title);
                    break;

                case _this.TYPE_GENRE:
                    item.text(element.name);
                    item.data('id', element.id);
                    item.data('type', _this.TYPE_GENRE);
                    item.data('title', element.name);
                    break;

                case _this.TYPE_MEDIA:
                    item.text(element.name);
                    item.data('id', element.id);
                    item.data('type', _this.TYPE_MEDIA);
                    item.data('title', element.name);
                    break;
            }

            views.push(item);
        });

        listView.empty();
        listView.append(views);
    }

    notifyPageChanged() {
        this.albumPageField.text(this.trackModalPage + 1);
        this.genrePageField.text(this.trackModalPage + 1);
        this.mediaPageField.text(this.trackModalPage + 1);
    }

    enableNextPage(isEnable) {
        if (isEnable) {
            $('img.trackModalNextPage').removeAttr('disabled');
        } else {
            $('img.trackModalNextPage').attr('disabled', 'disabled');
        }
    }

    updateAllInputFields() {
        this.updateInputField(this.titleField, this.isValidTitle);
        this.updateInputField(this.priceField, this.isValidPrice);
        this.updateInputField(this.albumField, this.isValidAlbum);
        this.updateInputField(this.composerField, this.isValidComposer);
        this.updateInputField(this.genreField, this.isValidGenre);
        this.updateInputField(this.mediaField, this.isValidMedia);
        this.updateInputField(this.millisecondsField, this.isValidMilliseconds);
        this.updateInputField(this.bytesField, this.isValidBytes);
    }

    updateInputField(inputField, isValid) {
        if (isValid) {
            inputField.removeClass('invalid');
        } else {
            inputField.addClass('invalid');
        }
    }

    validateInputs() {
        // required fields
        this.isValidTitle = this.validateInput(this.titleField);
        this.isValidPrice = this.validateInput(this.priceField);
        this.isValidMilliseconds = this.validateInput(this.millisecondsField);
        this.isValidMedia = this.validateMedia();

        // optional
        this.isValidComposer = this.validateInput(this.composerField);
        this.isValidBytes = this.validateInput(this.composerField);
        this.isValidAlbum = this.validateAlbum();
        this.isValidGenre = this.validateGenre();
    }

    validateInput(inputField){
        return document.getElementById(inputField.attr('id')).checkValidity();
    }

    validateMedia() {
        return (this.editTrack.mediaTypeId != null) ? true : false;
    }

    validateGenre() {
        let genreValue = controllerUtil.valueOrNull(this.genreField.val());
        return (this.editTrack.genreId == null && genreValue == null ||
            this.editTrack.genreId != null && genreValue != null) ? true : false;
    }

    validateAlbum() {
        let albumValue = controllerUtil.valueOrNull(this.albumField.val());
        return (this.editTrack.albumId == null && albumValue == null ||
            this.editTrack.albumId != null && albumValue != null) ? true : false;
    }

    isInputsValid() {
        if (this.isValidTitle && this.isValidPrice && this.isValidAlbum && this.isValidComposer &&
            this.isValidGenre && this.isValidMedia && this.isValidMilliseconds && this.isValidBytes) {
            return true;
        } else return false;
    }

    // requests
    fetchAlbums(search) {
        let params = {
            'title': search,
            'count': this.RESULT_COUNT,
            'page': this.trackModalPage
        }

        api.getAlbums(params)
            .done(function (data) {
                _this.enableNextPage(data.albums.length == 5);
                _this.populateList(data.albums, _this.TYPE_ALBUM);
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    fetchGenres(search) {
        let params = {
            'search': search,
            'page': this.trackModalPage
        }

        api.getGenres(params)
            .done(function (data) {
                _this.enableNextPage(data.genres.length == 5);
                _this.populateList(data.genres, _this.TYPE_GENRE);
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    fetchMedia(search) {
        let params = {
            'search': search,
            'page': this.trackModalPage
        }

        api.getMedia(params)
            .done(function (data) {
                _this.enableNextPage(data.media.length == 5);
                _this.populateList(data.media, _this.TYPE_MEDIA);
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    updateTrack(track) {
        let id = this.track.id

        api.updateTrack(id, track)
            .done(function (data) {
                if (_this.delegate){
                    _this.delegate.onTrackUpdated(data);
                }
                _this.dismiss();
                controllerUtil.alertDialog.show(
                    'Track Updated',
                    'The track has been successfully updated',
                    TrackModalController.EVENT_TRACK_UPDATED
                );
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    addTrack(track) {
        api.addTrack(track)
            .done(function (data) {
                if (_this.delegate){
                    _this.delegate.onTrackAdded(data);
                }
                _this.dismiss();
                controllerUtil.alertDialog.show(
                    'Track Added',
                    'Track has been successfully added.',
                    TrackModalController.EVENT_TRACK_ADDED
                );
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            })
    }
}


const trackModal = {
    show(mode, delegate = null, track = null) {
        this.trackModalController = new TrackModalController(mode, delegate, track);
        this.trackModalController.show();
    },
    dissmiss() {
        this.trackModalController.dismiss();
    }
}