const {ipcRenderer, remote} = require('electron');
var opn = require('opn');
const augurjs = remote.require("augur.js");

function Renderer() {
    this.progressDots = 0;
    this.isSynced = false;
    this.config = {};
    this.selectedNetwork = "";
    ipcRenderer.send('requestConfig');
    setInterval(() => {
        ipcRenderer.send('requestLatestSyncedBlock');
    }, 1000)
    document.getElementById("save_network_config_button").addEventListener("click", this.saveNetworkConfig.bind(this));
    document.getElementById("switch_network_button").addEventListener("click", this.switchNetwork.bind(this));
    ipcRenderer.on('latestSyncedBlock', this.onLatestSyncedBlock.bind(this));
    ipcRenderer.on('config', this.onReceiveConfig.bind(this));
    ipcRenderer.on('saveNetworkConfigResponse', this.onSaveNetworkConfigResponse.bind(this));
    ipcRenderer.on('onSwitchNetworkResponse', this.onSwitchNetworkResponse.bind(this));
    ipcRenderer.on('consoleLog', this.onConsoleLog.bind(this));
    ipcRenderer.on('error', this.onServerError.bind(this));
    window.onerror = this.onWindowError.bind(this);
}

Renderer.prototype.onServerError = function (event, data) {
    this.showNotice(data.error, "failure");
    const syncProgress = document.getElementById("sync_progress_amount");
    syncProgress.classList = [];
    syncProgress.classList.add("failure");
    syncProgress.innerHTML = "Failed to startup";
}

Renderer.prototype.onWindowError = function (errorMsg, url, lineNumber) {
    this.showNotice(errorMsg, "failure");
}

Renderer.prototype.openAugurUI = function () {
    opn('http://localhost:8080');
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
    syncProgress.classList = [];
    syncProgress.innerHTML = "LOADING";
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
    document.getElementById("current_network").innerHTML = "("+this.config.networks[this.config.network].name+")";
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
    let progress = "Downloading Augur Logs" + ".".repeat(this.progressDots);
    if (data.lastSyncBlockNumber !== null) {
        progress = (100 * (data.lastSyncBlockNumber - data.uploadBlockNumber) / (data.highestBlockNumber - data.uploadBlockNumber)).toFixed(0) + "%";
        this.isSynced = data.lastSyncBlockNumber === data.highestBlockNumber;
    } else {
        this.isSynced = false;
        this.progressDots += 1;
        this.progressDots %= 4;
    }
    const syncProgress = document.getElementById("sync_progress_amount");
    syncProgress.classList = [];
    if (this.isSynced) {
        syncProgress.classList.add("success");
    }
    syncProgress.innerHTML = progress;
    document.getElementById("augur_ui_button").disabled = !this.isSynced;
}

Renderer.prototype.onConsoleLog = function (event, message) {
    console.log(message);
}

Renderer.prototype.showNotice = function (message, className) {
    console.log(message);
    const notice = document.getElementById("notice");
    notice.classList = [];
    notice.innerHTML = "";
    setTimeout(() => {
        notice.classList.add(className);
        notice.classList.add("notice");
        notice.innerHTML = message;
    }, 100);
}

module.exports = Renderer;