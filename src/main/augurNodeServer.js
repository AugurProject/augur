const { REQUEST_CONFIG, REQUEST_LATEST_SYNCED_BLOCK, RESET, STOP, START, SAVE_NETWORK_CONFIG, ERROR, SHOW_NOTICE, BULK_SYNC_STARTED, BULK_SYNC_FINISHED, SAVE_NETWORK_CONFIG_RESPONSE, ON_SERVER_DISCONNECTED, CONFIG, NO_RESET_DATABASE,RESET_RESPONSE, ON_SERVER_CONNECTED, LATEST_SYNCED_BLOCK } = require('../utils/constants')
const Augur = require('augur.js')
const log = require('electron-log')
const { AugurNodeController } = require('augur-node/build/controller')
const { ControlMessageType } = require('augur-node/build/constants')
const fs = require('fs')
const path = require('path')
const { ipcMain } = require('electron')
const appData = require('app-data-folder')
const debounce = require('debounce')
const POOL_DELAY_WAIT = 60*1000
const DEFAULT_DELAY_WAIT = 1*1000

const POOL_MAX_RETRIES = 5
const DEFAULT_MAX_RETRIES = 3

const AUGUR_NODE_RESTART_RETRIES = 1
const AUGUR_NODE_RESTART_WAIT = 5*1000
const MAX_BLOCKS_BEHIND_BEFORE_RESTART = 1000

const defaultConfig = {
  'network': 'mainnet',
  'version': '1.0.1',
  'uiPort': '8080',
  'sslPort': '8443',
  'networks': {
    'mainnet': {
      'userCreated': false,
      'http': 'https://gethnode.com/http',
      'name': 'Mainnet (default)',
      'ws': 'wss://gethnode.com/ws',
      'id': '1'
    },
    'rinkeby': {
      'userCreated': false,
      'http': 'https://rinkeby.augur.net/ethereum-http',
      'name': 'Rinkeby',
      'ws': 'wss://rinkeby.augur.net/ethereum-ws',
      'id': '4',
    },
    'ropsten': {
      'userCreated': false,
      'http': 'https://ropsten.augur.net/ethereum-http',
      'name': 'Ropsten',
      'ws': 'wss://ropsten.augur.net/ethereum-ws',
      'id': '3'
    },
    'kovan': {
      'userCreated': false,
      'http': 'https://kovan.augur.net/ethereum-http',
      'name': 'Kovan',
      'ws': 'wss://kovan.augur.net/ethereum-ws',
      'id': '42'
    },
    'local': {
      'userCreated': false,
      'http': 'http://127.0.0.1:8545',
      'name': 'Local',
      'ws': 'ws://127.0.0.1:8546'
    },
    'lightclient': {
      'userCreated': false,
      'http': 'http://127.0.0.1:8545',
      'name': 'Local (Light Node)',
      'ws': 'ws://127.0.0.1:8546'
    }
  }
}

function AugurNodeServer() {
  this.window = null
  this.appDataPath = appData('augur')
  if (!fs.existsSync(this.appDataPath)) {
    fs.mkdirSync(this.appDataPath)
  }
  this.configPath = path.join(this.appDataPath, 'config.json')
  if (!fs.existsSync(this.configPath)) {
    this.config = JSON.parse(JSON.stringify(defaultConfig))
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
  } else {
    this.config = JSON.parse(fs.readFileSync(this.configPath))
    if (this.config.version === '1.0.0') {
      this.config.networks.lightclient = defaultConfig.networks.lightclient
      this.config.version = '1.0.1'
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    }
  }
  this.networkConfig = this.config.networks[this.config.network]
  this.augur = new Augur()
  this.augurNodeController = new AugurNodeController(this.augur, this.networkConfig, this.appDataPath)
  this.retriesRemaining = AUGUR_NODE_RESTART_RETRIES
  this.bulkSyncing = false
  ipcMain.on(REQUEST_LATEST_SYNCED_BLOCK, this.requestLatestSyncedBlock.bind(this))
  ipcMain.on(REQUEST_CONFIG, this.onRequestConfig.bind(this))
  ipcMain.on(SAVE_NETWORK_CONFIG, this.onSaveNetworkConfig.bind(this))
  ipcMain.on(START, this.onStartNetwork.bind(this))
  ipcMain.on(RESET, this.onReset.bind(this))
  ipcMain.on(REQUEST_CONFIG, this.onResetConfig.bind(this))
  ipcMain.on(STOP, this.shutDownServer.bind(this))
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurNodeServer.prototype.setWindow = function (window) {
  this.window = window
  window.once('closed', () => {
    this.window = null
  })
}

AugurNodeServer.prototype.startServer = function () {
  try {
    log.info('Starting Server')
    var propagationDelayWaitMillis = DEFAULT_DELAY_WAIT
    var maxRetries = DEFAULT_MAX_RETRIES
    this.bulkSyncing = false
    log.info('here looking at networkConfig')
    if (this.networkConfig.http.indexOf('infura') > -1) {
      propagationDelayWaitMillis = POOL_DELAY_WAIT
      maxRetries = POOL_MAX_RETRIES
    }
    console.log(propagationDelayWaitMillis, maxRetries)
    this.augurNodeController = new AugurNodeController(this.augur, Object.assign({}, this.networkConfig, { propagationDelayWaitMillis, maxRetries }), this.appDataPath)
    this.augurNodeController.clearLoggers()
    this.augurNodeController.addLogger(log)

    this.augurNodeController.augur.events.nodes.ethereum.on('disconnect', this.onEthereumDisconnect.bind(this))
    this.augurNodeController.augur.events.nodes.ethereum.on('reconnect', this.onEthereumReconnect.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.ServerError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.WebsocketError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncStarted, this.onBulkSyncStarted.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncFinished, this.onBulkSyncFinished.bind(this))

    this.sendMsgToWindowContents(ON_SERVER_CONNECTED)
    this.augurNodeController.start(function (err) {
      if (this.retriesRemaining > 0) {
        this.sendMsgToWindowContents(ERROR, {
          error: `ERROR: ${err.message}. RESTARTING.`
        })
        this.retriesRemaining--
        this.restartOnFailure()
      } else {
        this.sendMsgToWindowContents(ERROR, {
          error: `ERROR: ${err.message}.`
        })
      }
    }.bind(this))
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR, {
      error: err.message
    })
  }
}

AugurNodeServer.prototype.onEthereumDisconnect = function () {
  if (this.window) this.window.webContents.send(ERROR, {
    error: 'Disconnected from Ethereum Node. Attempting to reconnect...'
  })
}

AugurNodeServer.prototype.onEthereumReconnect = function () {
  if (this.window) this.window.webContents.send(SHOW_NOTICE, {
    message: 'Reconnected',
    class: 'success'
  })
}

AugurNodeServer.prototype.restart = function () {
  try {
    log.info('Restarting Server')
    this.shutDownServer()
    setTimeout(() => {
      this.startServer()
    }, 2000)
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR, {
      error: err
    })
  }
}

AugurNodeServer.prototype.onError = function (err) {
  const errorMessage = (err || {}).message || 'Unexpected Error'
  if (this.window) this.window.webContents.send(ERROR, {
    error: errorMessage
  })
}

AugurNodeServer.prototype.restartOnFailure = debounce(function () {
  this.restart()
}, AUGUR_NODE_RESTART_WAIT)

AugurNodeServer.prototype.onBulkSyncStarted = function () {
  log.info('Sync with blockchain started.')
  if (this.window) this.window.webContents.send(BULK_SYNC_STARTED)
  this.bulkSyncing = true
}

AugurNodeServer.prototype.onBulkSyncFinished = function () {
  log.info('Sync with blockchain complete.')
  if (this.window) this.window.webContents.send(BULK_SYNC_FINISHED)
  this.bulkSyncing = false
}

AugurNodeServer.prototype.onRequestConfig = function (event) {
  event.sender.send(CONFIG, this.config)
}

AugurNodeServer.prototype.onSaveNetworkConfig = function (event, data) {
  try {
    this.networkConfig = data.networkConfig
    this.config.networks[data.network] = this.networkConfig

    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    event.sender.send(SAVE_NETWORK_CONFIG_RESPONSE, data)
  } catch (err) {
    log.error(err)
    event.sender.send(ERROR, {
      error: err
    })
  }
}

AugurNodeServer.prototype.onResetConfig = function () {
  try {
    this.config = JSON.parse(JSON.stringify(defaultConfig))
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    this.sendMsgToWindowContents(CONFIG, this.config)
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR, {
      error: err
    })
  }
}

AugurNodeServer.prototype.onReset = function (event, data) {
  try {
    if (this.augurNodeController.isRunning()) {
      return this.sendMsgToWindowContents(NO_RESET_DATABASE)
    } else {
      const network = data.network
      const id = this.config.networks[network].id || defaultConfig.networks[network].id
      this.augurNodeController.resetDatabase(id)
    }
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR, {
      error: err
    })
  }
  this.sendMsgToWindowContents(RESET_RESPONSE, {})
}

AugurNodeServer.prototype.onStartNetwork = function (event, data) {
  try {
    this.onSaveConfiguration()
    this.config.network = data.network
    this.config.networks[data.network] = data.networkConfig
    this.networkConfig = this.config.networks[this.config.network]
    this.retriesRemaining = AUGUR_NODE_RESTART_RETRIES
    this.restart()

    const waiting = setInterval(() => {
      if (this.augurNodeController && this.augurNodeController.isRunning()) {
        event.sender.send(ON_SERVER_CONNECTED, data)
        clearInterval(waiting)
      }
    }, 1000)

  } catch (err) {
    log.error(err)
    event.sender.send(ERROR, {
      error: err
    })
  }
}

AugurNodeServer.prototype.onSaveConfiguration = function () {
  try {
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR, {
      error: err
    })
  }
}

AugurNodeServer.prototype.requestLatestSyncedBlock = function () {
  if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
  this.augurNodeController.requestLatestSyncedBlock()
    .then((syncedBlockInfo) => {
      this.sendMsgToWindowContents(LATEST_SYNCED_BLOCK, syncedBlockInfo)
      const blocksBehind = syncedBlockInfo.highestBlockNumber - syncedBlockInfo.lastSyncBlockNumber
      if (!this.bulkSyncing && (blocksBehind > MAX_BLOCKS_BEHIND_BEFORE_RESTART)) {
        const message = `Behind by ${blocksBehind}. Restarting to bulk sync.`
        log.info(message)
        this.sendMsgToWindowContents(ERROR, {
          error: message
        })
        this.restart()
      }
    }).catch((err) => {
      log.error(err)
      this.sendMsgToWindowContents(ERROR, {
        error: err
      })
    })
}

AugurNodeServer.prototype.disconnectServerMessage = function () {
  try {
    this.sendMsgToWindowContents(ON_SERVER_DISCONNECTED, {})
  } catch (err) {
    log.error(err)
  }
}

AugurNodeServer.prototype.shutDownServer = function () {
  try {
    this.bulkSyncing = false
    if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
    log.info('Calling Augur Node Controller Shutdown')
    this.augurNodeController.shutdown()
    this.disconnectServerMessage()
  } catch (err) {
    log.error(err)
    if (this.augurNodeController && !this.augurNodeController.isRunning()) {
      this.disconnectServerMessage()
    }
    this.sendMsgToWindowContents(ERROR, {
      error: err
    })
  }
}

AugurNodeServer.prototype.sendMsgToWindowContents = function(msg, payload) {
  try {
    if(this.window) this.window.webContents.send(msg, payload)
  } catch (err) {
    log.error(err)
  }
}

module.exports = AugurNodeServer
