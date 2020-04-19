const electron = require("electron")
const path = require("path")
const url = require("url")
const axios = require('axios')

//Initializations
const app = electron.app
//app.allowRendererProcessReuse = true
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const dialog = electron.dialog
let electronWindow, reactWindow
let folder_path = null;

//create Electron window to handle path upload
//TO DO: separate the HTML pages
createElectronWindow = () => {
    
    let pathToLoad = null
    electronWindow = new BrowserWindow({
        width: 800, 
        height: 600, 
        webPreferences: {
            nodeIntegration: true
        }
    });
    electronWindow.webContents.openDevTools()
    pathToLoad = url.format({
        pathname: path.join(__dirname, 'public/index.html'),
        protocol: 'file',
        slashes: true
    })
    electronWindow.loadURL(pathToLoad)
    
}


//On upload, close previous window and open a new one
createReactWindow = () => {
    
    let pathToLoad = "http://localhost:3001"
    reactWindow = new BrowserWindow({
        width: 800, 
        height: 600, 
        webPreferences: {
            nodeIntegration: true
        }
    });

    reactWindow.webContents.openDevTools()
    reactWindow.loadURL(pathToLoad)
    
}


//listen to an event called on any of the buttons clicked, etc based on the value provided
//and perform and action
ipc.on('open-folder-dialog', async () => {
    folder_path = await dialog.showOpenDialog(electronWindow, {
        properties: ['openDirectory']
    });
    createReactWindow()
    electronWindow.close()

    
    //separate function
    axios.post('http://localhost:3002', {
        folder_path: folder_path
    }).then(function(response){
        console.log(response.data)
    })

})

//start the process
app.on('ready', createElectronWindow)
