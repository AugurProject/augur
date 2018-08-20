const {app, dialog, shell } = require('electron')
const {autoUpdater} = require('electron-updater')
const ProgressBar = require('electron-progressbar')
const log = require('electron-log')

const isDev = require('electron-is-dev')

const downloadAndInstall = () => {
  var progressBar = new ProgressBar({
    text: 'Downloading update',
    detail: '0%',
    indeterminate: false,
  })

  autoUpdater
    .on('download-progress', ({ percent }) => {
      progressBar.detail = `${percent.toFixed(1)}%`
      progressBar.value = percent
    })
    .on('update-downloaded', () => {
      progressBar.setCompleted()
      autoUpdater.quitAndInstall()
    })

  autoUpdater.downloadUpdate()
}

const notifyNoUpdate = () => {
  dialog.showMessageBox({
    message: 'No update is available.',
  })
}

const notifyUpdate = (resolve) => (updateInfo) => {
  dialog.showMessageBox({
    message: `Update ${updateInfo.version} available. (Current version ${app.getVersion()})`,
    buttons: [
      'See Release Notes',
      'Remind Me Later',
      'Download and Install Update',
    ],
    cancelId: 1,
    defaultId: 2,
  }, (data) => {
    switch (data) {
      case 2:
        downloadAndInstall()
        break
      case 0:
        shell.openExternal('https://github.com/AugurProject/augur-app/releases')
        resolve()
        break
      case 1:
        resolve()
        break
      default:
        resolve()
    }
  })
}

// this only needs to be done once.
autoUpdater.logger = log
autoUpdater.autoDownload = false

module.exports = (notifyUpdateNotAvailable = false) => {
  if(isDev) return Promise.resolve()
  if(process.platform == "linux" && !process.env.APPIMAGE) return Promise.resolve()

  const p = new Promise((resolve) => {
    autoUpdater
      .once('update-not-available', resolve)
      .once('update-available', notifyUpdate(resolve))
  })

  autoUpdater
    .removeListener('update-not-available', notifyNoUpdate)

  if (notifyUpdateNotAvailable) autoUpdater
    .once('update-not-available', notifyNoUpdate)


  return autoUpdater.checkForUpdates().catch((e) => {
    log.error('There was an error updating app. This is expected if using deb package.')

    return Promise.resolve(p);
  });

  return p;
}
