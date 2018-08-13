const { ipcMain } = require('electron')
const { spawn } = require('child_process')
const { request } = require('http')
const fs = require('fs')
const path = require('path')
const appData = require('app-data-folder')
/* global Buffer process*/

const STATUS_LOOP_INTERVAL = 5000

const SYNCING_POST_DATA = '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}'
const PEER_COUNT_POST_DATA = '{"jsonrpc":"2.0","method":"net_peerCount","params":[],"id":1}'

const PEER_NODES = [
  'enode://19b5013d24243a659bda7f1df13933bb05820ab6c3ebf6b5e0854848b97e1f7e308f703466e72486c5bc7fe8ed402eb62f6303418e05d330a5df80738ac974f6@163.172.138.100:30303?discport=30301',
  'enode://03f178d5d4511937933b50b7af683b467abaef8cfc5f7c2c9b271f61e228578ae192aaafc7f0d8035dfa994e734c2c2f72c229e383706be2f4fa43efbe9f94f4@163.172.149.200:30303',
  'enode://31b5db1136a0ebceeb0ab6879e95dc66e8c52bcce9c8de50e2f722b5868f782aa0306b6b137b9e0c6271a419c5562a194d7f2abd78e22dcd1f55700dfc30c46a@35.165.17.127:30303',
  'enode://3afdfd40713a8b188a94e4c7a9ddc61bc6ef176c3abbb13d1dd35eb367725b95329a7570039044dbffa49c50d4aa65f0a1f99ee68e46b8e2f09100d11d4fc85a@31.16.0.92:30303',
  'enode://8fcd039bb514ccac1f207d9b23efbea79a1ba9ed559768109b9b3fc9f7f89cfc3a6cd3e11ec1d92a93bdbfe2322e43f3bb3d9519530e8b503c92294116c38c32@108.232.148.241:30303',
  'enode://95176fe178be55d40aae49a5c11f21aa58968e13c681a6b1f571b2bb3e45927a7fb3888361bef85c0e28a52ea0e4afa17dcaa9d6c61baf504b3559f056f78581@163.172.145.241:30303',
  'enode://a18cc2a6ad4b00cae57b77ef26276eaceffb2593a196df105ce06caa25300636369767430fa21f82b12ed431bca1f61742b8ec7e4db1a58f1b6421d280752b96@148.251.67.86:30303',
  'enode://bfad505cbb2bde72e161a7cff044d66d20ceb85c8a61047b50037881f289bd2dcc064189ade2077daddd5b20fd2fc6dee7208f227ae2a34361bf51751d225e8e@51.15.220.91:30303',
  'enode://e70d9a9175a2cd27b55821c29967fdbfdfaa400328679e98ed61060bc7acba2e1ddd175332ee4a651292743ffd26c9a9de8c4fce931f8d7271b8afd7d221e851@104.197.99.24:30303',
  'enode://e908af3f69a120bbb08e22a7b6e1810ec36b4bf71028d6e8640f08e8b34851ac8e19c5dc6ae6b9f49d541677a41ba97375017be6ba02f8a61f38e3c2e460171c@89.247.76.110:35698',
  'enode://ea1737bf696928b4b686a2ccf61a6f2295d149281a80b0d83a9bce242e7bb084434c0837a2002d4cc2840663571ecf3e45517545499c466e4373c69951d090fe@163.172.181.92:30303',
  'enode://5f0b5cf15a2d470bbadca2a4c4656d1c1918e2079241427b64ebc9fe55f47932466a89fd01c66b9568c5307c01cf21f479681624161fc7565ff075326633f2c3@75.24.193.161:30303',
  'enode://d17489a8fbdb16587fce5cea0383a3b2e87c53d01eddbd4b2a8ba1b4af353c1bdd9551f8894acfa0d770aaa7eca9e334e15a304a356b4ec214a274f60f2435d6@107.188.141.56:30303'
]

const SYNCING_REQUEST_OPTIONS = {
  port: 8545,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(SYNCING_POST_DATA)
  }
}

const PEER_COUNT_REQUEST_OPTIONS = {
  port: 8545,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(PEER_COUNT_POST_DATA)
  }
}

function GethNodeController() {
  this.window = null
  let os = 'linux'
  if (process.platform === 'win32') os = 'win'
  if (process.platform === 'darwin') os = 'mac'
  this.gethExecutablePath = `resources/${os}/geth`
  this.gethProcess = null
  this.statusLoop = null
  ipcMain.on('toggleGeth', this.toggle.bind(this))
  ipcMain.on('startGeth', this.start.bind(this))
  ipcMain.on('stopGeth', this.stop.bind(this))
}

GethNodeController.prototype.setWindow = function (window) {
  this.window = window
  window.once('closed', () => {
    this.window = null
  })
}

GethNodeController.prototype.start = function (event) {
  const appDataPath = appData('augur')
  const gethPath = path.join(appDataPath, 'geth')
  if (!fs.existsSync(gethPath)) {
    fs.mkdirSync(gethPath)
  }

  const gethGetPath = path.join(appDataPath, 'geth', 'geth')
  if (!fs.existsSync(gethGetPath)) {
    fs.mkdirSync(gethGetPath)
  }
  const staticNodesPath = path.join(gethGetPath, 'static-nodes.json')
  if (!fs.existsSync(staticNodesPath)) {
    fs.writeFileSync(staticNodesPath, JSON.stringify(PEER_NODES, null, 4))
  }

  this.gethProcess = spawn(this.gethExecutablePath, [
    '--syncmode=light',
    '--cache=512',
    '--rpc',
    '--ws',
    '--wsorigins=127.0.0.1,http://127.0.0.1:8080,https://127.0.0.1:8080',
    `--datadir=${gethPath}`
  ], {
    stdio: ['ignore', 'ignore', 'pipe']
  })

  console.log('STARTED GETH')

  this.gethProcess.stderr.on('data', this.log.bind(this))
  this.gethProcess.on('close', this.onGethClose.bind(this))

  this.statusLoop = setInterval(this.checkStatus.bind(this), STATUS_LOOP_INTERVAL)
  event.sender.send('onServerConnected')
}

GethNodeController.prototype.log = function (data) {
  console.log(`GETH NODE: ${data}`)
}

GethNodeController.prototype.onGethClose = function (code) {
  console.log(`GETH child process exited with code ${code}`)
}

GethNodeController.prototype.stop = function () {
  console.log('Stopping geth process')
  if (this.gethProcess) this.gethProcess.kill('SIGINT')
  if (this.statusLoop) clearInterval(this.statusLoop)
}

GethNodeController.prototype.toggle = function (event) {
  console.log('Toggling geth process')
  if (this.gethProcess && !this.gethProcess.killed) return this.stop()
  this.start(event)
}

GethNodeController.prototype.checkStatus = function () {
  this.makeRequest(PEER_COUNT_REQUEST_OPTIONS, PEER_COUNT_POST_DATA, this.updatePeerCount.bind(this))
}

GethNodeController.prototype.makeRequest = function (options, data, callback) {
  try {
    const req = request(options, function (res) {
      res.setEncoding('utf8')
      res.on('data', function (data) {
        const syncData = JSON.parse(data).result
        callback(syncData)
      }.bind(this))
    }.bind(this))

    req.on('error', console.error)
    req.write(data)
    req.end()
  } catch (err) {
    this.sendMsgToWindowContents('error', {message: err.message})
  }
}

GethNodeController.prototype.updatePeerCount = function (peerCountHex) {
  try {
    const peerCount = parseInt(peerCountHex, 16)
    this.sendMsgToWindowContents('peerCountData', { peerCount })
    if (peerCount > 0) this.makeRequest(SYNCING_REQUEST_OPTIONS, SYNCING_POST_DATA, this.updateSyncData.bind(this))
  } catch (err) {
    this.sendMsgToWindowContents('error', {message: err.message})
  }
}

GethNodeController.prototype.updateSyncData = function (syncData) {
  if (syncData === false) return this.sendMsgToWindowContents('gethFinishedSyncing')
  this.sendMsgToWindowContents('latestSyncedGethBlock', {
    lastSyncBlockNumber: parseInt(syncData.currentBlock, 16),
    highestBlockNumber: parseInt(syncData.highestBlock, 16),
    uploadBlockNumber: parseInt(syncData.startingBlock, 16),
  })
}

GethNodeController.prototype.sendMsgToWindowContents = function(msg, payload) {
  if(this.window && this.window.webContents) this.window.webContents.send(msg, payload)
}

module.exports = GethNodeController
