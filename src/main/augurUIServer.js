const express = require('express');
const log = require('electron-log');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require("fs");
const { ipcMain } = require('electron')
const appData = require('app-data-folder');
const myca = require('myca')

function AugurUIServer() {
  this.app = express();
  this.window = null;
  this.port = 8080;
  this.sslEnabled = false;
  this.appDataPath = appData("augur");
  ipcMain.on('toggleSslAndRestart', this.onToggleSslAndRestart.bind(this))
}

AugurUIServer.prototype.startServer = function () {
  log.info("Starting Augur UI Server");
  try {
    const self = this;
    let options = null;

    if (this.sslEnabled) {
      const key = path.join(this.appDataPath, 'localhost.key')
      const cert = path.join(this.appDataPath, 'localhost.crt')

      log.info("Looking for certificate files in " + this.appDataPath)
      if (fs.existsSync(key) && fs.existsSync(cert)) {
        log.info("Found localhost certificate and key");
        options = {
          key: fs.readFileSync(key, "utf8"),
          cert: fs.readFileSync(cert, "utf8")
        };
        ipcRenderer.send("ssl", this.sslEnabled);
      }
    }

    const serverBuildPath = path.join(__dirname, '../../node_modules/augur-ui/build');
    this.app.use(express.static(serverBuildPath));
    this.app.listen = function () {
      const server = options === null ? http.createServer(this) : https.createServer(options, this)
      server.on('error', (e) => {
        log.error(e);
        if (e.code === 'EADDRINUSE') {
          self.window.webContents.send("error", {
            error: `Port ${this.port} is in use. Please free up port and close and restart this app.`
          });
        } else {
          self.window.webContents.send("error", {
            error: e.toString()
          });
        }
      });
      return server.listen.apply(server, arguments);
    }
    this.server = this.app.listen(this.port);
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

AugurUIServer.prototype.restart = function () {
  this.server.close();
  this.startServer();
}

AugurUIServer.prototype.onToggleSslAndRestart = function (event, enabled) {
  this.sslEnabled = enabled;

  const certPath = path.join(this.appDataPath, 'localhost.crt');
  const keyPath = path.join(this.appDataPath, 'localhost.key');

  if (!this.sslEnabled) {
    return this.restart();
  }

  if (this.sslEnabled && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return this.restart();
  }
  myca.initDefaultCenter().catch(console.error)
  log.info("Generating local signed certificates")
  myca.genCert({
    caKeyPass: 'mycapass',
    kind: 'server',   // server cert
    days: 730,
    pass: 'p$ssw$rd123',   // at least 4 letters
    CN: 'localhost',    // Common Name
    OU: 'crypto',   // Organizational Unit Name
    O: 'self',   // Organization Name
    L: 'local',    // Locality Name (eg, city)
    ST: 'IL',   // State or Province Name
    C: 'CN',   // Country Name (2 letter code)
    emailAddress: '',
  })
  .then((ret) => {
    console.log(ret.cert)
    console.log(ret.crtFile)
    console.log(ret.privateUnsecureKey)

    fs.writeFileSync(certPath, ret.cert)
    fs.writeFileSync(keyPath, ret.privateUnsecureKey)

  }).then(() => {
    return this.restart();
  })
  .catch((err) => {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  });
}

module.exports = AugurUIServer;
