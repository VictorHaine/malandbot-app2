$(document).ready(function () {

    var peerClient = null;
    connectVideo();


    function getStore() {
        return {
            localVideo: $('#localVideo'),
            remoteVideo: $('#remoteVideo'),
            peerHost: $('#peerHost').val() ? $('#peerHost').val() : window.location.hostname,
            peerPort: $('#peerPort').val() ? $('#peerPort').val() : 9000,
            peerPath: '/malandbot',
        };
    }

    function connectVideo() {
        var store = getStore();

        if (!peerClient) {
            peerClient = new Peer('robo', {
                host: store.peerHost,
                port: store.peerPort,
                path: store.peerPath
            });
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        peerClient.on('call', function (call) {
            navigator.getUserMedia({
                //video: { facingMode: "user" },
                video: true,
                audio: true
            }, function (stream) {
                call.answer(stream); // Answer the call with an A/V stream.
                store.localVideo.attr("src", URL.createObjectURL(stream));

                call.on('stream', function (remoteStream) {
                    store.remoteVideo.attr("src", URL.createObjectURL(remoteStream));
                });

            }, function (err) {
                console.log('Failed to get local stream', err);
            });
        });
    }


});