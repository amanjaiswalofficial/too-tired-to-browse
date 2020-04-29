const electron = require("electron")
const ipc = electron.ipcRenderer
const testBtn = document.getElementById("testBtn")

//call an event and send it to IPC
testBtn.addEventListener('click', () => {
    ipc.send('open-folder-dialog')
 })