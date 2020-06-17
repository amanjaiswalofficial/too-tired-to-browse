const { app, BrowserWindow, ipcMain, ipcRenderer, dialog} = require('electron');
const path = require('path');
const url = require('url');
const { channels } = require('../src/shared/constants');
const {getVideoData, playVideo} = require('./server')

let folderPath = null

let electronWindow;
// const startUrl =   url.format({
//                     pathname: path.join(__dirname, '../public/index.html'),
//                     protocol: 'file:',
//                     slashes: true,
//                   });
const startUrl =   url.format({
  pathname: path.join(__dirname, '../public/electron.html'),
  protocol: 'file:',
  slashes: true,
});




function createElectronWindow () {
  electronWindow = new BrowserWindow({ 
    width: 800, 
    height: 600, 
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



// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });


// app.on('activate', function () {
//   if (mainWindow === null) {
//     createElectronWindow();
//   }
// });


ipcMain.on('open-folder-dialog', async () => {
  
  // folderPath = await dialog.showOpenDialog(electronWindow, {
  //     properties: ['openDirectory']
  // });
  //Static folder for now:
  folderPath = {
    filePaths: ['/home/aman/Videos/']
  }



  // getVideoData(folder_path.filePaths[0])
  //electronWindow.webContents.executeJavaScript(`localStorage.setItem("folderPath", ${folder_path.filePaths[0]})`, true)

  //while development
  process.env.ELECTRON_START_URL = 'http://localhost:3000'
  electronWindow.loadURL(process.env.ELECTRON_START_URL)

  //while production
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

  let videoFiles = await getVideoData(folderPath.filePaths[0])
  event.sender.send(channels.GET_INFO, {
    info: videoFiles
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

// ipcRenderer.send(channels.GET_DATA, (event) => {
//   event.sender.send(channels.GET_DATA, {
//     data: 'abc'
//   })
// })

/*
 Snippets while packaging
 <script src="./electron/folder-dialog.js"></script>

 pathname: path.join(__dirname, '../index.html')
 */

 
 // Save each hit's data in sqlite using name or something

