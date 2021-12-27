const { BrowserWindow} = require('electron')

class MainWindow extends BrowserWindow {
  constructor (file,isDev){
    super(
      {
        title: 'System Monitor',
        width: isDev ? 800 : 355,
        height: 500,
        show: false,
        opacity: 0.9,
        icon: './assets/icons/icon.png',
        resizable: isDev,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
      }
    )
    this.loadFile(file)
    if (isDev) {
      this.webContents.openDevTools()
    }
  }
}
module.exports = MainWindow
