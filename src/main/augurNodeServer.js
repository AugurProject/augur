const Augur = require("augur.js");
const { AugurNodeController } = require("augur-node/build/controller");
const { ControlMessageType } = require("augur-node/build/constants");
const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');
const appData = require('app-data-folder');

const defaultConfig = {
    "network":"rinkeby",
    "networks": {
        "rinkeby": {
            "http":"https://rinkeby.ethereum.nodes.augur.net",
            "name":"Rinkeby",
            "ws":"wss://websocket-rinkeby.ethereum.nodes.augur.net"
        },
        "ropsten": {
            "http":"https://ropsten.augur.net/ethereum-http",
            "name":"Ropsten",
            "ws":"wss://ropsten.augur.net/ethereum-ws"
        },
        "kovan": {
            "http":"https://kovan.augur.net/ethereum-http",
            "name":"Kovan",
            "ws":"wss://kovan.augur.net/ethereum-ws"
        },
        "local": {
            "http":"http://localhost:8545",
            "name":"Local",
            "ws":"ws://localhost:8546"
        },
        "mainnet": {
            "http":"",
            "name":"Mainnet",
            "ws":""
        },
        "custom": {
            "http":"http://localhost:8545",
            "name":"Custom",
            "ws":"ws://localhost:8546"
        }
    }
}

function AugurNodeServer() {
    this.appDataPath = appData("augur");
    if (!fs.existsSync(this.appDataPath)){
        fs.mkdirSync(this.appDataPath);
    }
    this.configPath = path.join(this.appDataPath, 'config.json')
    if (!fs.existsSync(this.configPath)) {
        this.config = defaultConfig;
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4));
    }
    else {
        this.config = JSON.parse(fs.readFileSync(this.configPath));
    }
    this.networkConfig = this.config.networks[this.config.network];
    this.augur = new Augur();
    this.augurNodeController = null;
    this.window = null;
    ipcMain.on('requestLatestSyncedBlock', this.requestLatestSyncedBlock.bind(this));
    ipcMain.on('requestConfig', this.onRequestConfig.bind(this));
    ipcMain.on('saveNetworkConfig', this.onSaveNetworkConfig.bind(this));
    ipcMain.on('switchNetwork', this.onSwitchNetwork.bind(this));
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurNodeServer.prototype.setWindow = function (window) {
    this.window = window;
    this.startServer();
};

AugurNodeServer.prototype.startServer = function () {
    this.augurNodeController = new AugurNodeController(this.augur, this.networkConfig, this.appDataPath);
    this.augurNodeController.controlEmitter.on(ControlMessageType.ServerError, this.onError.bind(this));
    this.augurNodeController.controlEmitter.on(ControlMessageType.WebsocketError, this.onError.bind(this));
    this.augurNodeController.controlEmitter.on(ControlMessageType.BulkSyncFinished, this.onBulkSyncFinished);

    this.augurNodeController.start().catch(this.onError.bind(this));
};

AugurNodeServer.prototype.restart = function () {
    this.shutDownServer();
    setTimeout(this.startServer.bind(this), 2000);
};

AugurNodeServer.prototype.onWarning = function(err) {
    const errorMessage = (err || {}).message || "Unexpected Error";
    this.window.webContents.send("error", { error: errorMessage });
};

AugurNodeServer.prototype.onError = function(err) {
    this.onWarning(err);
    this.shutDownServer();
};

AugurNodeServer.prototype.onBulkSyncFinished = function () {
    console.log("Sync with blockchain complete.");
};

AugurNodeServer.prototype.onRequestConfig = function (event, data) {
    event.sender.send('config', this.config);
};

AugurNodeServer.prototype.onSaveNetworkConfig = function (event, data) {
    const curNetworkConfig = this.config.networks[data.network];
    this.networkConfig = data.networkConfig;
    this.config.networks[data.network] = this.networkConfig;
    if (data.network === this.config.network) {
        if (curNetworkConfig.http !== data.networkConfig.http ||
            curNetworkConfig.ws !== data.networkConfig.ws) {
                this.restart();
            }
    }
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4));
    event.sender.send('saveNetworkConfigResponse', data);
};

AugurNodeServer.prototype.onSwitchNetwork = function (event, data) {
    this.config.network = data.network;
    this.config.networks[data.network] = data.networkConfig;
    this.networkConfig = this.config.networks[this.config.network];
    this.restart();
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4));
    event.sender.send('onSwitchNetworkResponse', data);
};

AugurNodeServer.prototype.requestLatestSyncedBlock = function (event, data) {
    if (this.augurNodeController == null) return;
    this.augurNodeController.requestLatestSyncedBlock().then( (syncedBlockInfo) => {
        event.sender.send('latestSyncedBlock', syncedBlockInfo);
    }).catch(console.log);
};

AugurNodeServer.prototype.shutDownServer = function () {
    if (this.augurNodeController == null) return;
    console.log("Stopping Augur Node Server");
    this.augurNodeController.shutdown();
    this.augurNodeController = undefined;
};

module.exports = AugurNodeServer;
