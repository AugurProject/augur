const Augur = require('augur.js')
const log = require('electron-log')
const { AugurNodeController } = require('augur-node/build/controller')
const { ControlMessageType } = require('augur-node/build/constants')
const fs = require('fs')
const path = require('path')
const { ipcMain } = require('electron')
const appData = require('app-data-folder')

const REMOTE_DELAY_WAIT = 60*1000;
const LOCAL_DELAY_WAIT = 1*1000;
const defaultConfig = {
  'network': 'mainnet',
  'version': '1.0.0',
  'networks': {
    'rinkeby': {
      'http': 'https://rinkeby.augur.net/ethereum-http',
      'name': 'Rinkeby',
      'ws': 'wss://rinkeby.augur.net/ethereum-ws',
      'id': '4',
    },
    'ropsten': {
      'http': 'https://ropsten.augur.net/ethereum-http',
      'name': 'Ropsten',
      'ws': 'wss://ropsten.augur.net/ethereum-ws',
      'id': '3'
    },
    'kovan': {
      'http': 'https://kovan.augur.net/ethereum-http',
      'name': 'Kovan',
      'ws': 'wss://kovan.augur.net/ethereum-ws',
      'id': '42'
    },
    'local': {
      'http': 'http://localhost:8545',
      'name': 'Local',
      'ws': 'ws://localhost:8546'
    },
    'mainnet': {
      'http': 'https://mainnet.infura.io/augur',
      'name': 'Mainnet',
      'ws': 'wss://mainnet.infura.io/ws',
      'id': '1'
    },
    'custom': {
      'http': 'http://localhost:8545',
      'name': 'Custom',
      'ws': 'ws://localhost:8546'
    }
  }
}

function AugurNodeServer() {
  this.appDataPath = appData('augur')
  if (!fs.existsSync(this.appDataPath)) {
    fs.mkdirSync(this.appDataPath)
  }
  this.configPath = path.join(this.appDataPath, 'config.json')
  if (!fs.existsSync(this.configPath)) {
    this.config = JSON.parse(JSON.stringify(defaultConfig));
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
  } else {
    this.config = JSON.parse(fs.readFileSync(this.configPath))
  }
  this.networkConfig = this.config.networks[this.config.network]
  this.augur = new Augur()
  this.augurNodeController = new AugurNodeController(this.augur, this.networkConfig, this.appDataPath)
  this.window = null
  ipcMain.on('requestLatestSyncedBlock', this.requestLatestSyncedBlock.bind(this))
  ipcMain.on('requestConfig', this.onRequestConfig.bind(this))
  ipcMain.on('saveNetworkConfig', this.onSaveNetworkConfig.bind(this))
  ipcMain.on('start', this.onStartNetwork.bind(this))
  ipcMain.on('onSaveConfiguration', this.onSaveConfiguration.bind(this))
  ipcMain.on('reset', this.onReset.bind(this))
  ipcMain.on('resetConfig', this.onResetConfig.bind(this))
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurNodeServer.prototype.setWindow = function (window) {
  this.window = window
}

AugurNodeServer.prototype.startServer = function () {
  try {
    var propagationDelayWaitMillis = REMOTE_DELAY_WAIT;
    if (this.networkConfig.http.indexOf("localhost") > -1 || this.networkConfig.http.indexOf("127.0.0.1") > -1) {
      propagationDelayWaitMillis = LOCAL_DELAY_WAIT;
    }
    this.augurNodeController = new AugurNodeController(this.augur, Object.assign({}, this.networkConfig, { propagationDelayWaitMillis }), this.appDataPath)
    this.augurNodeController.clearLoggers();
    this.augurNodeController.addLogger(log);

    this.augurNodeController.controlEmitter.on(ControlMessageType.ServerError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.WebsocketError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncFinished, this.onBulkSyncFinished)

    this.augurNodeController.start(function (err) {
      log.error(err)
      this.window.webContents.send('error', {
        error: err.message
      })
    }.bind(this))
  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: message
    })
  }
}

AugurNodeServer.prototype.restart = function () {
  try {
    this.shutDownServer()
    setTimeout(this.startServer.bind(this), 2000)
  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  }
}

AugurNodeServer.prototype.onWarning = function (err) {
  const errorMessage = (err || {}).message || 'Unexpected Error'
  this.window.webContents.send('error', {
    error: errorMessage
  })
}

AugurNodeServer.prototype.onError = function (err) {
  this.onWarning(err)
  this.shutDownServer()
}

AugurNodeServer.prototype.onBulkSyncFinished = function () {
  log.info('Sync with blockchain complete.')
}

AugurNodeServer.prototype.onRequestConfig = function (event, data) {
  event.sender.send('config', this.config)
}

AugurNodeServer.prototype.onSaveNetworkConfig = function (event, data) {
  try {
    const curNetworkConfig = this.config.networks[data.network]
    this.networkConfig = data.networkConfig
    this.config.networks[data.network] = this.networkConfig
    if (data.network === this.config.network) {
      if (curNetworkConfig.http !== data.networkConfig.http ||
        curNetworkConfig.ws !== data.networkConfig.ws) {
        this.restart()
      }
    }
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    event.sender.send('saveNetworkConfigResponse', data)
  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  }
}

AugurNodeServer.prototype.onResetConfig = function (event) {
  try {
    this.config = JSON.parse(JSON.stringify(defaultConfig));
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    event.sender.send('config', this.config)
  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  }
}


AugurNodeServer.prototype.onReset = function (event, data) {
  const parent = this
  const wasRunning = this.augurNodeController.isRunning()
  try {
    // need to pass in id or mainnet will be used
    // only an issue if user hasn't connected
    const network = data.network
    const id = this.config.networks[network].id || defaultConfig.networks[network].id
    log.info("augur-node was running", wasRunning)
    // make sure we are resetting the correct database
    this.augurNodeController.resetDatabase(id, function() {
      if (wasRunning) parent.restart()
    })
  } catch (err) {
    log.error(err)
    if (wasRunning) parent.restart()
  }
  event.sender.send('resetResponse', {})
}

AugurNodeServer.prototype.onStartNetwork = function (event, data) {
  try {
    this.onSaveConfiguration()
    this.config.network = data.network
    this.config.networks[data.network] = data.networkConfig
    this.networkConfig = this.config.networks[this.config.network]
    this.restart()

    const waiting = setInterval(() => {
      if (this.augurNodeController && this.augurNodeController.isRunning()) {
        event.sender.send('onServerConnected', data)
        clearInterval(waiting)
      }
    }, 1000)

  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  }
}

AugurNodeServer.prototype.onSaveConfiguration = function (event, data) {
  try {
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  }
}

AugurNodeServer.prototype.requestLatestSyncedBlock = function (event, data) {
  if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
  this.augurNodeController.requestLatestSyncedBlock()
    .then((syncedBlockInfo) => {
      event.sender.send('latestSyncedBlock', syncedBlockInfo)
    }).catch((err) => {
      log.error(err)
      this.window.webContents.send('error', {
        error: err
      })
    })
}

AugurNodeServer.prototype.shutDownServer = function () {
  try {
    if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
    log.info('Stopping Augur Node Server')
    this.augurNodeController.shutdown()
  } catch (err) {
    log.error(err)
    this.window.webContents.send('error', {
      error: err
    })
  }
}

module.exports = AugurNodeServer
