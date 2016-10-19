$(document).ready(function () {

    var config = {
        client: null,
        clientID: 'malandbot',
        publishDestination: 'MQTTMalandbotEnvia',
        subscribeDestination: 'MQTTMalandbotRecebe',
        brokerHost: $('#brokerHost')
    };

    config.brokerHost.change(function () {
        connectBroker();
    });
    connectBroker();


    function connectBroker() {
        config.client = new Paho.MQTT.Client(config.brokerHost.val(), config.clientID);
        config.client.connect({
            onSuccess: function () {
                console.log('Conectado ao MQTT');
            },
            onFailure: function (e) {
                console.log('Erro ao conectar ao broker - ', e);
            }
        });
    }

    function publishMQTTCommand(command) {
        try {
            if (config.client) {
                var m = new Paho.MQTT.Message(command);
                m.destinationName = config.publishDestination;
                config.client.send(m);
            } else {
                console.log('MQTT não conectado');
            }
        } catch (error) {
            console.log('Erro ao publicar o command - ', error);
        }
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