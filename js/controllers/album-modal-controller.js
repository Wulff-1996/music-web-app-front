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
        let self = this;

        // load html and bind views to intance
        $('#albumModalContainer').load('albummodal.html #albumModalBackground', function () {
            // bind views
            // buttons
            self.closeBtn = $('#albumModalCloseBtn');
            self.saveBtn = $('#albumModalSaveBtn');

            // drop down
            self.artistDropDown = $('#albumModalArtistDropDown');

            // list
            self.artistList = $('#albumModalArtistList');

            // fields
            self.header = $('#albumModalHeader');
            self.titleField = $('#albumModalTitleField');
            self.artistField = $('#albumModalArtistField');
            self.artistPageField = $('#albumModalArtistPageField');

            switch (self.mode) {
                case AlbumModalController.MODE_EDIT:
                    self.header.text('Edit Album');
                    self.populateView();
                    break;

                case AlbumModalController.MODE_ADD:
                    self.header.text('Add Album');
                    break;
            }
            self.setupViews();
        });
    }

    populateViews() {
        this.titleField.val(this.album.title);
        this.artistField.val(this.album.artist.name);
    }

    setupViews() {
        let self = this;

        // listeners
        // buttons
        this.saveBtn.on('click', function () {
            self.handleSave();
        });

        this.closeBtn.on('click', function () {
            self.dismiss();
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
            self.isValidArtist = self.validateArtist();
            self.updateInputField(self.artistField, self.isValidArtist);

            // update data
            self.editAlbum.artistId = null;

            // get search
            let search = self.artistField.val();

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchArtists(search);
        });

        this.artistField.on('click', function (e) {
            e.stopPropagation();

            let search = self.artistField.val();

            // show dropdown if not visible
            self.showDropDown();

            // fetch data
            self.fetchArtists(search);
        });

        this.titleField.keyup(function () {
            self.isValidTitle = self.validateInput(self.titleField);
            self.updateInputField(self.titleField, self.isValidTitle);
        });

        // document listeners
        $('#albumModalBackground').on('click', function (event) {

            // hide dropdown if outside dropdown
            if (!self.artistDropDown.is(event.target) &&
                self.artistDropDown.has(event.target).length === 0
            ) {
                self.hideDropDown()
            }
        });

        // click on list item
        $('ul').on('click', 'p.dropdownchild', function (event) {
            let target = $(event.target);
            let id = target.data('id');
            let name = target.data('name');

            self.editAlbum.artistId = id;
            self.artistField.val(name);
            self.isValidArtist = true;
            self.updateInputField(self.artistField, self.isValidArtist);
            self.hideDropDown();
        });

        // pagination
        $('img.albumModalPreviousPage').on('click', function () {
            if (self.page > 0) {
                self.page--;
                self.notifyPageChanged();

                let search = self.artistField.val();
                self.fetchArtists(search);
            }
        });

        $('img.albumModalNextPage').on('click', function () {
            let isDisabled = $(this).attr('disabled');
            // null means it does not have disabled
            if (isDisabled == null) {
                self.page++;
                self.notifyPageChanged();

                let search = self.artistField.val();
                self.fetchArtists(search);
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

            switch (this.mode) {
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
        let self = this;
        let id = this.album.id;

        api.updateAlbum(id, album)
            .done(function (data) {
                if (self.delegate) {
                    self.delegate.onAlbumUpdated(data);
                }
                self.dismiss();
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
        let self = this;

        api.addAlbum(album)
            .done(function (data) {
                if (self.delegate) {
                    self.delegate.onAlbumAdded(data);
                }
                self.dismiss();
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
        let self = this;
        let params = {
            'name': search,
            'page': this.page,
            'count': AlbumModalController.RESULT_COUNT
        }

        api.getArtists(params)
            .done(function (data) {
                self.enableNextPage(data.artists.length == AlbumModalController.RESULT_COUNT);
                self.populateList(data.artists);
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