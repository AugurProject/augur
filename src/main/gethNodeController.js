const { ipcMain } = require('electron');
const { spawn } = require('child_process');
const { request } = require('http');

const STATUS_LOOP_INTERVAL = 5000;

const SYNCING_POST_DATA = '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}';

const SYNCING_REQUEST_OPTIONS = {
    port: 8545,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(SYNCING_POST_DATA)
    }
  };

function GethNodeController() {
    this.window = null;
    let os = 'linux';
    if (process.platform === 'win32') os = 'win';
    if (process.platform === 'darwin') os = 'osx';
    this.gethExecutablePath = `resources/${os}/geth`;
    this.gethProcess = null;
    this.statusLoop = null;
    ipcMain.on('toggleGeth', this.toggle.bind(this));
    ipcMain.on('startGeth', this.start.bind(this));
    ipcMain.on('stopGeth', this.stop.bind(this));
}

GethNodeController.prototype.setWindow = function (window) {
    this.window = window;
}

GethNodeController.prototype.start = function () {
    this.gethProcess = spawn(this.gethExecutablePath, [
            '--syncmode=light',
            '--cache=1024',
            '--rpc',
            '--ws',
            '--wsorigins=127.0.0.1,http://127.0.0.1:8080,https://127.0.0.1:8080'
        ], {
            stdio: ['ignore', 'ignore', 'pipe']
        });

    console.log("STARTED GETH");

    this.gethProcess.stderr.on('data', this.log.bind(this));
    this.gethProcess.on('close', this.onGethClose.bind(this));

    this.statusLoop = setInterval(this.checkStatus.bind(this), STATUS_LOOP_INTERVAL);
}

GethNodeController.prototype.log = function (data) {
    console.log(`GETH NODE: ${data}`);
}

GethNodeController.prototype.onGethClose = function (code) {
    console.log(`GETH child process exited with code ${code}`);
}

GethNodeController.prototype.stop = function () {
    console.log(`Stopping geth process`);
    if (this.gethProcess) this.gethProcess.kill('SIGINT');
    if (this.statusLoop) clearInterval(this.statusLoop);
}

GethNodeController.prototype.toggle = function () {
    console.log(`Toggling geth process`);
    if (this.gethProcess && !this.gethProcess.killed) return this.stop();
    this.start();
}

GethNodeController.prototype.checkStatus = function (window) {      
      const req = request(SYNCING_REQUEST_OPTIONS, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            const syncData = JSON.parse(data).result;
            if (syncData === false) return this.window.webContents.send('gethFinishedSyncing');
            this.window.webContents.send('latestSyncedGethBlock', {
                lastSyncBlockNumber: parseInt(syncData.currentBlock, 16),
                highestBlockNumber: parseInt(syncData.highestBlock, 16),
                uploadBlockNumber: parseInt(syncData.startingBlock, 16),
            });
        }.bind(this));
      }.bind(this));
      
      req.on('error', console.error);      
      req.write(SYNCING_POST_DATA);
      req.end();
}

module.exports = GethNodeController
