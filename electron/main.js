const { app, BrowserWindow, ipcMain} = require('electron');

const path = require('path');

const url = require('url');
const { channels } = require('../src/shared/constants');
const {getVideoData, playVideo} = require('./server')


let folderPath = null

let electronWindow;
// During Production
// const startUrl =   url.format({
//                     pathname: path.join(__dirname, '../electron.html'),
//                     protocol: 'file:',
//                     slashes: true,
//                   });
// -----------------------------------------------------------------------
// During Development
const startUrl =   url.format({
  pathname: path.join(__dirname, '../public/electron.html'),
  protocol: 'file:',
  slashes: true,
});




function createElectronWindow () {
  electronWindow = new BrowserWindow({ 
    width: 1366, 
    height: 768, 
    //frame:false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js') 
    }, 
  });
  
  electronWindow.loadURL(startUrl);
  //electronWindow.webContents.openDevTools()
  electronWindow.on('closed', function () {
    electronWindow = null;
  });
}


app.on('ready', createElectronWindow);



ipcMain.on('open-folder-dialog', async () => {
  
  // Dynamic folder for choice
  // folderPath = await dialog.showOpenDialog(electronWindow, {
  //     properties: ['openDirectory']
  // });
  // -------------------------------------------------------------
  //Static folder for now:
  folderPath = {
    filePaths: ['/home/aman/Videos/']
  }


  //During development
  process.env.ELECTRON_START_URL = 'http://localhost:3000'
  electronWindow.loadURL(process.env.ELECTRON_START_URL)
  // -----------------------------------------------------
  //During production
  // const newUrl =   url.format({
  //   pathname: path.join(__dirname, '../index.html'),
  //   protocol: 'file:',
  //   slashes: true,
  // });
  // electronWindow.loadURL(newUrl)
})

ipcMain.on(channels.APP_INFO, (event) => {
  event.sender.send(channels.APP_INFO, {
    appName: app.getName(),
    appVersion: app.getVersion(),
    folderPath: folderPath.filePaths[0]
  });
});

//get data from folderPath
ipcMain.on(channels.GET_INFO, async (event) => {

  let videoFilesObjects = await getVideoData(folderPath.filePaths[0])
  event.sender.send(channels.GET_INFO, {
    info: videoFilesObjects
  })

})

ipcMain.on(channels.EXPLORE_FOLDER, async (event, folderPath) => {
  let videoFiles = await getVideoData(folderPath)
  event.sender.send(channels.GET_INFO, {
    info: videoFiles
  })
})

ipcMain.on(channels.PLAY_VIDEO, (event, arg) => {
  playVideo(arg)
})

/*
 Snippets while packaging
 // During production
 // replace to folder-dialog.js  from
 <script src="../electron/folder-dialog.js"></script>
 to
 <script src="./electron/folder-dialog.js"></script>

 // Then
 npm run build && npm run build-electron && npm run package
 */
