const {ipcRenderer, remote, shell} = require('electron');
const log = require('electron-log');
const {app} = require('electron').remote


function clearClassList(classList) {
  for(let i = classList.length; i > 0; i--) {
    classList.remove(classList[0]);
  }
  return classList
}

function Renderer() {
    this.progressDots = 0;
    this.isSynced = false;
    this.isSsl = false;
    this.config = {};
    this.selectedNetworkForm = "";
    this.connectedServer = "";
    this.haveHitBack = false;

    ipcRenderer.send('requestConfig');
    setInterval(() => {
        ipcRenderer.send('requestLatestSyncedBlock');
    }, 1000)
    document.getElementById("save_configuration").addEventListener("click", this.saveNetworkConfig.bind(this));
    document.getElementById("back_to_network_config_button").addEventListener("click", this.backToNetworkConfig.bind(this));
    document.getElementById("go_to_open_app_screen_button").addEventListener("click", this.connectToServer.bind(this));
    document.getElementById("augur_ui_button").addEventListener("click", this.openAugurUI.bind(this));
    document.getElementById("cancel_switch_button").addEventListener("click", this.goToOpenApp.bind(this));
    document.getElementById("generateCert").addEventListener("click", this.toggleSSL.bind(this));

    document.getElementById("network_config_screen").addEventListener("input", this.checkConnectValidity.bind(this))

    ipcRenderer.on('latestSyncedBlock', this.onLatestSyncedBlock.bind(this));
    ipcRenderer.on('config', this.onReceiveConfig.bind(this));
    ipcRenderer.on('saveNetworkConfigResponse', this.onSaveNetworkConfigResponse.bind(this));
    ipcRenderer.on('onSwitchNetworkResponse', this.onSwitchNetworkResponse.bind(this));
    ipcRenderer.on('consoleLog', this.onConsoleLog.bind(this));
    ipcRenderer.on('error', this.onServerError.bind(this));
    ipcRenderer.on('ssl', this.onSsl.bind(this))
    ipcRenderer.on('onServerConnected', this.onServerConnected.bind(this))
    window.onerror = this.onWindowError.bind(this);
    document.getElementById("version").innerHTML = app.getVersion()
}

Renderer.prototype.toggleSSL = function() {
  document.getElementById("generateCert").value = this.isSsl ? "removing support ..." : "adding support ...";
  ipcRenderer.send("toggleSslAndRestart", !this.isSsl);
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

Renderer.prototype.onServerConnected = function (event) {
  this.clearNotice()
  const data = this.connectedServer;
  this.renderOpenNetworkPage(data)
  // hide config form and show open network screen
  document.getElementById("network_config_screen").style.display = "none";
  document.getElementById("open_app_screen").style.display = "block";
  document.getElementById("augur_ui_button").disabled = !this.isSynced;
}

Renderer.prototype.connectToServer = function (event) {
  this.showNotice("Connecting...", "success")
  const data = this.getNetworkConfigFormData();
  this.connectedServer = data;
  ipcRenderer.send("start", data);
}

Renderer.prototype.goToOpenApp = function (event) {
  // hide config form and show open network screen
  document.getElementById("network_config_screen").style.display = "none";
  document.getElementById("open_app_screen").style.display = "block";
}

Renderer.prototype.renderOpenNetworkPage = function (data) {
  document.getElementById("current_network").innerHTML = data.networkConfig.name;
  document.getElementById("open_network_name").innerHTML = data.networkConfig.name;
  document.getElementById("open_network_http_endpoint").innerHTML = data.networkConfig.http;
  document.getElementById("open_network_ws_endpoint").innerHTML = data.networkConfig.ws;
}

Renderer.prototype.onSsl = function (event, value) {
    log.info("SSL is enabled: " + value);
    this.isSsl = value
    document.getElementById("generateCert").value = this.isSsl ? "disable ssl for ledger" : "enable ssl for ledger";
}

Renderer.prototype.onServerError = function (event, data) {
  this.showNotice("Failed to startup: " + data.error, "failure");
  const syncProgress = document.getElementById("sync_progress_label");
  clearClassList(syncProgress.classList);
  syncProgress.classList.add("failure");
}

Renderer.prototype.onWindowError = function (errorMsg, url, lineNumber) {
    this.showNotice(errorMsg, "failure");
}

Renderer.prototype.openAugurUI = function () {
    const protocol = this.isSsl ? 'https' : 'http'
    const networkConfig = this.connectedServer.networkConfig;
    const queryString = `augur_node=${encodeURIComponent("ws://localhost:9001")}&ethereum_node_http=${encodeURIComponent(networkConfig.http)}&ethereum_node_ws=${encodeURIComponent(networkConfig.ws)}`;
    shell.openExternal(`${protocol}://localhost:8080/#/categories?${queryString}`);
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

Renderer.prototype.onSwitchNetworkResponse = function (event, data) {
    this.config.network = data.network;
    const syncProgress = document.getElementById("sync_progress_amount");
    const networkStatus = document.getElementById("network_status");
    clearClassList(syncProgress.classList);
    clearClassList(networkStatus.classList);
    syncProgress.innerHTML = "0";
    networkStatus.classList.add("notConnected");
    this.renderNetworkConfigForm(data.network, this.config.networks[data.network]);
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
    this.selectedNetworkForm = this.config.network;
    this.renderNetworkOptions();
    this.renderNetworkConfigForm(this.config.network, this.config.networks[this.config.network]);
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
    let progress = 0;
    if (data.lastSyncBlockNumber !== null && data.lastSyncBlockNumber !== 0) {
        progress = (100 * (data.lastSyncBlockNumber - data.uploadBlockNumber) / (data.highestBlockNumber - data.uploadBlockNumber)).toFixed(0);
        this.isSynced = data.lastSyncBlockNumber >= data.highestBlockNumber - 3;
        if (!this.isSynced && parseInt(progress, 10) >= 99) {
          this.isSynced = true;
        }
    } else {
        this.isSynced = false;
        this.progressDots += 1;
        this.progressDots %= 4;
    }
    const syncProgressLbl = document.getElementById("sync_progress_label");
    const syncProgressAmt = document.getElementById("sync_progress_amount");
    const networkStatus = document.getElementById("network_status");
    clearClassList(syncProgressLbl.classList);
    clearClassList(networkStatus.classList);
    networkStatus.classList.add("connected")
    if (this.isSynced) {
        syncProgressLbl.classList.add("success");
        this.clearNotice();
    }
    syncProgressAmt.innerHTML = progress;

    document.getElementById("augur_ui_button").disabled = !this.isSynced;
}

Renderer.prototype.onConsoleLog = function (event, message) {
    log.info(message);
}

Renderer.prototype.clearNotice = function () {
  this.showNotice("", "success")
}


Renderer.prototype.showNotice = function (message, className) {
    log.info(message);
    const notice = document.getElementById("notice");
    clearClassList(notice.classList);
    notice.innerHTML = "";
    setTimeout(() => {
        if (className === 'failure') {
            document.getElementById("error_notice").style.display = 'block'
        } else {
            document.getElementById("error_notice").style.display = 'none'
        }
        notice.classList.add(className);
        notice.classList.add("notice");
        notice.innerHTML = message;
    }, 100);
}

module.exports = Renderer;
