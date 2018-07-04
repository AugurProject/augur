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
    this.selectedNetwork = "";
    ipcRenderer.send('requestConfig');
    setInterval(() => {
        ipcRenderer.send('requestLatestSyncedBlock');
    }, 1000)
    document.getElementById("switch_network_button").addEventListener("click", this.switchNetwork.bind(this));
    document.getElementById("back_to_network_config_button").addEventListener("click", this.backToNetworkConfig.bind(this));
    document.getElementById("go_to_open_app_screen_button").addEventListener("click", this.goToOpenApp.bind(this));
    document.getElementById("augur_ui_button").addEventListener("click", this.openAugurUI.bind(this));

    ipcRenderer.on('latestSyncedBlock', this.onLatestSyncedBlock.bind(this));
    ipcRenderer.on('config', this.onReceiveConfig.bind(this));
    ipcRenderer.on('saveNetworkConfigResponse', this.onSaveNetworkConfigResponse.bind(this));
    ipcRenderer.on('onSwitchNetworkResponse', this.onSwitchNetworkResponse.bind(this));
    ipcRenderer.on('consoleLog', this.onConsoleLog.bind(this));
    ipcRenderer.on('error', this.onServerError.bind(this));
    ipcRenderer.on('ssl', this.onSsl.bind(this))
    window.onerror = this.onWindowError.bind(this);
    document.getElementById("version").innerHTML = app.getVersion()
}

Renderer.prototype.backToNetworkConfig = function (event) {
    document.getElementById("network_config_screen").style.display = "block";
    document.getElementById("open_app_screen").style.display = "none";
}

Renderer.prototype.goToOpenApp = function (event) {
    // find selected network and config options
    const selectedNetwork = document.getElementById("current_network").innerHTML.toLowerCase();
    this.selectedNetwork = selectedNetwork;
    const networkConfig = this.config.networks[selectedNetwork];

    // hide config form and show open network screen
    document.getElementById("network_config_screen").style.display = "none";
    document.getElementById("open_app_screen").style.display = "block";

    // render and fill in details on open network screen
    this.renderOpenNetworkPage(selectedNetwork, networkConfig);
}

Renderer.prototype.renderOpenNetworkPage = function (selectedNetwork, networkConfig) {
    document.getElementById("open_network_name").innerHTML = this.config.networks[selectedNetwork].name;
    document.getElementById("open_network_http_endpoint").innerHTML = networkConfig.http;
    document.getElementById("open_network_ws_endpoint").innerHTML = networkConfig.ws;
}

Renderer.prototype.onSsl = function (value) {
    log.info("SSL is " + value);
    this.isSsl = value
}

Renderer.prototype.onServerError = function (event, data) {
    this.showNotice(data.error, "failure");
    const syncProgress = document.getElementById("sync_progress_label");
    clearClassList(syncProgress.classList);
    syncProgress.classList.add("failure");
    this.showNotice("Failed to startup", "failure");
}

Renderer.prototype.onWindowError = function (errorMsg, url, lineNumber) {
    this.showNotice(errorMsg, "failure");
}

Renderer.prototype.openAugurUI = function () {
    const protocol = this.isSsl ? 'https' : 'http'
    const networkConfig = this.config.networks[this.config.network];
    shell.openExternal(`${protocol}://localhost:8080/#/categories?augur_node=ws://localhost:9001&ethereum_node_http=${networkConfig.http}&ethereum_node_ws=${networkConfig.ws}`);
}

Renderer.prototype.saveNetworkConfig = function (event) {
    event.preventDefault();
    const data = this.getNetworkConfigFormData();
    ipcRenderer.send("saveNetworkConfig", data);
}

Renderer.prototype.onSaveNetworkConfigResponse = function (event, data) {
    this.showNotice("Saved network data", "success");
    this.config.networks[data.network] = data.networkConfig;
    this.renderNetworkOptions();
}

Renderer.prototype.switchNetwork = function (event) {
    event.preventDefault();
    const data = this.getNetworkConfigFormData();
    ipcRenderer.send("switchNetwork", data);
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
    this.showNotice("Switched network to " + this.config.networks[data.network].name, "success");
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
    const selectedNetwork = document.getElementById("network_id_select").value;
    this.selectedNetwork = selectedNetwork;
    const networkConfig = this.config.networks[selectedNetwork];
    this.renderNetworkConfigForm(selectedNetwork, networkConfig);
}

Renderer.prototype.renderNetworkConfigForm = function (selectedNetwork, networkConfig) {
    document.getElementById("network_name").value = this.config.networks[selectedNetwork].name;
    document.getElementById("network_http_endpoint").value = networkConfig.http;
    document.getElementById("network_ws_endpoint").value = networkConfig.ws;
    document.getElementById("switch_network_button").disabled = this.config.network === selectedNetwork;
    document.getElementById("current_network").innerHTML = this.config.networks[this.config.network].name;
}

Renderer.prototype.onReceiveConfig = function (event, data) {
    this.config = data;
    this.selectedNetwork = this.config.network;
    this.renderNetworkOptions();
    this.renderNetworkConfigForm(this.config.network, this.config.networks[this.config.network]);
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
        networkOption.selected = this.selectedNetwork === networkConfigKey;
        networkIdSelect.appendChild(networkOption);
    });
}

Renderer.prototype.onLatestSyncedBlock = function (event, data) {
    let progress = 0;
    let progressMsg = "Downloading Augur Logs" + ".".repeat(this.progressDots);
    if (data.lastSyncBlockNumber !== null && data.lastSyncBlockNumber !== 0) {
        progress = (100 * (data.lastSyncBlockNumber - data.uploadBlockNumber) / (data.highestBlockNumber - data.uploadBlockNumber)).toFixed(0);
        this.isSynced = data.lastSyncBlockNumber >= data.highestBlockNumber - 3;
        if (!this.isSynced && progress === "100") {
            progress = "99";
        }
    } else {
        this.isSynced = false;
        this.progressDots += 1;
        this.progressDots %= 4;
        this.showNotice(progressMsg, "success");
    }
    const syncProgressLbl = document.getElementById("sync_progress_label");
    const syncProgressAmt = document.getElementById("sync_progress_amount");
    const networkStatus = document.getElementById("network_status");
    clearClassList(syncProgressLbl.classList);
    clearClassList(networkStatus.classList);
    networkStatus.classList.add("connected")
    if (this.isSynced) {
        syncProgressLbl.classList.add("success");
    }
    syncProgressAmt.innerHTML = progress;
    document.getElementById("augur_ui_button").disabled = !this.isSynced;
}

Renderer.prototype.onConsoleLog = function (event, message) {
    log.info(message);
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
