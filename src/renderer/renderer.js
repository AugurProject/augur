const {ipcRenderer, remote, shell, ipcMain} = require('electron');
const log = require('electron-log');
const {app} = require('electron').remote


function clearClassList(classList) {
  for(let i = classList.length; i > 0; i--) {
    classList.remove(classList[0]);
  }
  return classList
}

function addCommas(number) {
  if (!number || isNaN(number)) {
    return number
  }
  let sides = []

  sides = number.toString().split('.')
  sides[0] = sides[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return sides.join('.')
}


function Renderer() {
    this.isSynced = false;
    this.isSsl = false;
    this.config = {};
    this.selectedNetworkForm = "";
    this.connectedServer = "";
    this.haveHitBack = false;
    this.spinnerCount = 0;
    this.uiPort = 8080;
    this.spinner = ["&bull;", "&bull;&bull;", "&bull;&bull;&bull;"]

    ipcRenderer.send('requestConfig');
    setInterval(() => {
        ipcRenderer.send('requestLatestSyncedBlock');
    }, 1000)
    document.getElementById("save_configuration").addEventListener("click", this.saveNetworkConfig.bind(this));
    document.getElementById("back_to_network_config_button").addEventListener("click", this.backToNetworkConfig.bind(this));
    document.getElementById("go_to_open_app_screen_button").addEventListener("click", this.connectToServer.bind(this));
    document.getElementById("augur_ui_button").addEventListener("click", this.openAugurUI.bind(this));
    document.getElementById("cancel_switch_button").addEventListener("click", this.goToOpenApp.bind(this));

    document.getElementById("network_config_screen").addEventListener("input", this.checkConnectValidity.bind(this))

    ipcRenderer.on('latestSyncedBlock', this.onLatestSyncedBlock.bind(this));
    ipcRenderer.on('config', this.onReceiveConfig.bind(this));
    ipcRenderer.on('saveNetworkConfigResponse', this.onSaveNetworkConfigResponse.bind(this));
    ipcRenderer.on('consoleLog', this.onConsoleLog.bind(this));
    ipcRenderer.on('error', this.onServerError.bind(this));
    ipcRenderer.on('ssl', this.onSsl.bind(this))
    ipcRenderer.on('onServerConnected', this.onServerConnected.bind(this))
    ipcRenderer.on('resetResponse', this.onResetResponse.bind(this));
    ipcRenderer.on('onServerDisconnected', this.onServerDisconnected.bind(this))

    ipcRenderer.on('reset', this.onResetConfig.bind(this));
    ipcRenderer.on('showNotice', this.onShowNotice.bind(this));
    ipcRenderer.on('toggleSsl', this.onToggleSSL.bind(this));
    ipcRenderer.on('clearDB', this.reset.bind(this));
    ipcRenderer.on('noResetDatabase', this.onNoResetDatabase.bind(this))
    ipcRenderer.on('bulkSyncStarted', this.onBulkSyncStarted.bind(this))
    ipcRenderer.on('bulkSyncFinished', this.onBulkSyncFinished.bind(this))

    window.onerror = this.onWindowError.bind(this);
    document.getElementById("version").innerHTML = app.getVersion()
}

Renderer.prototype.onBulkSyncStarted = function() {
  this.showNotice("Downloading bulk logs ...", "success")
}

Renderer.prototype.onBulkSyncFinished = function() {
  this.showNotice("Finished bulk load", "success")
  setTimeout(() => {
    this.clearNotice()
  }, 2000);
}

Renderer.prototype.onNoResetDatabase = function() {
  this.showNotice("Cannot reset database while connected, restart app then reset database", "failure")
  // clear error after 3 seconds
  setTimeout(() => {
    this.clearNotice()
  }, 3000);
}

Renderer.prototype.reset = function() {
  ipcRenderer.send("reset", {network: this.selectedNetworkForm});
}

Renderer.prototype.onResetResponse = function() {
  this.showNotice("Resetting Database...", "success")
  setTimeout(() => {
    this.clearNotice()
  }, 8000);
}

Renderer.prototype.onResetConfig = function() {
  ipcRenderer.send("resetConfig");
  this.showNotice("Configuration Reset", "success")
  setTimeout(() => {
    this.clearNotice()
  }, 2000);
}

Renderer.prototype.onToggleSSL = function(event, enabled) {
  ipcRenderer.send("toggleSslAndRestart", enabled);
  if (!enabled) {
    this.showNotice("Disabling SSL for Ledger...", "success")
    setTimeout(() => {
      this.clearNotice()
    }, 2000);
  }
}

Renderer.prototype.checkConnectValidity = function(event) {
    const name = document.getElementById("network_name").value;
    const http = document.getElementById("network_http_endpoint").value;
    const ws = document.getElementById("network_ws_endpoint").value;

    if (name.length === 0 || http.length === 0 && ws.length === 0) {
      document.getElementById("go_to_open_app_screen_button").disabled = true;
    } else {
      document.getElementById("go_to_open_app_screen_button").disabled = false;
    }
}

Renderer.prototype.backToNetworkConfig = function (event) {
    document.getElementById("network_config_screen").style.display = "block";
    document.getElementById("open_app_screen").style.display = "none";

    document.getElementById("go_to_open_app_screen_button").value = "Update Connection";
    document.getElementById("cancel_switch_button").style.display = "block";
    document.getElementById("augur_ui_button").disabled = true
}

Renderer.prototype.onServerDisconnected = function (event) {
  const networkStatus = document.getElementById("network_status");
  if (networkStatus) {
    clearClassList(networkStatus.classList);
    networkStatus.classList.add("notConnected")
  }
}

Renderer.prototype.onServerConnected = function (event) {
  const data = this.connectedServer;
  this.renderOpenNetworkPage(data)
  // hide config form and show open network screen
  document.getElementById("network_config_screen").style.display = "none";
  document.getElementById("open_app_screen").style.display = "block";
  document.getElementById("syncing_info").style.display = "block";

  document.getElementById("augur_ui_button").disabled = !this.isSynced;

  const networkStatus = document.getElementById("network_status");
  clearClassList(networkStatus.classList);
  networkStatus.classList.add("connected")
}

Renderer.prototype.connectToServer = function (event) {
  ipcRenderer.send('startUiServer', this.uiPort);
  this.showNotice("Connecting...", "success")
  const data = this.getNetworkConfigFormData();
  this.isSynced = false;
  this.connectedServer = data;

  const blocksRemainingLbl = document.getElementById("blocks_synced");
  const currentBlock = document.getElementById("highest_block");
  blocksRemainingLbl.innerHTML = "-";
  currentBlock.innerHTML = "-";
  blocksRemainingLbl.style.minWidth = 'unset';


  this.isSynced = false;
  this.spinnerCount = 0;
  ipcRenderer.send("start", data);
}

Renderer.prototype.goToOpenApp = function (event) {
  // hide config form and show open network screen
  document.getElementById("network_config_screen").style.display = "none";
  document.getElementById("open_app_screen").style.display = "block";
}

Renderer.prototype.renderOpenNetworkPage = function (data) {
  document.getElementById("current_network").innerHTML = data.networkConfig.name;
  document.getElementById("current_network2").innerHTML = data.networkConfig.name;

  document.getElementById("open_network_name").innerHTML = data.networkConfig.name;
  document.getElementById("open_network_http_endpoint").innerHTML = data.networkConfig.http;
  document.getElementById("open_network_ws_endpoint").innerHTML = data.networkConfig.ws;
}

Renderer.prototype.onSsl = function (event, value) {
  ipcRenderer.send("rebuildMenu", value)
  this.isSsl = value
}

Renderer.prototype.onServerError = function (event, data) {
  this.showNotice("Server Error: " + JSON.stringify(data.error), "failure");
}

Renderer.prototype.onWindowError = function (errorMsg, url, lineNumber) {
    this.showNotice(errorMsg, "failure");
}

Renderer.prototype.openAugurUI = function () {
    const protocol = this.isSsl ? 'https' : 'http'
    const wssProtocol = this.isSsl ? 'wss://localhost:9002' : 'ws://localhost:9001'
    const networkConfig = this.connectedServer.networkConfig;
    const queryString = `augur_node=${encodeURIComponent(wssProtocol)}&ethereum_node_http=${encodeURIComponent(networkConfig.http)}&ethereum_node_ws=${encodeURIComponent(networkConfig.ws)}`;
    shell.openExternal(`${protocol}://localhost:${this.uiPort}/#/categories?${queryString}`);
}

Renderer.prototype.saveNetworkConfig = function (event) {
    event.preventDefault();
    const data = this.getNetworkConfigFormData();
    ipcRenderer.send("saveNetworkConfig", data);
}

Renderer.prototype.onSaveNetworkConfigResponse = function (event, data) {
    this.config.networks[data.network] = data.networkConfig;
    this.renderNetworkOptions();
}

Renderer.prototype.getNetworkConfigFormData = function () {
    const network = document.getElementById("network_id_select").value;
    const networkConfig = {
        "name": document.getElementById("network_name").value,
        "http": document.getElementById("network_http_endpoint").value,
        "ws": document.getElementById("network_ws_endpoint").value
    }
    return { network, networkConfig };
}

Renderer.prototype.switchNetworkConfigForm = function () {
  try {
    this.selectedNetworkForm = document.getElementById("network_id_select").value;
    const networkConfig = this.config.networks[this.selectedNetworkForm];
    this.renderNetworkConfigForm(this.selectedNetworkForm, networkConfig);
    this.clearNotice()
  } catch(err) {
    log.error(err)
  }
}
Renderer.prototype.renderNetworkConfigForm = function (network, networkConfig) {
  try {
    const networkName = this.config.networks[network].name;
    log.info('network name ' + networkName)
    document.getElementById("network_name").value = networkName
    document.getElementById("network_http_endpoint").value = networkConfig.http;
    document.getElementById("network_ws_endpoint").value = networkConfig.ws;
    this.checkConnectValidity();
  } catch (err) {
    log.error(err)
  }
}

Renderer.prototype.onReceiveConfig = function (event, data) {
  try {
    this.config = data;
    this.uiPort = data.uiPort || this.uiPort;
    this.selectedNetworkForm = (this.selectedNetworkForm === "" ? this.config.network : this.selectedNetworkForm);
    if (!this.config.networks[this.selectedNetworkForm]) {
      this.selectedNetworkForm = this.config.network
    }

    this.renderNetworkOptions();
    this.renderNetworkConfigForm(this.selectedNetworkForm, this.config.networks[this.selectedNetworkForm]);
  } catch (err) {
    log.error(err)
  }
}

Renderer.prototype.renderNetworkOptions = function () {
    const networkIdSelect = document.getElementById("network_id_select");
    while (networkIdSelect.firstChild) {
        networkIdSelect.removeChild(networkIdSelect.firstChild);
    }
    Object.keys(this.config.networks).forEach(networkConfigKey => {
        const networkConfig = this.config.networks[networkConfigKey];
        const networkOption = document.createElement("option");
        networkOption.value = networkConfigKey;
        networkOption.innerHTML = networkConfig.name;
        networkOption.selected = this.selectedNetworkForm === networkConfigKey;
        networkIdSelect.appendChild(networkOption);
    });
}

Renderer.prototype.onLatestSyncedBlock = function (event, data) {
    let blocksRemaining = null;
    let blocksRemainingCountLbl = "0";
    let blocksSyncedNum = null;

    const highestBlock = document.getElementById("highest_block");
    const blocksSynced = document.getElementById("blocks_synced");
    const syncPercent = document.getElementById("sync_percent");
    const blocksBehind = document.getElementById("blocks_behind");

    const lastSyncBlockNumber = data.lastSyncBlockNumber;
    const highestBlockNumber = data.highestBlockNumber;
    const uploadBlockNumber = data.uploadBlockNumber;

    if (lastSyncBlockNumber !== null && lastSyncBlockNumber !== 0) {
      if (!this.isSynced) this.clearNotice()
      blocksRemaining = parseInt(highestBlockNumber, 10) - parseInt(lastSyncBlockNumber, 10)
      if (blocksRemaining <= 15) {
        this.isSynced = true;
      }
      blocksRemainingCountLbl = blocksRemaining.toString()
      blocksSyncedNum = highestBlockNumber - blocksRemainingCountLbl
    } else {
      blocksRemainingCountLbl = this.spinner[this.spinnerCount++ % this.spinner.length]
    }

    const pct = lastSyncBlockNumber ? ((lastSyncBlockNumber - uploadBlockNumber) / (highestBlockNumber - uploadBlockNumber) * 100) : 0;
    const pctLbl = Math.floor(pct * Math.pow(10, 2)) / Math.pow(10, 2);

    highestBlock.innerHTML = addCommas(highestBlockNumber) || 0;
    blocksSynced.innerHTML = addCommas(blocksSyncedNum)  || blocksRemainingCountLbl;
    blocksBehind.innerHTML = blocksSyncedNum ? addCommas(highestBlockNumber - blocksSyncedNum)  : '0';
    syncPercent.innerHTML = pctLbl || 0

    blocksSynced.style.minWidth = '22px';

    document.getElementById("syncPercentInfo").style.color = this.isSynced ? '#00F1C4' : '#A7A2B2';
    document.getElementById("augur_ui_button").disabled = !this.isSynced;
}

Renderer.prototype.onConsoleLog = function (event, message) {
    log.info(message);
}

Renderer.prototype.clearNotice = function () {
  this.showNotice("", "success")
}

Renderer.prototype.onShowNotice = function (event, data) {
  this.showNotice(data.message, data.class)
}

Renderer.prototype.showNotice = function (message, className) {
    const notice = document.getElementById("notice");
    clearClassList(notice.classList);
    notice.innerHTML = "";
    document.getElementById("error_notice").style.display = 'none'

    setTimeout(() => {
        if (className === 'failure') {
            document.getElementById("error_notice").style.display = 'block'
        } else {
            document.getElementById("error_notice").style.display = 'none'
        }
        notice.classList.add(className);
        notice.innerHTML = message;
    }, 100);
}

module.exports = Renderer;
