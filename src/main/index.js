import { app, BrowserWindow } from 'electron'
import Organiser from "./Organiser";

/**
* Set `__static` path to static files in production
* https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
*/
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let organiser
const winURL = process.env.NODE_ENV === 'development'
? `http://localhost:9080`
: `file://${__dirname}/index.html`

function createWindow () {
    /**
    * Initial window options
    */


    mainWindow = new BrowserWindow({
        height: 563,
        useContentSize: true,
        width: 1000
    })


    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    var handleRedirect = (e, url) => {
        if(url != mainWindow.webContents.getURL()) {
            e.preventDefault()
            require('electron').shell.openExternal(url)
        }
    }

    mainWindow.webContents.on('will-navigate', handleRedirect)
    mainWindow.webContents.on('new-window', handleRedirect)


    console.log(Organiser);
    organiser = new Organiser(mainWindow);
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
