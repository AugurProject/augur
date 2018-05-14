const electron = require('electron');
const AugurUIServer = require('./augurUIServer');
const AugurNodeController = require('./augurNodeController');
const {app, BrowserWindow, ipcMain} = electron;  

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const augurNodeController = new AugurNodeController();
const augurUIServer = new AugurUIServer();

const path = require('path');
const url = require('url');

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 600, height: 400, icon: path.join(__dirname, '../augur.ico')});

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // This will initiate an AN instance with the current default network config. We give the window some time to load first in case we need to show errors
  setTimeout(function() {
    augurUIServer.setWindow(mainWindow);
    augurNodeController.setWindow(mainWindow);
  }, 2000);

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    augurNodeController.shutDownServer();
    augurUIServer.stopServer();
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
