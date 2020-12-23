'use strict';

// views
const totalPriceField = $('#cartTotalField');
const addressField = $('#addressField');
const cityField = $('#cityField');
const postalCodeField = $('#postalCodeField');
const stateField = $('#stateField');
const countryField = $('#countryField');

// buttons
const placeOrderBtn = $('#placeOrderBtn');

// list
const list = $('#tracksList');

// fields
let tracks = storage.cart.getTracks();
const customer = storage.user.get();

// events
const EVENT_ADMIN_ENTERED = 'EVENT_ADMIN_ENTERED';

$(document).ready(function () {

    controllerUtil.checkForSession();
    controllerUtil.loadHeaderFooter();

    // check if admin
    if (session.isAdmin()) {
        // this page is not allowed for admins, redirect to home
        controllerUtil.alertDialog.show(
            'No Allowed',
            'You need to be logged in as an customer to access this page. You will be redirected to the home page.',
            EVENT_ADMIN_ENTERED
        );
    }

    setupViews();
    populateViews();

});

function populateViews() {
    // populate list
    list.append(adapter.getTrackViews(tracks, LIST_ITEM_MODE_DELETE));

    // populate total
    updateTotal();

    if (customer != null) {
        addressField.val(customer.address);
        cityField.val(customer.city);
        postalCodeField.val(customer.postal_code);
        stateField.val(customer.state);
        countryField.val(customer.country);
    }
}

function enablePlaceOrderBtn(isEnabled) {
    if (isEnabled) {
        placeOrderBtn.prop('disabled', false);
        placeOrderBtn.removeClass('button-disabled');
    } else {
        placeOrderBtn.prop('disabled', true);
        placeOrderBtn.addClass('button-disabled');
    }
}

function getTotal() {
    let total = 0;

    if (tracks.length > 0) {
        tracks.forEach(function (track) {
            total += track.unit_price;
        });
    }
    return total;
}

function updateTotal() {
    let total = Math.round((getTotal() + Number.EPSILON) * 100) / 100;
    totalPriceField.text(total);
}

function setupViews() {
    // disable place order button if no tracks
    enablePlaceOrderBtn(tracks.length > 0);

    // listeners
    // fade in list item delete button
    $(list).on('mouseenter', 'div.listItem', function () {
        let deleteBtn = $(this).find('img.delete');
        deleteBtn.removeClass('gone');
    });

    // fade out list item delete button
    $(list).on('mouseleave', 'div.listItem', function () {
        let deleteBtn = $(this).find('img.delete');
        deleteBtn.addClass('gone');
    });

    // list item delete button click
    $(list).on('click', 'img.img-list-item-button', function () {
        let trackId = $(this).data('id');

        // remove list item
        let listItem = $($(this).closest('div.listItem'));
        listItem.remove();

        handleRemoveTrack(trackId);
    });

    // add button
    placeOrderBtn.on('click', function () {
        handlePlaceOrder();
    });

    // alert modal button
    $(document).on('click', '#alertModalOkBtn', function () {
        // get mode
        let mode = $(this).data('mode');

        // remove from body
        controllerUtil.alertDialog.remove();

        // check mode
        switch (mode) {
            case EVENT_ADMIN_ENTERED:
                // direct to home
                controllerUtil.redirector.toHome();
                break;
        }
    });
}

function handleRemoveTrack(id){
    // remove from storage
    storage.cart.removeTrack(id);

    // update tracks in cart
    tracks = storage.cart.getTracks();

    // update total
    updateTotal();

    // update button
    enablePlaceOrderBtn(tracks.length > 0);
}

function handlePlaceOrder() {

    let trackIds = [];

    tracks.forEach(function (track) {
        trackIds.push({'id': track.id});
    });

    let order = {
        'customer_id': customer.id,
        'address': customer.address,
        'city': customer.city,
        'state': customer.state,
        'country': customer.country,
        'postal_code': customer.postal_code,
        'tracks': trackIds
    };

    // post order
    postOrder(order);
}

// reqeusts
function postOrder(data) {
    api.postOrder(data)
        .done(function (data) {
            // show alert dialog success
            controllerUtil.alertDialog.show(
                'Oder Placed',
                'The order has successfully been completed and the tracks can now be accessed from your library.'
            );

            // clear cart
            storage.cart.clear();
            // update tracks
            tracks = [];
            // update total
            updateTotal();
            // remove tracks from list
            list.empty();
        })
        .fail(function (request) {
            errorHandler.handleFail(request);
        });
}

