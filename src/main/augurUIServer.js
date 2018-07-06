const express = require('express');
const log = require('electron-log');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require("fs");
const appData = require('app-data-folder');

function AugurUIServer() {
  this.app = express();
  this.window = null;
}

AugurUIServer.prototype.startServer = function () {
  log.info("Starting Augur UI Server");
  try {
    const self = this;
    this.appDataPath = appData("augur");
    const key = path.join(this.appDataPath, 'localhost.key')
    const cert = path.join(this.appDataPath, 'localhost.crt')

    let options = null;
    if (fs.existsSync(key) && fs.existsSync(cert)) {
      log.info("Found localhost certificate and key");
      options = {
        key: fs.readFileSync(key, "utf8"),
        cert: fs.readFileSync(cert, "utf8")
      };
      // inform renderer that ssl is enabled
      self.window.webContents.send("ssl", true);
    }

    const serverBuildPath = path.join(__dirname, '../../node_modules/augur-ui/build');
    this.app.use(express.static(serverBuildPath));
    this.app.listen = function () {
      const server = options === null ? http.createServer(this) : https.createServer(options, this)
      server.on('error', (e) => {
        log.error(e);
        if (e.code === 'EADDRINUSE') {
          self.window.webContents.send("error", {
            error: "Port 8080 is in use. Please free up port and close and restart this app."
          });
        } else {
          self.window.webContents.send("error", {
            error: e.toString()
          });
        }
      });
      return server.listen.apply(server, arguments);
    }
    this.server = this.app.listen(8080);
  } catch (err) {
    log.error(err);
    this.window.webContents.send("error", {
      error: err.toString()
    });
  }
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurUIServer.prototype.setWindow = function (window) {
  this.window = window;
  this.startServer();
}

AugurUIServer.prototype.stopServer = function () {
  log.info("Stopping Augur UI Server");
  this.server.close();
}

module.exports = AugurUIServer;
