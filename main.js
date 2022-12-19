const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const { autoUpdater } = require('electron-updater');
const log = require('electron-log')
log.transports.file.resolvePath = () => path.join('D:/Projects/electron-auto-update-example', '/logs/main.log')
log.info('Application Version - ' + app.getVersion())
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

}

app.on('ready', () => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  console.log(14002024432)
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  log.info('update-available')
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded')

  mainWindow.webContents.send('update_downloaded');
});

autoUpdater.on('download-progress', (progress) => {
  log.info('download-progress' + progress)

  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  log.info('restart_app')

  autoUpdater.quitAndInstall();
});
