const express = require('express');
const log = require('electron-log');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require("fs");
const { ipcMain } = require('electron')
const appData = require('app-data-folder');
const KeyGen = require('selfsigned.js');

function AugurUIServer() {
  this.app = express();
  this.port = 8080;
  this.window = null;
  this.appDataPath = appData("augur");
  ipcMain.on('toggleSslAndRestart', this.onToggleSslAndRestart.bind(this))
  ipcMain.on('startUiServer', this.onStartUiServer.bind(this))
}

AugurUIServer.prototype.onStartUiServer = function (event, usePort) {
  this.port = usePort || this.port;
  this.startServer()
}

AugurUIServer.prototype.startServer = function () {
  log.info("Starting Augur UI Server");
  const port = this.port;
  try {
    const self = this;
    let options = null;

    const key = path.join(this.appDataPath, 'localhost.key')
    const cert = path.join(this.appDataPath, 'localhost.crt')

    log.info("Looking for certificate files in " + this.appDataPath)
    if (fs.existsSync(key) && fs.existsSync(cert)) {
      log.info("Found localhost certificate and key");
      options = {
        key: fs.readFileSync(key, "utf8"),
        cert: fs.readFileSync(cert, "utf8")
      };
    }

    self.window.webContents.send("ssl", options !== null);

    const serverBuildPath = path.join(__dirname, '../../node_modules/augur-ui/build');
    this.app.use(express.static(serverBuildPath));
    this.app.listen = function () {
      const server = options === null ? http.createServer(this) : https.createServer(options, this)
      server.on('error', (e) => {
        log.error(e);
        if (e.code === 'EADDRINUSE') {
          self.window.webContents.send("error", {
            error: `Port ${port} is in use. Please free up port and close and restart this app.`
          });
        } else {
          self.window.webContents.send("error", {
            error: e.toString()
          });
        }
      });
      return server.listen.apply(server, arguments);
    }
    this.server = this.app.listen(port);
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
}

AugurUIServer.prototype.stopServer = function () {
  log.info("Stopping Augur UI Server");
  this.server && this.server.close();
}

AugurUIServer.prototype.restart = function (dontClear) {
  // clear any message that occured to start server
  if (!dontClear) { // because of disable ssl button
    this.window.webContents.send("showNotice", {
      message: "",
      class: "success"
    });
  }

  this.server && this.server.close();
  this.startServer();
}

AugurUIServer.prototype.onToggleSslAndRestart = function (event, enabled) {

  const certPath = path.join(this.appDataPath, 'localhost.crt');
  const keyPath = path.join(this.appDataPath, 'localhost.key');

  if (!enabled) {
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      fs.unlinkSync(certPath);
      fs.unlinkSync(keyPath);
    }
    this.restart(true);

    return;
  }

  const kg = new KeyGen();
  log.info("start generating self signed certifiate files");
  kg.getPrime(1024, (err, p) => {
    if (err) {
      log.error(err)
      this.window.webContents.send('error', { error: err })
      return;
    }
    log.info("finalize key and cert files");
    kg.getPrime(1024, (err, q) => {
      if (err) {
        log.error(err)
        this.window.webContents.send('error', { error: err })
        return;
      }

      const keyData = kg.getKeyData(p, q);
      const key = kg.getPrivate(keyData, 'pem');
      fs.writeFileSync(keyPath, key)

      const certData = kg.getCertData({
        commonName: 'localhost',
        keyData
      });

      const cert = kg.getCert(certData, 'pem');
      fs.writeFileSync(certPath, cert)

      log.info("self signed certificate files generated")
      return this.restart();
    });
  });

  this.window.webContents.send("showNotice", {
    message: "Enabling SSL for Ledger...",
    class: "success"
  });

}

module.exports = AugurUIServer;
