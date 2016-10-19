$(document).ready(function () {

    var peerClient = null;
    resetVideo();

    function getStore() {
        var ret = {
            videoCallButton: $("#videoCallButton"),
            endCallButton: $("#endCallButton"),
            localVideo: $('#localVideo'),
            remoteVideo: $('#remoteVideo'),
            peerHost: $('#peerHost').val() ? $('#peerHost').val() : window.location.hostname,
            peerPort: $('#peerPort').val() ? $('#peerPort').val() : 9000,
            peerPath: '/malandbot',
            peerClient: peerClient
        };

        console.log('Get Store: ', ret);
        return ret;
    }

    function resetVideo() {
        var store = getStore();
        store.peerClient = null;
        store.localVideo.attr("src", null);
        store.remoteVideo.attr("src", null);

        connectVideo();
    }

    function connectVideo() {
        var store = getStore();

        if (!store.peerClient) {
            store.peerClient = new Peer('controlador', {
                host: store.peerHost,
                port: store.peerPort,
                path: store.peerPath
            });
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia({
            video: true,
            audio: true
        }, function (stream) {
            var call = store.peerClient.call('robo', stream);
            store.localVideo.attr("src", URL.createObjectURL(stream));
            call.on('stream', function (remoteStream) {
                store.remoteVideo.attr("src", URL.createObjectURL(remoteStream));
            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    }

});