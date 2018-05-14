const express = require('express');
const http = require('http');
const path = require('path');

function AugurUIServer() {
    this.app = express();
    this.window = null;
}

AugurUIServer.prototype.startServer = function () {
    console.log("Starting Augur UI Server");
    try {
        const serverBuildPath = path.join(__dirname, '../../node_modules/augur-ui/build');
        this.app.use(express.static(serverBuildPath));
        const self = this;
        this.app.listen = function () {
            const server = http.createServer(this)
            server.on('error', (e) => {
                console.error(e);
                if (e.code === 'EADDRINUSE') {
                    self.window.webContents.send("error", { error: "Port 8080 is in use. Please close and restart this app." });
                }
                else {
                    self.window.webContents.send("error", { error: e.toString() });
                }
            });
            return server.listen.apply(server, arguments);
        }
        this.server = this.app.listen(8080);
    } catch (err) {
        console.error(err);
        this.window.webContents.send("error", { error: err.toString() });
    }
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurUIServer.prototype.setWindow = function (window) {
    this.window = window;
    this.startServer();
}

AugurUIServer.prototype.stopServer = function () {
    console.log("Stoping Augur UI Server");
    this.server.close();
}

module.exports = AugurUIServer;