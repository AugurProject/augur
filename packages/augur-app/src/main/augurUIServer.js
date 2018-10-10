const { STOP_UI_SERVER, SSL_GEN_ERROR, UNEXPECTED_ERR, START_FAILURE, PORT_IN_USE, ERROR_NOTIFICATION, ON_UI_SERVER_CONNECTED, ON_UI_SERVER_DISCONNECTED, START_UI_SERVER } = require('../utils/constants')
const express = require('express')
const log = require('electron-log')
const https = require('https')
const http = require('http')
const path = require('path')
const fs = require('fs')
const { ipcMain } = require('electron')
const appData = require('app-data-folder')
const KeyGen = require('selfsigned.js')
const helmet = require('helmet')
/* global __dirname */


const isDevelopment = require('electron-is-dev')


function getUIClientBuildPath() {
  if(isDevelopment) {
    return path.join(__dirname, '../../node_modules/augur-ui/build')
  } else {
    return path.join(process.resourcesPath, 'ui-client')
  }

}

function AugurUIServer() {
  this.server = null
  this.portsConfig = {
    uiPort: 8080,
    sslPort: 8443,
    sslEnabled: false
  }
  this.appDataPath = appData('augur')
  ipcMain.on(START_UI_SERVER, this.onStartUiServer.bind(this))
  ipcMain.on(STOP_UI_SERVER, this.onStopUiServer.bind(this))
}

AugurUIServer.prototype.onStartUiServer = function (event, config) {
  if (config) {
    const { uiPort, sslPort, sslEnabled } = config
    this.portsConfig = { uiPort, sslPort, sslEnabled }
    if (this.portsConfig.sslEnabled) {
      this.createSSLCertificates(event)
    }
  }
  this.restart(event)
}

AugurUIServer.prototype.startServer = function (event) {
  log.info('Starting Augur UI Server')
  const port = this.portsConfig.uiPort
  const sslPort = this.portsConfig.sslPort

  try {
    this.app = express()
    this.httpApp = express()
    this.app.use(helmet({
      hsts: false
    }))

    let options = null

    const key = path.join(this.appDataPath, 'localhost.key')
    const cert = path.join(this.appDataPath, 'localhost.crt')

    if (fs.existsSync(key) && fs.existsSync(cert)) {
      log.info('Found localhost certificate and key')
      options = {
        key: fs.readFileSync(key, 'utf8'),
        cert: fs.readFileSync(cert, 'utf8')
      }
    }

    const isSslEnabled = this.portsConfig && this.portsConfig.sslEnabled
    if (isSslEnabled) {
      const self = this
      this.httpApp.set('port', port)
      this.httpApp.get('*', function (req, res) {
        res.redirect('https://' + req.hostname + ':' + sslPort + '/' + req.path)
      })
      this.httpListener = http.createServer(this.httpApp).listen(this.httpApp.get('port'), function() {
        console.log('Express HTTP server listening on port ' + self.httpApp.get('port'))
      })
    } else {
      if (this.httpListener) this.httpListener.close()
    }
    const serverBuildPath = getUIClientBuildPath()
    this.app.use(express.static(serverBuildPath))

    this.app.listen = function () {
      const server = isSslEnabled ? https.createServer(options, this) : http.createServer(this)
      server.on('error', (e) => {
        event.sender.send(ON_UI_SERVER_DISCONNECTED)
        log.error(e)
        if (e.code === 'EADDRINUSE') {
          event.sender.send(ERROR_NOTIFICATION, {
            messageType: PORT_IN_USE,
            message: `Port ${isSslEnabled ? sslPort : port} is in use. Please free up port and close and restart this app.`
          })
        } else {
          event.sender.send(ERROR_NOTIFICATION, {
            messageType: START_FAILURE,
            message: e.message || e.toString()
          })
        }
      })
      return server.listen.apply(server, arguments)
    }
    this.server = this.app.listen(isSslEnabled ? sslPort : port)
    event.sender.send(ON_UI_SERVER_CONNECTED)
  } catch (err) {
    log.error(err)
    event.sender.send(ON_UI_SERVER_DISCONNECTED)
    event.sender.send(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: err.message || err.toString()
    })
  }
}

AugurUIServer.prototype.onStopUiServer = function () {
  log.info('Stopping Augur UI Server')
  this.server && this.server.close()
}

AugurUIServer.prototype.restart = function (event) {
  if (this.server !== null) {
    this.server.close(() => {
      if (this.httpListener) this.httpListener.close()
      this.startServer(event)
    })
  } else {
    this.startServer(event)
  }
}

AugurUIServer.prototype.createSSLCertificates = function (event) {
  const certPath = path.join(this.appDataPath, 'localhost.crt')
  const keyPath = path.join(this.appDataPath, 'localhost.key')

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) return

  const kg = new KeyGen()
  log.info('start generating self signed certifiate files')
  kg.getPrime(1024, (err, p) => {
    if (err) {
      log.error(err)
      event.sender.send(ERROR_NOTIFICATION, {
        messageType: SSL_GEN_ERROR,
        message: err.message || err
      })
      return
    }
    log.info('finalize key and cert files')
    kg.getPrime(1024, (err, q) => {
      if (err) {
        log.error(err)
        event.sender.send(ERROR_NOTIFICATION, {
          messageType: SSL_GEN_ERROR,
          message: err.message || err
        })
        return
      }

      const keyData = kg.getKeyData(p, q)
      const key = kg.getPrivate(keyData, 'pem')
      fs.writeFileSync(keyPath, key)

      const certData = kg.getCertData({
        commonName: '127.0.0.1',
        keyData
      })

      const cert = kg.getCert(certData, 'pem')
      fs.writeFileSync(certPath, cert)

      log.info('self signed certificate files generated')
      return this.restart(event)
    })
  })
}

module.exports = AugurUIServer
