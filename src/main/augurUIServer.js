const express = require('express');
const http = require('http');
const path = require('path');

function AugurUIServer() {
    this.app = express();
}

AugurUIServer.prototype.startServer = function () {
    console.log("Starting Augur UI Server");
    const serverBuildPath = path.join(__dirname, '../../node_modules/augur-ui/build');
    this.app.use(express.static(serverBuildPath));
    this.app.listen = function () {
        const server = http.createServer(this)
        return server.listen.apply(server, arguments);
    }
    this.server = this.app.listen(8080);
}

AugurUIServer.prototype.stopServer = function () {
    console.log("Stoping Augur UI Server");
    this.server.close();
}

module.exports = AugurUIServer;