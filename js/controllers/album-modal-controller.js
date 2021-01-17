'use strict';

// TODO fix _this references, bc it is also used in other files

class AlbumModalController {
    // buttons
    closeBtn = $('#albumModalCloseBtn');
    saveBtn = $('#albumModalSaveBtn');

    // dropdowns
    artistDropDown = $('#albumModalAlbumDropDown');

    // page
    artistPageField = $('#albumModalArtistPageField');

    // list
    artistList = $('#albumModalArtistList');

    // views
    header = $('#albumModalHeader');
    titleField = $('#albumModalTitleField');
    artistField = $('#albumModalArtistField');

    // flags
    isValidTitle = true;
    isValidArtist = true;

    get isInputsValid() {
        return this.isValidTitle && this.isValidArtist
    }

    // delegate
    delegate = null;

    // mode
    mode = null;

    // modes
    static get MODE_ADD() {
        return 'MODE_ADD';
    }

    static get MODE_EDIT() {
        return 'MODE_EDIT';
    }

    // events
    static get EVENT_ALBUM_UPDATED() {
        return 'EVENT_ALBUM_UPDATED';
    }

    static get EVENT_ALBUM_ADDED() {
        return 'EVENT_ALBUM_ADDED';
    }

    // field constants
    static get RESULT_COUNT() {
        return 5;
    }

    // fields
    page = 0;
    album = null;
    editAlbum = new Album();

    constructor(mode, delegate, album = null) {
        _this = this;
        this.mode = mode;
        this.delegate = delegate;
        this.album = album;

        if (mode === AlbumModalController.MODE_EDIT) {
            if (this.album === null) {
                throw 'Error: album needed for MODE_EDIT.';
            }

            // parse values from json album to editAlbum
            this.editAlbum = new Album(
                this.album.id,
                this.album.title,
                this.album.artist.id
            );
        } else {
            // update flags
            this.isValidTitle = false;
            this.isValidArtist = false;
        }
    }

    dismiss() {
        $('#albumModalBackground').remove();
    }

    show() {
        // load html and bind views to intance
        $('#albumModalContainer').load('albummodal.html #albumModalBackground', function () {
            // bind views
            // buttons
            _this.closeBtn = $('#albumModalCloseBtn');
            _this.saveBtn = $('#albumModalSaveBtn');

            // drop down
            _this.artistDropDown = $('#albumModalArtistDropDown');

            // list
            _this.artistList = $('#albumModalArtistList');

            // fields
            _this.header = $('#albumModalHeader');
            _this.titleField = $('#albumModalTitleField');
            _this.artistField = $('#albumModalArtistField');
            _this.artistPageField = $('#albumModalArtistPageField');

            switch (_this.mode) {
                case AlbumModalController.MODE_EDIT:
                    _this.header.text('Edit Album');
                    _this.populateView();
                    break;

                case AlbumModalController.MODE_ADD:
                    _this.header.text('Add Album');
                    break;
            }
            _this.setupViews();
        });
    }

    populateViews() {
        this.titleField.val(this.album.title);
        this.artistField.val(this.album.artist.name);
    }

    setupViews() {
        // listeners
        // buttons
        this.saveBtn.on('click', function () {
            _this.handleSave();
        });

        this.closeBtn.on('click', function () {
            _this.dismiss();
        });

        // alert modal button
        $(document).on('click', 'button.alert-button', function (event) {
            let target = $(event.target);
            let alertEvent = $(this).data('mode');

            switch (alertEvent) {
                case AlbumModalController.EVENT_ALBUM_ADDED:
                    // remove alert modal
                    controllerUtil.alertDialog.remove();
                    break;

                case AlbumModalController.EVENT_ALBUM_UPDATED:
                    // remove alert modal
                    controllerUtil.alertDialog.remove();
                    break;
            }
        });

        // dropdown
        this.artistField.keyup(function () {
            // update flag and input field UI
            _this.isValidArtist = _this.validateArtist();
            _this.updateInputField(_this.artistField, _this.isValidArtist);

            // update data
            _this.editAlbum.artistId = null;

            // get search
            let search = _this.artistField.val();

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchArtists(search);
        });

        this.artistField.on('click', function (e) {
            e.stopPropagation();

            let search = _this.artistField.val();

            // show dropdown if not visible
            _this.showDropDown();

            // fetch data
            _this.fetchArtists(search);
        });

        this.titleField.keyup(function () {
            _this.isValidTitle = _this.validateInput(_this.titleField);
            _this.updateInputField(_this.titleField, _this.isValidTitle);
        });

        // document listeners
        $('#albumModalBackground').on('click', function (event) {

            // hide dropdown if outside dropdown
            if (!_this.artistDropDown.is(event.target) &&
                _this.artistDropDown.has(event.target).length === 0
            ) {
                _this.hideDropDown()
            }
        });

        // click on list item
        $('ul').on('click', 'p.dropdownchild', function (event) {
            let target = $(event.target);
            let id = target.data('id');
            let name = target.data('name');

            _this.editAlbum.artistId = id;
            _this.artistField.val(name);
            _this.isValidArtist = true;
            _this.updateInputField(_this.artistField, _this.isValidArtist);
            _this.hideDropDown();
        });

        // pagination
        $('img.albumModalPreviousPage').on('click', function () {
            if (_this.page > 0) {
                _this.page--;
                _this.notifyPageChanged();

                let search = _this.artistField.val();
                _this.fetchArtists(search);
            }
        });

        $('img.albumModalNextPage').on('click', function () {
            let isDisabled = $(this).attr('disabled');
            // null means it does not have disabled
            if (isDisabled == null) {
                _this.page++;
                _this.notifyPageChanged();

                let search = _this.artistField.val();
                _this.fetchArtists(search);
            }
        });
    }

    handleSave() {
        this.validateInputs();
        this.updateAllInputFields();

        if (this.isInputsValid) {

            // create album entity
            let album = {
                'title': this.titleField.val(),
                'artist_id': this.editAlbum.artistId
            }

            console.log(album)

            switch (_this.mode) {
                case AlbumModalController.MODE_EDIT:
                    this.updateAlbum(album);
                    break;

                case AlbumModalController.MODE_ADD:
                    this.addAlbum(album)
                    break;
            }
        }
    }


    ///////////////// validation  //////////////////////////////
    validateInputs() {
        this.isValidTitle = this.validateInput(this.titleField);
        this.isValidArtist = this.validateArtist();
    }

    validateInput(inputField) {
        return document.getElementById(inputField.attr('id')).checkValidity();
    }

    validateArtist() {
        let artistValue = controllerUtil.valueOrNull(this.artistField.val());
        return (this.editAlbum.artistId == null && artistValue == null ||
            this.editAlbum.artistId != null && artistValue != null) ? true : false;
    }


    /////////////// UI ///////////////////
    updateAllInputFields() {
        this.updateInputField(this.titleField, this.isValidTitle);
        this.updateInputField(this.artistField, this.isValidArtist);
    }

    updateInputField(inputField, isValid) {
        if (isValid) {
            inputField.removeClass('invalid');
        } else {
            inputField.addClass('invalid');
        }
    }

    populateList(list) {
        let views = [];
        let listView = this.artistList;

        list.forEach(function (element) {

            let item = $('<p/>', {'class': 'margin-normal pointer dropdownchild'});
            item.text(element.name);
            item.data('id', element.id);
            item.data('name', element.name);

            views.push(item);
        });

        listView.empty();
        listView.append(views);
    }

    enableNextPage(isEnable) {
        if (isEnable) {
            $('img.albumModalNextPage').removeAttr('disabled');
        } else {
            $('img.albumModalNextPage').attr('disabled', 'disabled');
        }
    }

    showDropDown() {
        // reset page
        this.trackModalPage = 0;
        this.notifyPageChanged();
        this.artistDropDown.addClass('dropdown-show');
    }

    hideDropDown() {
        this.artistDropDown.removeClass('dropdown-show');
    }

    notifyPageChanged() {
        this.artistPageField.text(this.page + 1);
    }

    /////////////  API Calls ////////////////////////
    updateAlbum(album) {
        let id = this.album.id;

        api.updateAlbum(id, album)
            .done(function (data) {
                if (_this.delegate) {
                    _this.delegate.onAlbumUpdated(data);
                }
                _this.dismiss();
                controllerUtil.alertDialog.show(
                    'Album Updated',
                    'The album has been successfully updated',
                    AlbumModalController.EVENT_ALBUM_UPDATED
                );
            })
            .fail(function (response) {
                errorHandler.handleFail(response);
            });
    }

    addAlbum(album) {
        api.addAlbum(album)
            .done(function (data) {
                if (_this.delegate) {
                    _this.delegate.onAlbumAdded(data);
                }
                _this.dismiss();
                controllerUtil.alertDialog.show(
                    'Album Added',
                    'Album has been successfully added.',
                    AlbumModalController.EVENT_ALBUM_ADDED
                );
            })
            .fail(function (response) {
                errorHandler.handleFail(response);
            })
    }

    fetchArtists(search) {
        let params = {
            'name': search,
            'page': this.page,
            'count': AlbumModalController.RESULT_COUNT
        }

        api.getArtists(params)
            .done(function (data) {
                _this.enableNextPage(data.artists.length == AlbumModalController.RESULT_COUNT);
                _this.populateList(data.artists);
            })
            .fail(function (response) {
                errorHandler.handleFail(response);
            })
    }
}

const albumModal = {
    show(mode, delegate = null, album = null) {
        this.albumModalController = new AlbumModalController(mode, delegate, album);
        this.albumModalController.show();
    },
    dissmiss() {
        this.albumModalController.dismiss();
    }
}