const {app , BrowserWindow } = require('electron')
const isDev = process.env.NODE_EVN !=='development'
app.whenReady().then(() =>{
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false

        },
        title:"image",
        width: isDev ? 1300 : 300,
        height: 700
    });


    if(isDev){
        mainWindow.webContents.openDevTools();
    }
    mainWindow.loadFile('views/login.html')

})