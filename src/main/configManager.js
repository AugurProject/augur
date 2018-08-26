const { REQUEST_CONFIG, SAVE_CONFIG, REQUEST_CONFIG_RESPONSE, SAVE_CONFIG_RESPONSE, ERROR } = require('../utils/constants')
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

  ipcMain.on(REQUEST_CONFIG, this.onRequestConfig.bind(this))
  ipcMain.on(SAVE_CONFIG, this.onSaveConfig.bind(this))
}

ConfigManager.prototype.getSelectedNetwork = function () {
  let selected = this.config.networks.find(n => n.selected)
  if (!selected) selected = this.config.networks.find(n => n.name.toLowerCase().indexOf('mainnet') > -1)
  return selected
}

ConfigManager.prototype.isSslEnabled = function () {
  return this.config.sslEnabled
}

ConfigManager.prototype.onRequestConfig = function (event) {
  event.sender.send(REQUEST_CONFIG_RESPONSE, this.config)
}

ConfigManager.prototype.onSaveConfig = function (event, config) {
  try {
    this.config = config
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4))
    event.sender.send(SAVE_CONFIG_RESPONSE, this.config)
  } catch (err) {
    log.error(err)
    event.sender.send(ERROR, {
      error: err
    })
  }
}


module.exports = ConfigManager
