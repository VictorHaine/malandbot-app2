$(document).ready(function () {

    var store = {
        videoCallButton: $("#videoCallButton"),
        endCallButton: $("#endCallButton"),
        localVideo: $("#localVideo"),
        remoteVideo: $("#remoteVideo"),
        peerHost: $("#peerHost"),
        peerPort: $("#peerPort"),
        peerPath: '/malandbot',
        peerClient: null
    };

    store.videoCallButton.click(function () {
        connectVideo();
    });
    store.peerHost.change(function () {
        resetVideo();
    });
    store.peerPort.change(function () {
        resetVideo();
    });

    resetVideo();

    function resetVideo() {
        store.peerClient = null;
        store.localVideo.attr("src", null);
        store.remoteVideo.attr("src", null);

        connectVideo();
    }

    function connectVideo() {
        if (!store.peerClient) {
            store.peerClient = new Peer('controlador', {
                host: store.peerHost.val(),
                port: store.peerPort.val(),
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