'use strict';

class ArtistModalController {
    // buttons
    closeBtn = $('#artistModalCloseBtn');
    saveBtn = $('#artistModalSaveBtn');

    // views
    header = $('#artistModalHeader');
    nameField = $('#artistModalNameField');

    // flags
    isValidName = true;

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
    static get EVENT_ARTIST_UPDATED() {
        return 'EVENT_ARTIST_UPDATED';
    }

    static get EVENT_ARTIST_ADDED() {
        return 'EVENT_ARTIST_ADDED';
    }

    // fields
    artist = null;
    editArtist = new Artist();

    constructor(mode, delegate, artist = null) {
        this.mode = mode;
        this.delegate = delegate;
        this.artist = artist;

        if (mode === ArtistModalController.MODE_EDIT.MODE_EDIT) {
            if (this.album === null) {
                throw 'Error: album needed for MODE_EDIT.';
            }

            // parse values from json album to editAlbum
            this.editArtist = new Artist(
                this.artist.id,
                this.artist.name
            );
        } else {
            // update flags
            this.isValidName = false;
        }
    }

    dismiss() {
        $('#artistModalBackground').remove();
    }

    show() {
        let self = this;

        // load html and bind views to intance
        $('#artistModalContainer').load('artistmodal.html #artistModalBackground', function () {
            // bind views
            // buttons
            self.closeBtn = $('#artistModalCloseBtn');
            self.saveBtn = $('#artistModalSaveBtn');

            // fields
            self.header = $('#artistModalHeader');
            self.nameField = $('#artistModalNameField');

            switch (self.mode) {
                case ArtistModalController.MODE_EDIT:
                    self.header.text('Edit Artist');
                    self.nameField.val(self.artist.name)
                    break;

                case ArtistModalController.MODE_ADD:
                    self.header.text('Add Artist');
                    break;
            }
            self.setupViews();
        });
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
                case ArtistModalController.EVENT_ARTIST_ADDED:
                    // remove alert modal
                    controllerUtil.alertDialog.remove();
                    break;

                case ArtistModalController.EVENT_ARTIST_UPDATED:
                    // remove alert modal
                    controllerUtil.alertDialog.remove();
                    break;
            }
        });

        this.nameField.keyup(function () {
            self.isValidName = self.validateInput(self.nameField);
            self.updateInputField(self.nameField, self.isValidName);
        });
    }

    handleSave(){
        this.isValidName = this.validateInput(this.nameField);
        this.updateInputField(this.nameField, this.isValidName);

        if (this.isValidName){
            // create artist field
            let artist = {
                'name': this.nameField.val()
            }

            switch (this.mode) {
                case ArtistModalController.MODE_EDIT:
                    this.updateArtist(artist);
                    break;

                case ArtistModalController.MODE_ADD:
                    this.addArtist(artist)
                    break;
            }
        }
    }

    ///////////////  requests /////////////////
    updateArtist(artist){
        let self = this;
        let id = this.artist.id;

        api.updateArtist(id, artist)
            .done(function (data){
                if (self.delegate) {
                    self.delegate.onArtistUpdated(data);
                }
                self.dismiss();
                controllerUtil.alertDialog.show(
                    'Artist Updated',
                    'The artist has been successfully updated',
                    ArtistModalController.EVENT_ARTIST_UPDATED
                );
            })
            .fail(function (response){
                errorHandler.handleFail(response);
            });
    }

    addArtist(artist){
        let self = this;

        api.addArtist(artist)
            .done(function (data){
                if (self.delegate) {
                    self.delegate.onArtistAdded(data);
                }
                self.dismiss();
                controllerUtil.alertDialog.show(
                    'Artist Added',
                    'The artist has been successfully added.',
                    ArtistModalController.EVENT_ARTIST_ADDED
                );
            })
            .fail(function (response){
                errorHandler.handleFail(response);
            });
    }


    ///////////// validation /////////////////////////////
    validateInput(inputField) {
        return document.getElementById(inputField.attr('id')).checkValidity();
    }

    updateInputField(inputField, isValid) {
        if (isValid) {
            inputField.removeClass('invalid');
        } else {
            inputField.addClass('invalid');
        }
    }
}

const artistModal = {
    show(mode, delegate = null, artist = null) {
        this.modal = new ArtistModalController(mode, delegate, artist);
        this.modal.show();
    },
    dissmiss() {
        this.modal.dismiss();
    }
}