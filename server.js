// Require das depêndencias do programa
var fs = require('fs');
var https = require('https');
var PeerServer = require('peer').PeerServer;
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

// Configurando local de onde os arquivos estáticos serão servidos
var serve = serveStatic('./');

// Configurando caminhos dos arquivos de certificado
var sslConf = {
	key: fs.readFileSync('server/key.pem'),
	cert: fs.readFileSync('server/localhost.pem')
};

// Criando servidor HTTPS
var server = https.createServer(sslConf, function(req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
});

// Definindo porta do Servidor HTTPS
server.listen(4443);

// Configurando PeerServer
var peerServer = PeerServer({
	port: 9000,
	path: '/malandbot',
	ssl: sslConf
});

