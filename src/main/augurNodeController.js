const Augur = require("augur.js");
const Knex = require("knex");
const sqlite3 = require("sqlite3");
const { postProcessDatabaseResults } = require("augur-node/build/server/post-process-database-results");
const { checkAugurDbSetup } = require("augur-node/build/setup/check-augur-db-setup");
const { syncAugurNodeWithBlockchain } = require("augur-node/build/blockchain/sync-augur-node-with-blockchain");
const { runServer } = require("augur-node/build/server/run-server");
const fs = require('fs');
const path = require('path');
const { ipcMain } = require('electron');
const appData = require('app-data-folder');

const { uploadBlockNumbers } = require("augur-node/config");

const defaultConfig = {
    "network":"rinkeby",
    "networks": {
        "rinkeby": {
            "http":"http://rinkeby.ethereum.nodes.augur.net",
            "name":"Rinkeby",
            "ws":"wss://websocket-rinkeby.ethereum.nodes.augur.net"
        },
        "local": {
            "http":"http://localhost:8545",
            "name":"Local",
            "ws":"ws://localhost:8546"
        },
        "custom": {
            "http":"http://localhost:8545",
            "name":"Custom",
            "ws":"ws://localhost:8546"
        }
    }
}

function AugurNodeController() {
    let appDataPath = appData("augur");
    if (!fs.existsSync(appDataPath)){
        fs.mkdirSync(appDataPath);
    }
    this.configPath = path.join(appDataPath, 'config.json')
    this.augurDbPath = path.join(appDataPath, 'augur.db')
    if (!fs.existsSync(this.configPath)) {
        this.config = defaultConfig;
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4));
    }
    else {
        this.config = JSON.parse(fs.readFileSync(this.configPath));
    }
    this.networkConfig = this.config.networks[this.config.network];
    this.app = null;
    this.servers = [];
    this.httpServers = [];
    this.augur = new Augur();
    this.running = false;
    this.window = null;
    ipcMain.on('requestLatestSyncedBlock', this.requestLatestSyncedBlock.bind(this));
    ipcMain.on('requestConfig', this.onRequestConfig.bind(this));
    ipcMain.on('saveNetworkConfig', this.onSaveNetworkConfig.bind(this));
    ipcMain.on('switchNetwork', this.onSwitchNetwork.bind(this));
}

// We wait until the window is provided so that if it fails we can send an error message to the renderer
AugurNodeController.prototype.setWindow = function (window) {
    this.window = window;
    this.initializeDatabaseAndStartServer();
}

AugurNodeController.prototype.initializeDatabaseAndStartServer = function () {
    // Eventually it would be nice to keep these around
    try {
        if (fs.existsSync(this.augurDbPath)) {
            fs.unlinkSync(this.augurDbPath);
        }
        this.db = Knex({
            client: "sqlite3",
            connection: {
                filename: this.augurDbPath,
            },
            acquireConnectionTimeout: 5 * 60 * 1000,
            useNullAsDefault: true,
            postProcessResponse: postProcessDatabaseResults,
        });
        this.db.migrate.latest({directory: path.join(__dirname, '../../node_modules/augur-node/build/migrations')}).then(function() {
            try {
                this.startServer();
                this.startSyncProcess();
                this.running = true;
            } catch (err) {
                console.error(err);
                this.window.webContents.send("error", { error: err.toString() });
            }
        }.bind(this));
    } catch (err) {
        console.error(err);
        this.window.webContents.send("error", { error: err.toString() });
    }
}

AugurNodeController.prototype.restart = function () {
    this.shutDownServer();
    setTimeout(this.initializeDatabaseAndStartServer.bind(this), 2000);
}

AugurNodeController.prototype.onRequestConfig = function (event, data) {
    event.sender.send('config', this.config);
}

AugurNodeController.prototype.onSaveNetworkConfig = function (event, data) {
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
}

AugurNodeController.prototype.onSwitchNetwork = function (event, data) {
    this.config.network = data.network;
    this.config.networks[data.network] = data.networkConfig;
    this.networkConfig = this.config.networks[this.config.network];
    this.restart();
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 4));
    event.sender.send('onSwitchNetworkResponse', data);
}

AugurNodeController.prototype.requestLatestSyncedBlock = function (event, data) {
    if (!this.running) return;
    this.db("blocks").max("blockNumber as highestBlockNumber").first().asCallback((err, row) => {
        if (err) {
            console.error(err);
            return;
        }
        const lastSyncBlockNumber = row.highestBlockNumber;
        const uploadBlockNumber = this.augur.contracts.uploadBlockNumbers[this.augur.rpc.getNetworkID()] || 0;
        const currentBlock = this.augur.rpc.getCurrentBlock();
        if (currentBlock === null) {
            return;
        }
        const highestBlockNumber = parseInt(this.augur.rpc.getCurrentBlock().number, 16);
        event.sender.send('latestSyncedBlock', { lastSyncBlockNumber , uploadBlockNumber, highestBlockNumber });
    });
}

AugurNodeController.prototype.startServer = function () {
    console.log("Starting Augur Node Server");
    const { app, servers } = runServer(this.db, this.augur);
    this.app = app;
    this.servers = servers.servers;
    this.httpServers = servers.httpServers;
    this.servers.forEach(function (websocket, index) {
        // If we close unexpectedly shut down and tell the renderer
        websocket.on('close', function () {
            if (this.running) {
                this.shutDownServer();
                this.window.webContents.send("error", { error: "WS connection closed unexpectedly" });
            }
        }.bind(this));
    }.bind(this));
}

AugurNodeController.prototype.startSyncProcess = function () {
    console.log("Starting Sync Process");
    checkAugurDbSetup(this.db, err => {
        if (err) {
            console.error("checkAugurDbSetup:", err);
            this.shutDownServer();
            this.window.webContents.send("error", { error: err.toString() });
            return;
        }
        try {
            syncAugurNodeWithBlockchain(this.db, this.augur, this.networkConfig, uploadBlockNumbers, err => {
                if (err) {
                    console.error("syncAugurNodeWithBlockchain:", err);
                    this.shutDownServer();
                    this.window.webContents.send("error", { error: err.toString() });
                    return;
                }
                console.log("Sync with blockchain complete.");
            });
        } catch (err) {
            console.error(err);
            this.window.webContents.send("error", { error: err.toString() });
        }
    });
}

AugurNodeController.prototype.shutDownServer = function () {
    console.log("Stopping Augur Node Server");
    this.running = false;
    this.httpServers.forEach(function (server, index) {
        server.close(() => this.servers[index].close());
    }.bind(this));
    this.db.destroy();
}

module.exports = AugurNodeController;