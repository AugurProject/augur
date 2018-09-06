const electron = require('electron')
const log = require('electron-log')
const { APP_ERROR, ERROR_NOTIFICATION } = require('../utils/constants')
// LOG ALL THE THINGS!!!!
log.transports.file.level = 'debug'

const checkForUpdates = require('./check-for-updates')
const AugurUIServer = require('./augurUIServer')
const AugurNodeController = require('./augurNodeServer')
const GethNodeController = require('./gethNodeController')
const ConfigManager = require('./configManager')
const {app, BrowserWindow, Menu} = electron
/* global __dirname process*/

const isDevelopment = process.env.NODE_ENV === 'development'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const configManager = new ConfigManager()
const selectedNetwork = configManager.getSelectedNetwork()

const augurNodeController = new AugurNodeController(selectedNetwork)
const augurUIServer = new AugurUIServer()
const gethNodeController = new GethNodeController()

const path = require('path')
const url = require('url')

function buildMenu() {
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
    submenu: [
      { type: 'separator' },
      { label: 'Open Inspector', accelerator: 'CmdOrCtrl+Shift+I', click: function() { mainWindow.webContents.openDevTools() }},
      { type: 'separator' }
    ]
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
  const aboutWindow = new BrowserWindow({width: 450, height: 300, minHeight: 300, minWidth: 450, maxHeight: 300, maxWidth: 450, icon: path.join(__dirname, '../augur.ico')})

  if (isDevelopment) {
    aboutWindow.loadURL(url.format(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/#about`))
  } else {
    aboutWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      hash: 'about',
      protocol: 'file:',
      slashes: true
    }))
  }
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({minWidth: 360, width: 360, maxWidth: 360, minHeight: 700, height: 860, maxHeight: 860, icon: path.join(__dirname, '../augur.ico')})

  mainWindow.webContents.on('will-navigate', ev => {
    ev.preventDefault()
  })

  if (isDevelopment) {
    mainWindow.openDevTools()
    mainWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  } else {
    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
  }

  // This will initiate an AN instance with the current default network config. We give the window some time to load first in case we need to show errors
  setTimeout(function() {
    augurNodeController.setWindow(mainWindow)
    gethNodeController.setWindow(mainWindow)
  }, 2000)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    try {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      augurNodeController.shutDownServer()
      augurUIServer.onStopUiServer()
      gethNodeController.onStopGethServer()
      mainWindow = null
    } catch (err) {
      console.log(err)
      if (mainWindow) mainWindow.webContents.send(ERROR_NOTIFICATION, {
        messageType: APP_ERROR,
        message: err.message || err
      })
    }
  })

  mainWindow.on('error', function(error) {
    if (mainWindow) mainWindow.webContents.send(ERROR_NOTIFICATION, {
      messageType: APP_ERROR,
      message: error.message || error
    })
  })

  // build initial menus
  buildMenu()

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  setTimeout(() => {
    if (mainWindow) mainWindow.webContents.send('ready')
  }, 1000)
  console.log('app is ready ')
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
