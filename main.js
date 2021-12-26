const { app, BrowserWindow, Menu } = require('electron')
const log = require('electron-log')
const Store = require('./Store')

// Set env
process.env.NODE_ENV = 'development'

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'

let mainWindow
// init store & defaults
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5
    }
  }
})

app.on( 'ready',()=>{
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
  mainWindow = new BrowserWindow({
    title: 'System Monitor',
    width: isDev ? 800 : 355,
    height: 500,
    icon: './assets/icons/icon.png',
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.loadFile('./app/index.html')
})

const menu = [
  ...(isWin ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isWin) {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

app.allowRendererProcessReuse = true
