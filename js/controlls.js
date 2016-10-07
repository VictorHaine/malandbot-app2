$(document).ready(function () {

    // MQTT Vars
    var url = "wss://iot.eclipse.org:443/ws/";
    //var url = "192.168.137.1";
    //var port = 8080;
    var clientID = "malandbot";
    var publishDestination = "MQTTMalandbotEnvia";
    var subscribeDestination = "MQTTMalandbotRecebe";

    // MQTT
    //client = new Paho.MQTT.Client(url, port, clientID);
    client = new Paho.MQTT.Client(url, clientID);
    client.onMessageArrived = function (message) {
        console.log("Message Arrived: " + message.payloadString);
    };
    client.connect({
        onSuccess: function () {
            console.log("Conectado ao MQTT");
//            client.subscribe(subscribeDestination);
        }
    });

    function publishMQTTCommand(command) {
        var m = new Paho.MQTT.Message(command);
        m.destinationName = publishDestination;
        client.send(m);
    }

    $("#btn-forward")
        .mousedown(function () {
            publishMQTTCommand("F");
        })
        .mouseup(function () {
            publishMQTTCommand("P");
        });

    $("#btn-on-off")
        .click(function () {
            publishMQTTCommand("P");
        });

    $("#btn-left")
        .mousedown(function () {
            publishMQTTCommand("E");
        })
        .mouseup(function () {
            publishMQTTCommand("P");
        });

    $("#btn-right")
        .mousedown(function () {
            publishMQTTCommand("D");
        })
        .mouseup(function () {
            publishMQTTCommand("P");
        });

    $("#btn-backward")
        .mousedown(function () {
            publishMQTTCommand("T");
        })
        .mouseup(function () {
            publishMQTTCommand("P");
        });
});
