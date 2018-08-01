const electron = require('electron')
const log = require('electron-log')

// LOG ALL THE THINGS!!!!
log.transports.file.level = 'debug'

const checkForUpdates = require('../update/check-for-updates')

const appData = require('app-data-folder')
const fs = require('fs')
const AugurUIServer = require('./augurUIServer')
const AugurNodeController = require('./augurNodeServer')
const GethNodeController = require('./gethNodeController')
const {app, BrowserWindow, Menu, ipcMain} = electron
/* global __dirname process*/

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const augurNodeController = new AugurNodeController()
const augurUIServer = new AugurUIServer()
const gethNodeController = new GethNodeController()

const path = require('path')
const url = require('url')

function toggleEnableSsl() {
  mainWindow.webContents.send('toggleSsl', true)
  buildMenu(true)
}

function buildMenu(showDisable) {
  // check if ssl files exist
  const sslMenu = []
  const appDataPath = appData('augur')
  const certPath = path.join(appDataPath, 'localhost.crt')
  const keyPath = path.join(appDataPath, 'localhost.key')
  if (fs.existsSync(keyPath) && fs.existsSync(certPath) || showDisable) {
    sslMenu.push({ label: 'Disable SSL for Ledger', enabled: !showDisable, click: function() { mainWindow.webContents.send('toggleSsl', false)}})
  } else {
    sslMenu.push({ label: 'Enable SSL for Ledger', click: toggleEnableSsl})
  }
  sslMenu.push({ type: 'separator' })
  sslMenu.push({ label: 'Reset Configuration File', click: function() { mainWindow.webContents.send('reset', '') }})
  sslMenu.push({ label: 'Reset Database', click: function() { mainWindow.webContents.send('clearDB', '') }})
  sslMenu.push({ type: 'separator' })
  sslMenu.push({ label: 'Open Inspector', accelerator: 'CmdOrCtrl+Shift+I', click: function() { mainWindow.webContents.openDevTools() }})
  sslMenu.push({ type: 'separator' })

  // Create the Application's main menu
  var template = [{
    label: 'Application',
    submenu: [
      { label: 'About', accelerator: 'Command+A', click: function() { about() }},
      { type: 'separator' },
      { label: 'Check For Updates', click: () => checkForUpdates(true)},
      {type: 'separator'},
      { label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit() }}
    ]},
  {
    label: 'Settings',
    submenu: sslMenu
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
      { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
      { type: 'separator' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]}
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

}

function about() {
  const aboutWindow = new BrowserWindow({width: 450, height: 350, icon: path.join(__dirname, '../augur.ico')})

  aboutWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/about.html'),
    protocol: 'file:',
    slashes: true
  }))
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({minWidth: 650, width: 950, minHeight: 400, height: 800, icon: path.join(__dirname, '../augur.ico')})

  mainWindow.webContents.on('will-navigate', ev => {
    ev.preventDefault()
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // This will initiate an AN instance with the current default network config. We give the window some time to load first in case we need to show errors
  setTimeout(function() {
    augurNodeController.setWindow(mainWindow)
    gethNodeController.setWindow(mainWindow)
  }, 2000)

  ipcMain.on('rebuildMenu', function () {
    buildMenu(false)
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    try {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      augurNodeController.shutDownServer()
      augurUIServer.stopServer()
      gethNodeController.stop()
      mainWindow = null
    } catch (err) {
      if (mainWindow) mainWindow.webContents.send('error', { error: err })
    }
  })

  mainWindow.on('error', function(error) {
    if (mainWindow) mainWindow.webContents.send('error', { error })
  })

  // build initial menus
  buildMenu()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  checkForUpdates()
    .then(createWindow)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
