const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const url = require('url');
const { channels } = require('../src/shared/constants');

let mainWindow;
function createWindow () {
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../public/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow = new BrowserWindow({ 
    width: 800, 
    height: 600, 
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js') 
    }, 
  });
  
  mainWindow.loadURL(startUrl);
  mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('open-folder-dialog', async () => {
  folder_path = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
  });
  
  //process.env.ELECTRON_START_URL = 'http://localhost:3001'
  
})

ipcMain.on(channels.APP_INFO, (event) => {
  event.sender.send(channels.APP_INFO, {
    appName: app.getName(),
    appVersion: app.getVersion(),
  });
});



/*
 Snippets while packaging
 <script src="../electron/folder-dialog.js"></script>

 pathname: path.join(__dirname, '../index.html')
 */