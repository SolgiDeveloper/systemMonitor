const path = require('path')
const {ipcRenderer} = require('electron')
const {cpu, mem, os} = require('node-os-utils')

let cpuOverload
let alertFrequency

//get settings & values
ipcRenderer.on('settings:get', (e, settings) => {
  cpuOverload = +settings.cpuOverload
  alertFrequency = +settings.alertFrequency
})
// run every 2 sec
setInterval(()=>[
  //cpu usage
  cpu.usage().then(info =>{
    document.getElementById('cpu-usage').innerText = `${info}%`

    document.getElementById('cpu-progress').style.width = `${info}%`
    // make progress bar res if overload
    if (info >= cpuOverload){
      document.getElementById('cpu-progress').style.background = 'red'
    } else {
      document.getElementById('cpu-progress').style.background = '#30c88b'
    }
    // check overload
    if (info >= cpuOverload && runNotify(alertFrequency)){
      notifyUser({
        title: 'CPU Overload',
        body: `CPU is over ${cpuOverload}%`,
        icon: path.join(__dirname, 'img', 'icon.png')
      })

      localStorage.setItem('lastNotify', +new Date())
    }
  }),
  //cpu free
  cpu.free().then(info =>{
    document.getElementById('cpu-free').innerText = `${info}%`
  }),
  // uptime
  document.getElementById('sys-uptime').innerText = secondToDhms(os.uptime())
], 2000)

// set model
document.getElementById('cpu-model').innerText = cpu.model()

// computer name
document.getElementById('comp-name').innerText = os.hostname()

// os
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// total Mem
mem.info().then(info =>{
document.getElementById('mem-total').innerText = `${info.totalMemMb} Mb`
})
// show days, hours, mins, sec
function secondToDhms(seconds) {
  seconds = +seconds
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600 / 60))
  const s = Math.floor((seconds % 60))

  return `${d}d, ${h}h, ${m}m, ${s}s`
}
// send notification
function notifyUser(options) {
  // Notification is HTML5 API
  new Notification(options.title, options)
}
// check how much time has passed since notification
function runNotify(frequency) {
  if (localStorage.getItem('lastNotify') === null){
    // store timestamp
    localStorage.setItem('lastNotify', +new Date())
    return true
  }
  const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
  const now = new Date()
  const diffTime = Math.abs(now -notifyTime)
  const minutesPassed = Math.ceil(diffTime / (1000 * 60))
  console.log('minutesPassed > frequency',minutesPassed > frequency)
  return minutesPassed > frequency
}
