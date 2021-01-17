'use strict';

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
        let self = this;
        
        // load html and bind views to intance
        $('#trackModalContainer').load('trackmodal.html #trackModalBackground', function () {
            // bind views

            self.header = $('#trackModalHeader');
            // buttons
            self.saveBtn = $('#trackModalSaveBtn');
            self.closeBtn = $('#trackModalCloseBtn');

            // drop downs
            self.albumDropDown = $('#trackModalAlbumDropDown');
            self.genreDropDown = $('#trackModalGenreDropDown');
            self.mediaDropDown = $('#trackModalMediaDropDown');

            // lists
            self.albumList = $('#trackModalAlbumList');
            self.genreList = $('#trackModalGenreList');
            self.mediaList = $('#trackModalMediaList');

            // views
            self.titleField = $('#trackModalTitleField');
            self.priceField = $('#trackModalPriceField');
            self.albumField = $('#trackModalAlbumField');
            self.composerField = $('#trackModalComposerField');
            self.genreField = $('#trackModalGenreField');
            self.mediaField = $('#trackModalMediaField');
            self.millisecondsField = $('#trackModalMillisecondsField');
            self.bytesField = $('#trackModalBytesField');

            self.albumPageField = $('#trackModalAlbumPageField');
            self.genrePageField = $('#trackModalGenrePageField');
            self.mediaPageField = $('#trackModalMediaPageField');

            switch (self.mode) {
                case TrackModalController.MODE_EDIT:
                    self.header.text('Edit Track');
                    self.populateView();
                    break;

                case TrackModalController.MODE_ADD:
                    self.header.text('Add Track');
                    break;
            }
            self.setupViews();
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
        let self = this;
        
        // listeners
        // buttons
        this.saveBtn.on('click', function () {
            self.validateInputs();
            self.updateAllInputFields();

            if (self.isInputsValid()) {

                let milliseconds = controllerUtil.valueOrNull(self.millisecondsField.val());
                milliseconds = (milliseconds) ? parseInt(milliseconds) : null;

                let bytes = controllerUtil.valueOrNull(self.bytesField.val());
                bytes = (bytes) ? parseInt(bytes) : null;

                // get customer info
                let track = {
                    'name': self.titleField.val(),
                    'unit_price': self.priceField.val(),
                    'composer': controllerUtil.valueOrNull(self.composerField.val()),
                    'milliseconds': milliseconds,
                    'bytes': bytes,
                    'album_id': self.editTrack.albumId,
                    'genre_id': self.editTrack.genreId,
                    'media_type_id': self.editTrack.mediaTypeId
                }

                switch (self.mode) {
                    case TrackModalController.MODE_EDIT:
                        self.updateTrack(track);
                        break;

                    case TrackModalController.MODE_ADD:
                        self.addTrack(track)
                        break;
                }
            }
        });

        this.closeBtn.on('click', function () {
            self.dismiss();
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
            self.isValidAlbum = self.validateAlbum();
            self.updateInputField(self.albumField, self.isValidAlbum);

            // update data
            self.editTrack.albumId = null;

            // get search
            let search = self.albumField.val();
            self.searchMode = self.SEARCH_MODE_ALBUM;

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchAlbums(search);
        });

        this.genreField.keyup(function () {
            // update flag and input field UI
            self.isValidGenre = self.validateGenre();
            self.updateInputField(self.genreField, self.isValidGenre);

            // update data
            self.editTrack.genreId = null;

            // get search
            let search = self.genreField.val();
            self.searchMode = self.SEARCH_MODE_GENRE;

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchGenres(search);
        });

        this.mediaField.keyup(function () {
            // update flag and input field UI
            self.isValidMedia = self.validateMedia();
            self.updateInputField(self.mediaField, self.isValidMedia);

            // update data
            self.editTrack.mediaTypeId = null;

            // get search
            let search = self.mediaField.val();
            self.searchMode = self.SEARCH_MODE_MEDIA;

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchMedia(search);
        });

        this.albumField.on('click', function (e) {
            e.stopPropagation();
            let search = self.albumField.val();
            self.searchMode = self.SEARCH_MODE_ALBUM;

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchAlbums(search);
        });

        this.genreField.on('click', function (e) {
            e.stopPropagation();

            let search = self.genreField.val();
            self.searchMode = self.SEARCH_MODE_GENRE;

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchGenres(search);
        });

        this.mediaField.on('click', function (e) {
            e.stopPropagation();

            let search = self.mediaField.val();
            self.searchMode = self.SEARCH_MODE_MEDIA;

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchMedia(search);
        });

        this.titleField.keyup(function (){
            self.isValidTitle = self.validateInput(self.titleField);
            self.updateInputField(self.titleField, self.isValidTitle);
        });

        this.priceField.keyup(function (){
            self.isValidPrice = self.validateInput(self.priceField);
            self.updateInputField(self.priceField, self.isValidPrice);
        });

        this.composerField.keyup(function (){
            self.isValidComposer = self.validateInput(self.composerField);
            self.updateInputField(self.composerField, self.isValidComposer);
        });

        this.millisecondsField.keyup(function (){
            self.isValidMilliseconds = self.validateInput(self.millisecondsField);
            self.updateInputField(self.millisecondsField, self.isValidMilliseconds);
        });

        this.bytesField.keyup(function (){
            self.isValidBytes = self.validateInput(self.bytesField);
            self.updateInputField(self.bytesField, self.isValidBytes);
        });


        // document listeners
        $('#trackModalBackground').on('click', function (event) {

            // hide dropdown if outside dropdown
            if (!self.albumDropDown.is(event.target) &&
                self.albumDropDown.has(event.target).length === 0 &&
                !self.genreDropDown.is(event.target) &&
                self.genreDropDown.has(event.target).length === 0 &&
                !self.mediaDropDown.is(event.target) &&
                self.mediaDropDown.has(event.target).length === 0) {
                self.hideDropDown()
            }
        });

        // click on list item
        $('ul').on('click', 'p.dropdownchild', function (event) {
            let target = $(event.target);
            let type = target.data('type');
            let id = target.data('id');
            let title = target.data('title');

            switch (type) {
                case self.TYPE_ALBUM:
                    self.editTrack.albumId = id;
                    self.albumField.val(title);
                    self.isValidAlbum = true;
                    self.updateInputField(self.albumField, self.isValidAlbum);
                    self.hideDropDown();
                    break;

                case self.TYPE_GENRE:
                    self.editTrack.genreId = id;
                    self.genreField.val(title);
                    self.isValidGenre = true;
                    self.updateInputField(self.genreField, self.isValidGenre);
                    self.hideDropDown();
                    break;

                case self.TYPE_MEDIA:
                    self.editTrack.mediaTypeId = id;
                    self.mediaField.val(title);
                    self.isValidMedia = true;
                    self.updateInputField(self.mediaField, self.isValidMedia);
                    self.hideDropDown();
                    break;
            }
        });

        // pagination
        $('img.trackModalPreviousPage').on('click', function () {
            if (self.trackModalPage > 0) {
                self.trackModalPage--;
                self.notifyPageChanged();
                self.handleSearch();
            }
        });

        $('img.trackModalNextPage').on('click', function () {
            let isDisabled = $(this).attr('disabled');
            // null means it does not have disabled
            if (isDisabled == null) {
                self.trackModalPage++;
                self.notifyPageChanged();
                self.handleSearch();
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
        let self = this;
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
                case self.TYPE_ALBUM:
                    item.text(element.title);
                    item.data('id', element.id);
                    item.data('type', self.TYPE_ALBUM);
                    item.data('title', element.title);
                    break;

                case self.TYPE_GENRE:
                    item.text(element.name);
                    item.data('id', element.id);
                    item.data('type', self.TYPE_GENRE);
                    item.data('title', element.name);
                    break;

                case self.TYPE_MEDIA:
                    item.text(element.name);
                    item.data('id', element.id);
                    item.data('type', self.TYPE_MEDIA);
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
        let self = this;
        let params = {
            'title': search,
            'count': this.RESULT_COUNT,
            'page': this.trackModalPage
        }

        api.getAlbums(params)
            .done(function (data) {
                self.enableNextPage(data.albums.length == 5);
                self.populateList(data.albums, self.TYPE_ALBUM);
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    fetchGenres(search) {
        let self = this;
        let params = {
            'search': search,
            'page': this.trackModalPage
        }

        api.getGenres(params)
            .done(function (data) {
                self.enableNextPage(data.genres.length == 5);
                self.populateList(data.genres, self.TYPE_GENRE);
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    fetchMedia(search) {
        let self = this;
        let params = {
            'search': search,
            'page': this.trackModalPage
        }

        api.getMedia(params)
            .done(function (data) {
                self.enableNextPage(data.media.length == 5);
                self.populateList(data.media, self.TYPE_MEDIA);
            })
            .fail(function (request) {
                errorHandler.handleFail(request);
            });
    }

    updateTrack(track) {
        let self = this;
        let id = this.track.id

        api.updateTrack(id, track)
            .done(function (data) {
                if (self.delegate){
                    self.delegate.onTrackUpdated(data);
                }
                self.dismiss();
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
        let self = this;
        api.addTrack(track)
            .done(function (data) {
                if (self.delegate){
                    self.delegate.onTrackAdded(data);
                }
                self.dismiss();
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