'use strict';

const button = $('#toBasketBtn');

let showingModal = false;
let testModal = null;

$(document).ready(function (){

    button.on('click', function (){

        let track = {
            id: 1,
            title: "For Those About To Rock (We Salute You)",
            album: {
                id: 1,
                title: "For Those About To Rock We Salute You"
            },
            artist: {
                id: 1,
                name: "AC/DC"
            },
            bytes: 11170334,
            composer: "Angus Young, Malcolm Young, Brian Johnson",
            genre: {
                id: 1,
                name: "Rock"
            },
            media: {
                id: 1,
                name: "MPEG audio file"
            },
            milliseconds: 343719,
            unit_price: 0.99
        }

        let delegate = {
            onTrackUpdated(data){
                console.log('track updaetd notified');
                console.log(data);
            },
            onTrackAdded(data){
                console.log('track added')
                console.log(data);
            }
        }
        let bob = new Track();
        trackModal.show(TrackModalController.MODE_ADD, delegate);
    });
});




