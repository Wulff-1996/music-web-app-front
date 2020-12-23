
const errorHandler = {
    handleFail(response){
        let message = '';
        switch (response.status){
            case 401:
                // unauthorized
                message = 'Error: ' + response.responseJSON.message +
                    '. You will be redirected to the login page.';
                controllerUtil.alertDialog.show(
                    'Unauthorized',
                    message,
                    ALERT_EVENT_UNAUTHORIZED
                );
                break;

            case 400:
                // bad request
                message = 'Error: ' + response.responseJSON.message +
                    '. The request was invalid, try again.';
                controllerUtil.alertDialog.show(
                    'Bad Request',
                    message,
                    ALERT_EVENT_BAD_REQUEST
                )
                break;

            case 404:
                // not found
                message = 'Error: ' + response.responseJSON.message +
                    '. The requested page and/or resource was not found. You will be redirected to the home page.';
                controllerUtil.alertDialog.show(
                    'Not Found',
                    message,
                    ALERT_EVENT_NOT_FOUND
                )
                break;

            case 409:
                // conflict
                message = 'Error: ' + response.responseJSON.message +
                    '. The resource cannot be created/updated/deleted because of relation constraints.';
                controllerUtil.alertDialog.show(
                    'Conflict',
                    message,
                    ALERT_EVENT_CONFLICT
                )
                break;
        }
    }
}

// listen for alert events
$(document).ready(function () {

    // alert modal button
    $(document).on('click', 'button.alert-button', function (event) {
        let target = $(event.target);
        let alertEvent = $(this).data('mode');
        let isOkAction = (target.attr('id') === 'alertModalOkBtn') ? true : false;

        // remove alert modal if it was triggered by this error handler
        if (alertEvent === ALERT_EVENT_UNAUTHORIZED ||
            alertEvent === ALERT_EVENT_BAD_REQUEST ||
            alertEvent === ALERT_EVENT_NOT_FOUND ||
            alertEvent === ALERT_EVENT_CONFLICT ||
            alertEvent === ALERT_EVENT_INVALID_PATH_ID) {
            controllerUtil.alertDialog.remove();
        }

        switch (alertEvent) {
            case ALERT_EVENT_UNAUTHORIZED:
                controllerUtil.logout();
                break;

            case ALERT_EVENT_BAD_REQUEST:
                break;

            case ALERT_EVENT_NOT_FOUND:
                // redirect to home page
                controllerUtil.redirector.toHome();
                break;

            case ALERT_EVENT_CONFLICT:
                break;

            case ALERT_EVENT_INVALID_PATH_ID:
                // redirect to home
                controllerUtil.redirector.toHome();
                break;
        }
    });
});