const { CONNECTION_ERR, GEN_INFO, DATABASE_IN_USE, UNEXPECTED_ERR, RECONNECT_MSG, RUNNING_FAILURE, START_FAILURE, RESTARTING_MSG, INFO_NOTIFICATION, ERROR_NOTIFICATION, RESET_DATABASE, STOP_AUGUR_NODE, START_AUGUR_NODE, BULK_SYNC_STARTED, BULK_SYNC_FINISHED, ON_SERVER_DISCONNECTED, RESET_RESPONSE, ON_SERVER_CONNECTED, LATEST_SYNCED_BLOCK } = require('../utils/constants')
const Augur = require('augur.js')
const log = require('electron-log')
const { AugurNodeController } = require('augur-node/build/controller')
const { ControlMessageType } = require('augur-node/build/constants')
const appData = require('app-data-folder')

const { ipcMain } = require('electron')
const debounce = require('debounce')
const POOL_DELAY_WAIT = 60*1000
const DEFAULT_DELAY_WAIT = 1*1000

const POOL_MAX_RETRIES = 5
const DEFAULT_MAX_RETRIES = 3
const STATUS_LOOP_INTERVAL = 5000
const AUGUR_NODE_RESTART_RETRIES = 1
const AUGUR_NODE_RESTART_WAIT = 5*1000
const MAX_BLOCKS_BEHIND_BEFORE_RESTART = 1000

function AugurNodeServer(selectedNetwork) {
  this.isShuttingDown = false
  this.window = null
  this.statusLoop = null
  this.selectedNetwork = selectedNetwork
  this.augur = new Augur()
  this.augurNodeController = new AugurNodeController(this.augur, this.selectedNetwork, this.appDataPath)
  this.retriesRemaining = AUGUR_NODE_RESTART_RETRIES
  this.bulkSyncing = false
  this.appDataPath = appData('augur')
  ipcMain.on(START_AUGUR_NODE, this.onStartNetwork.bind(this))
  ipcMain.on(RESET_DATABASE, this.onResetDatabase.bind(this))
  ipcMain.on(STOP_AUGUR_NODE, this.shutDownServer.bind(this))
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

    if (this.selectedNetwork.http.indexOf('infura') > -1) {
      propagationDelayWaitMillis = POOL_DELAY_WAIT
      maxRetries = POOL_MAX_RETRIES
    }
    console.log(propagationDelayWaitMillis, maxRetries)
    this.augurNodeController = new AugurNodeController(this.augur, Object.assign({}, this.selectedNetwork, { propagationDelayWaitMillis, maxRetries }), this.appDataPath)
    this.augurNodeController.clearLoggers()
    this.augurNodeController.addLogger(log)

    this.augurNodeController.augur.events.nodes.ethereum.on('disconnect', this.onEthereumDisconnect.bind(this))
    this.augurNodeController.augur.events.nodes.ethereum.on('reconnect', this.onEthereumReconnect.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.ServerError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.WebsocketError, this.onError.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncStarted, this.onBulkSyncStarted.bind(this))
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncFinished, this.onBulkSyncFinished.bind(this))

    this.statusLoop = setInterval(this.requestLatestSyncedBlock.bind(this), STATUS_LOOP_INTERVAL)

    this.augurNodeController.start(function (err) {
      console.log('augur-node start:', err.message)
      if (err && err.message.includes('Could not connect')) {
        this.disconnectServerMessage()
        return this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
          messageType: CONNECTION_ERR,
          message: 'Could not connect to endpoint'
        })
      }
      if (this.isShuttingDown) return
      if (this.retriesRemaining > 0) {
        this.sendMsgToWindowContents(INFO_NOTIFICATION, {
          messageType: RESTARTING_MSG,
          message: err.message || err
        })
        this.retriesRemaining--
        this.restartOnFailure()
      } else {
        this.disconnectServerMessage()
        this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
          messageType: RUNNING_FAILURE,
          message: err.message || err || 'unknown error'
        })
      }
    }.bind(this))
  } catch (err) {
    log.error('start catch error:', err)
    this.disconnectServerMessage()
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: START_FAILURE,
      message: err.message
    })
  }
}

AugurNodeServer.prototype.onEthereumDisconnect = function () {
  if (this.isShuttingDown) return
  if (this.window) this.window.webContents.send(ERROR_NOTIFICATION, {
    messageType: RECONNECT_MSG,
    message: 'Disconnected from Ethereum Node. Attempting to reconnect...'
  })
}

AugurNodeServer.prototype.onEthereumReconnect = function () {
  if (this.isShuttingDown) return
  if (this.window) this.window.webContents.send(INFO_NOTIFICATION, {
    messageType: RECONNECT_MSG,
    message: 'Reconnected to Ethereum Node.'
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
    log.error('restart:', err)
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: START_FAILURE,
      message: err.message
    })
  }
}

AugurNodeServer.prototype.onError = function (err) {
  const errorMessage = (err || {}).message || 'Unexpected Error'
  if (this.window) this.window.webContents.send(ERROR_NOTIFICATION, {
    messageType: UNEXPECTED_ERR,
    message: errorMessage
  })
}

AugurNodeServer.prototype.restartOnFailure = debounce(function () {
  this.restart()
}, AUGUR_NODE_RESTART_WAIT)

AugurNodeServer.prototype.onBulkSyncStarted = function () {
  log.info('Sync with blockchain started.')
  if (this.window) this.window.webContents.send(BULK_SYNC_STARTED)

  setTimeout(() => {
    this.sendMsgToWindowContents(INFO_NOTIFICATION, {
      messageType: GEN_INFO,
      message: 'Downloading logs'
    })
  }, 1500);
  this.bulkSyncing = true
}

AugurNodeServer.prototype.onBulkSyncFinished = function () {
  log.info('Sync with blockchain complete.')
  if (this.window) this.window.webContents.send(BULK_SYNC_FINISHED)

  this.bulkSyncing = false
}

AugurNodeServer.prototype.onResetDatabase = function () {
  try {
    if (this.augurNodeController.isRunning()) {
      return this.sendMsgToWindowContents(INFO_NOTIFICATION, {
        messageType: DATABASE_IN_USE,
        message: 'Cannot reset database while in use'
      })
    } else {
      this.augurNodeController.resetDatabase()
      this.sendMsgToWindowContents(INFO_NOTIFICATION, {
        messageType: GEN_INFO,
        message: 'Database Reset'
      })
    }
  } catch (err) {
    log.error(err)
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: err
    })
  }
}

AugurNodeServer.prototype.onStartNetwork = function (event, data) {
  try {
    console.log('onStartNetwork has been called')
    this.isShuttingDown = false
    this.selectedNetwork = data
    this.retriesRemaining = AUGUR_NODE_RESTART_RETRIES
    this.restart()

    const waiting = setInterval(() => {
      if (this.augurNodeController && this.augurNodeController.isRunning()) {
        event.sender.send(ON_SERVER_CONNECTED, data)
        clearInterval(waiting)
      }
    }, 1000)

  } catch (err) {
    log.error('onStartNetwork', err)
    event.sender.send(ERROR_NOTIFICATION, {
      messageType: START_FAILURE,
      message: err
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
        this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
          messageType: RUNNING_FAILURE,
          message
        })
        this.restart()
      }
    }).catch((err) => {
      log.error(err)
      this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
        messageType: RUNNING_FAILURE,
        message: err.message || err || 'Could not process latest block'
      })
    })
}

AugurNodeServer.prototype.disconnectServerMessage = function () {
  try {
    if (this.statusLoop) clearInterval(this.statusLoop)
    if (this.augurNodeController && !this.augurNodeController.isRunning()) {
      this.sendMsgToWindowContents(ON_SERVER_DISCONNECTED)
    }
  } catch (err) {
    log.error(err)
  }
}

AugurNodeServer.prototype.shutDownServer = function () {
  try {
    console.log('Shutdown Augur Node Server')
    this.isShuttingDown = true
    if (this.statusLoop) clearInterval(this.statusLoop)
    this.bulkSyncing = false
    if (this.augurNodeController == null || !this.augurNodeController.isRunning()) return
    log.info('Calling Augur Node Controller Shutdown')
    this.augurNodeController.shutdown()
    setTimeout(() => this.disconnectServerMessage(), 1000) // give augur node time to shutdown
  } catch (err) {
    log.error(err)
    this.disconnectServerMessage()
    this.sendMsgToWindowContents(ERROR_NOTIFICATION, {
      messageType: UNEXPECTED_ERR,
      message: err
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
