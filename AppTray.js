const {app, Menu, Tray} = require('electron')

class AppTray extends Tray {
  constructor(icon, mainWindow) {
    super(icon);
    this.setToolTip('system monitor')
    this.mainWindow = mainWindow

    this.on('click', () => {
      this.mainWindow.isVisible() ? this.mainWindow.hide() : this.mainWindow.show()
    })

    this.on('right-click', () => {
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Quit',
          click: () => {
            app.isQuitting = true
            app.quit()
          }
        }
      ])
      this.popUpContextMenu(contextMenu)
    })
  }
}

module.exports = AppTray
