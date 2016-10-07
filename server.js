var fs = require('fs');
var https = require('https');
var PeerServer = require('peer').PeerServer;
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic('./');
var sslConf = {
	key: fs.readFileSync('server/key.pem'),
	cert: fs.readFileSync('server/localhost.pem')
};

var server = https.createServer(sslConf, function(req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
});

server.listen(4443);

var peerServer = PeerServer({
	port: 9000,
	path: '/malandbot',
	ssl: sslConf
});

