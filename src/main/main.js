const electron = require('electron');
const log = require('electron-log');
// LOG ALL THE THINGS!!!!
log.transports.file.level = 'debug';

const AugurUIServer = require('./augurUIServer');
const AugurNodeController = require('./augurNodeServer');
const {app, BrowserWindow, Menu} = electron;
var ipc = require('electron').ipcRenderer;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const augurNodeController = new AugurNodeController();
const augurUIServer = new AugurUIServer();

const path = require('path');
const url = require('url');



function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({minWidth: 650, width: 950, minHeight: 400, height: 800, icon: path.join(__dirname, '../augur.ico')});

  mainWindow.webContents.on('will-navigate', ev => {
    ev.preventDefault()
  })

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


  // Create the Application's main menu
  var template = [{
    label: "Application",
    submenu: [
        //{ label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        //{ type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, 
    {
    label: "Settings",
    submenu: [
        { label: "Open Inspector", accelerator: "CmdOrCtrl+Shift+I", click: function() { mainWindow.webContents.openDevTools(); }},
        { label: "Reset Configuration File", click: function() { 
          ipc.send('reset', {});
        }},
        { label: "Enable SSL for Ledger", click: function() { 
          ipc.send('generateCert', {});
        }},
    ]},
    {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]}
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    try {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      augurNodeController.shutDownServer();
      augurUIServer.stopServer();
      mainWindow = null;
    } catch (err) {
      ipc.send('error', { error: err });
    }
  })

  mainWindow.on('error', function(error) {
    ipc.send('error', { error });
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

