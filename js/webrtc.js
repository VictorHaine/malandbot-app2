$(document).ready(function () {

    // Call Elements
    var videoCallButton = $("#videoCallButton");
    var endCallButton = $("#endCallButton");
    var localVideo = $("#localVideo");
    var remoteVideo = $("#remoteVideo");

    var peerHost = $("#peerHost").val();
    var peerPort = $("#peerPort").val();
    var peer = new Peer('controlador', {
        host: peerHost,
        port: peerPort,
        path: '/malandbot'
    });

    videoCallButton.click(function () {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia({
            video: true,
            audio: true
        }, function (stream) {
            var call = peer.call('robo', stream);
            localVideo.attr("src", URL.createObjectURL(stream));
            call.on('stream', function (remoteStream) {
                remoteVideo.attr("src", URL.createObjectURL(remoteStream));
            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    });


})

// $(document).ready(function () {

//     // MQTT Vars
//     var url = "wss://iot.eclipse.org:443/ws/";
//     //var port = 1883;
//     var clientID = "malandbot";
//     var publishDestination = "MQTTMalandbotEnvia";
//     var subscribeDestination = "MQTTMalandbotRecebe";

//     // Call Elements
//     var videoCallButton = $("#videoCallButton");
//     var endCallButton = $("#endCallButton");
//     var localVideo = $("#localVideo");
//     var remoteVideo = $("#remoteVideo");

//     // MQTT
//     client = new Paho.MQTT.Client(url, clientID);
//     client.onMessageArrived = function (message) {
//         console.log("Message Arrived: " + message.payloadString);
//     };
//     client.connect({
//         onSuccess: function () {
//             console.log("Conectado ao MQTT");
//             client.subscribe(subscribeDestination);
//         }
//     });

//     // Call WebSocket
//     var ws = new WebSocket('wss://10.0.0.24:8443');
//     var peerConn = null;
//     peerConnCfg = {
//         'iceServers': [{
//             'url': 'stun:stun.services.mozilla.com'
//         }, {
//             'url': 'stun:stun.l.google.com:19302'
//         }]
//     };
//     ws.onmessage = function (e) {
//         var payload = JSON.parse(e.data);
//         if (!peerConn) {
//             answerCall();
//             return;
//         }
//         if (payload.sdp) {
//             peerConn.setRemoteDescription(new RTCSessionDescription(payload.sdp));
//             return;
//         }
//         if (payload.candidate) {
//             peerConn.addIceCandidate(new RTCIceCandidate(payload.candidate));
//             return;
//         }
//         if (payload.closeConnection) {
//             endCall();
//         }
//     }

//     function prepareCall() {
//         peerConn = new RTCPeerConnection(peerConnCfg);
//         peerConn.onicecandidate = function (e) {
//             if (!e || !e.candidate)
//                 return;

//             ws.send(JSON.stringify({
//                 candidate: e.candidate
//             }));
//         };
//         peerConn.onaddstream = function (e) {
//             remoteVideo.attr("src", URL.createObjectURL(e.stream));
//         }
//     }

//     function initiateCall() {
//         prepareCall();
//         navigator.getUserMedia({
//             audio: true,
//             video: true
//         }, function (stream) {
//             localVideo.attr("src", URL.createObjectURL(stream));
//             peerConn.addStream(stream);
//             createAndSendOffer();
//         }, function (error) {
//             console.log(error);
//         });
//     }

//     function createAndSendOffer() {
//         peerConn.createOffer(function (offer) {
//             var off = new RTCSessionDescription(offer);
//             peerConn.setLocalDescription(new RTCSessionDescription(off), function () {

//             }, function (error) {
//                 console.log(error);
//             });
//         }, function (error) {
//             console.log(error);
//         });
//     }

//     function createAndSendAnswer() {
//         peerConn.createAnswer(function (answer) {
//             var ans = new RTCSessionDescription(answer);
//             peerConn.setLocalDescription(ans, function () {
//                 ws.send(JSON.stringify({
//                     sdp: ans
//                 }));
//             }, function (error) {
//                 console.log(error);
//             });

//         }, function (error) {
//             console.log(error);
//         });
//     }

//     function answerCall() {
//         prepareCall();
//         navigator.getUserMedia({
//             audio: true,
//             video: true
//         }, function (stream) {
//             localVideo.attr("src", URL.createObjectURL(stream));
//             peerConn.addStream(stream);
//         }, function (error) {
//             console.log(error);
//         });
//     }

//     function endCall() {
//         peerConn.close();
//         localVideo.attr("src", null);
//         remoteVideo.attr("src", null);
//     }

//     videoCallButton.click(function () {
//         initiateCall();
//     });

//     endCallButton.click(function () {
//         ws.send(JSON.stringify({
//             closeConnection: true
//         }));
//     });

// });