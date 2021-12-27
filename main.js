const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path')
const log = require('electron-log')
const Store = require('./Store')
const MainWindow = require('./MainWindow')
const AppTray = require('./AppTray')

// Set env
process.env.NODE_ENV = 'development'
// process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production'
const isMac = process.platform === 'darwin'
const isWin = process.platform === 'win32'

let mainWindow
let tray
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
  mainWindow = new MainWindow('./app/index.html',isDev)

  mainWindow.webContents.on('dom-ready', ()=>{
    mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  mainWindow.on('close', e =>{
    if (!app.isQuitting){
      e.preventDefault()
      mainWindow.hide()
    }

    return true
  })
  const icon = path.join(__dirname, 'assets', 'icons', 'icon.png')
  //create tray
  tray = new AppTray(icon, mainWindow)
})

const menu = [
  // ...(isWin ? [{ role: 'appMenu' }] : []),
  // {
  //   role: 'fileMenu',
  // },
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Navigation',
        click: ()=> mainWindow.webContents.send('nav:toggle')
      }
    ]
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
// set settings
ipcMain.on('settings:set', (e, value) =>{
  store.set('settings', value)
  mainWindow.webContents.send('settings:get', store.get('settings'))
})
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
