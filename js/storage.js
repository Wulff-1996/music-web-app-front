'use strict';

const TRACK_KEY = 'tracks';
const CUSTOMER_KEY = 'customer';

const storage = {
    cart: {
        getTracks() {
            let tracks = [];
            if (sessionStorage.getItem(TRACK_KEY)) {
                tracks = JSON.parse(sessionStorage.getItem(TRACK_KEY));
            }
            return tracks;
        },
        addTrack(track) {
            if (!this.exists(track.id)){
                let tracks = [];
                if (sessionStorage.getItem(TRACK_KEY)) {
                    tracks = JSON.parse(sessionStorage.getItem(TRACK_KEY));
                }
                tracks.push(track);
                sessionStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
            }
        },
        removeTrack(id) {
            let tracks = [];
            if (sessionStorage.getItem(TRACK_KEY)) {
                tracks = JSON.parse(sessionStorage.getItem(TRACK_KEY));
            }
            tracks = tracks.filter(track => track.id !== id);
            sessionStorage.setItem(TRACK_KEY, JSON.stringify(tracks));
        },
        exists(id) {
            let tracks = [];
            if (sessionStorage.getItem(TRACK_KEY)) {
                tracks = JSON.parse(sessionStorage.getItem(TRACK_KEY));
            }

            // search tracks
            let track = tracks.find(track => track.id === id);
            if (track) return true;
            else return false;
        },
        clear() {
            // set to empty array
            sessionStorage.setItem(TRACK_KEY, JSON.stringify([]));
        }
    },
    user: {
        get(){
            let user = {};
            if (sessionStorage.getItem(CUSTOMER_KEY)){
                user = JSON.parse(sessionStorage.getItem(CUSTOMER_KEY));
            }
            return user;
        },
        set(customer){
            sessionStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
        },
        remove(){

        }
    },
    clear(){
        // clear all session data
        sessionStorage.clear();
    }
}