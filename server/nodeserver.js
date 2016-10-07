var fs = require('fs');
var https = require('https');

var privateKey = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('localhost.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpsServer = https.createServer(credentials);
httpsServer.listen(8443);

var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
	    server: httpsServer
    });

/** broadcast message to all clients **/
wss.broadcast = function (data) {
    var i = 0,
        n = this.clients ? this.clients.length : 0,
        client = null;
    for (; i < n; i++) {
        client = this.clients[i];
        if (client.readyState === client.OPEN) {
            client.send(data);
        } else console.error('Error: the client state is ' + client.readyState);
    }
};

/** successful connection */
wss.on('connection', function (ws) {
    /** incomming message */
    ws.on('message', function (message) {
        /** broadcast message to all clients */
        wss.broadcast(message);
    });
});
