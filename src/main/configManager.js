const { REQUEST_NETWORK_CONFIG, REQUEST_PORTS_CONFIG, REQUEST_NETWORK_CONFIG_RESPONSE, REQUEST_PORTS_CONFIG_RESPONSE, SAVE_NETWORK_CONFIG, SAVE_PORTS_CONFIG_RESPONSE, ERROR, SAVE_NETWORK_CONFIG_RESPONSE, SAVE_PORTS_CONFIG } = require('../utils/constants')
const fs = require('fs')
const path = require('path')
const { ipcMain } = require('electron')
const appData = require('app-data-folder')
const log = require('electron-log')

const defaultConfig = {
  'uiPort': '8080',
  'sslPort': '8443',
  'sslEnabled': false,
  'networks': [
    {
      'userCreated': false,
      'selected': true,
      'http': 'https://gethnode.com/http',
      'name': 'Mainnet (default)',
      'ws': 'wss://gethnode.com/ws',
      'id': '1'
    },
    {
      'userCreated': false,
      'http': 'https://rinkeby.augur.net/ethereum-http',
      'name': 'Rinkeby',
      'ws': 'wss://rinkeby.augur.net/ethereum-ws',
      'id': '4',
    },
    {
      'userCreated': false,
      'http': 'https://ropsten.augur.net/ethereum-http',
      'name': 'Ropsten',
      'ws': 'wss://ropsten.augur.net/ethereum-ws',
      'id': '3'
    },
    {
      'userCreated': false,
      'http': 'https://kovan.augur.net/ethereum-http',
      'name': 'Kovan',
      'ws': 'wss://kovan.augur.net/ethereum-ws',
      'id': '42'
    },
    {
      'userCreated': false,
      'http': 'http://127.0.0.1:8545',
      'name': 'Local',
      'ws': 'ws://127.0.0.1:8546'
    },
    {
      'userCreated': false,
      'http': 'http://127.0.0.1:8545',
      'name': 'Local (Light Node)',
      'ws': 'ws://127.0.0.1:8546'
    }
  ]
}

function ConfigManager() {
  this.appDataPath = appData('augur')
  if (!fs.existsSync(this.appDataPath)) {
    fs.mkdirSync(this.appDataPath)
  }
  this.configPath = path.join(this.appDataPath, 'app.config')
  if (!fs.existsSync(this.configPath)) {
    this.config = JSON.parse(JSON.stringify(defaultConfig))
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
  } else {
    this.config = JSON.parse(fs.readFileSync(this.configPath))
  }

  ipcMain.on(REQUEST_NETWORK_CONFIG, this.onRequestNetworksConfig.bind(this))
  ipcMain.on(REQUEST_PORTS_CONFIG, this.onRequestPortsConfig.bind(this))
  ipcMain.on(SAVE_NETWORK_CONFIG, this.onSaveNetworkConfig.bind(this))
  ipcMain.on(SAVE_PORTS_CONFIG, this.onSavePortsConfig.bind(this))
}

ConfigManager.prototype.getPortConfig = function () {
  const ports = {
    'uiPort': this.config.uiPort,
    'sslPort': this.config.sslPort,
    'sslEnabled': this.config.sslEnabled
  }
  console.log('ports', ports)
  return ports
}

ConfigManager.prototype.getSelectedNetwork = function () {
  return this.config.networks.find(n => n.selected)
}

ConfigManager.prototype.isSslEnabled = function () {
  return this.config.sslEnabled
}

ConfigManager.prototype.onRequestNetworksConfig = function (event) {
  event.sender.send(REQUEST_NETWORK_CONFIG_RESPONSE, this.config.networks)
}

ConfigManager.prototype.onRequestPortsConfig = function (event) {
  console.log('config ports', {
    'uiPort': this.config.uiPort,
    'sslPort': this.config.sslPort,
    'sslEnabled': this.config.sslEnabled
  })
  event.sender.send(REQUEST_PORTS_CONFIG_RESPONSE, {
    'uiPort': this.config.uiPort,
    'sslPort': this.config.sslPort,
    'sslEnabled': this.config.sslEnabled
  })
}

ConfigManager.prototype.onSavePortsConfig = function (event, ports) {
  try {
    this.config = Object.assign(this.config, ports)
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    event.sender.send(SAVE_PORTS_CONFIG_RESPONSE, this.getPortConfig())
  } catch (err) {
    log.error(err)
    event.sender.send(ERROR, {
      error: err
    })
  }
}

ConfigManager.prototype.onSaveNetworkConfig = function (event, connections) {
  try {
    this.config.networks = connections
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    event.sender.send(SAVE_NETWORK_CONFIG_RESPONSE, connections)
  } catch (err) {
    log.error(err)
    event.sender.send(ERROR, {
      error: err
    })
  }
}


module.exports = ConfigManager
