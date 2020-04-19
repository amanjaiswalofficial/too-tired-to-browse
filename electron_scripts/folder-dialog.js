const electron = require("electron")
const ipc = electron.ipcRenderer
console.log('this runs')
const testBtn = document.getElementById("testBtn")


//call an event and send it to IPC
testBtn.addEventListener('click', () => {
    console.log('here as well')
    ipc.send('open-folder-dialog')
})