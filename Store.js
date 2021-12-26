const electron = require('electron')
const path = require('path')
const fs = require('fs')

class Store {
  constructor(options) {
    const userDatePath = (electron.app || electron.remote.app).getPath('userData')
    this.path = path.join(userDatePath, options.configName + '.json')
    this.data = parseDataFile(this.path, options.default)
  }

  get(key) {
    return this.data[key]
  }

  set (key, val) {
    this.data[key] = val
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }

}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch (err){
    return defaults
  }
}

module.exports = Store