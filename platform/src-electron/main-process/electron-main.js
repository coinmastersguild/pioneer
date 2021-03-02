/**
 *
 *  Wallet Main
 *
 *  All Network
 *
 *  All wallet and key mangement
 *
 *
 * @type {string}
 */

const TAG = ' | WALLET-MAIN | '
import { app, Menu, Tray, BrowserWindow, nativeTheme, ipcMain, Notification } from 'electron'
//import {checkConfigs, getConfig, innitConfig, updateConfig} from "@pioneer-platform/pioneer-config";
const { menubar } = require('menubar');
const path = require('path');
const iconPath = path.join(__dirname, 'menu-icon-large.png');

//internal
import {
  onStart,
  onLogin,
  onCreate,
  onPairKeepkey,
  checkPioneerUrl,
  viewSeed,
  createWallet,
  onAttemptCreate,
} from './app'

const log = require('electron-log');
// const pioneer = require("@pioneer-platform/pioneer-client")
// const Hardware = require("@pioneer-platform/pioneer-hardware")
// const client = require("@pioneer-platform/pioneer-events")

let URL_PIONEER_SPEC
const WALLETS = []
const APPS = []
let KEEPKEY
let PIONEER_SERVER_PROCESS

/*
      MenuBar

        - Osx
 */

/*
    Electron Settings
 */

try {
  if (process.platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
    require('fs').unlinkSync(require('path').join(app.getPath('userData'), 'DevTools Extensions'))
  }
} catch (_) { }

/**
 * Set `__statics` path to static files in production;
 * The reason we are setting it here is that the path needs to be evaluated at runtime
 */
if (process.env.PROD) {
  global.__statics = __dirname
}

let mainWindow
let previewWindow

//TODO :pray: someday menubar again?
function createPreviewDashboard(){
  previewWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })
  return previewWindow
}


function createWindow () {
  /**
   * Menu Bar
   */
  //TODO crash (only on build) image could not be created from "blabla" menu-icon-large.png
  log.info("Creating window!")
  //TODO why this no work?
  previewWindow = createPreviewDashboard()

  const tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open App', type: 'radio', click(){
        console.log("Open App was clicked!")
      }
    }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      // Change from /quasar.conf.js > electron > nodeIntegration;
      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: process.env.QUASAR_NODE_INTEGRATION,
      nodeIntegrationInWorker: process.env.QUASAR_NODE_INTEGRATION,

      // More info: /quasar-cli/developing-electron-apps/electron-preload-script
      // preload: path.resolve(__dirname, 'electron-preload.js')
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  client.disconnect()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('onStart', async (event, data) => {
  const tag = TAG + ' | onStart | '
  try {
    let result = await onStart(event,data)

    //TODO get state from local db

    //push layout
    let layout = [
      {
        "name":"Welcome",
        "icon":"assets/GreenCompas.jpeg",
        "x":0,
        "y":0,
        "w":2,
        "h":2,
        "i":"0"
      },
    ];

    event.sender.send('dashboard', {layout})


  } catch (e) {
    console.error(tag, e)
  }
})

// /*
//     Pairing Code
//  */
// ipcMain.on('getPairingCode', async (event, data) => {
//   const tag = TAG + ' | getPairingCode | '
//   try {
//
//     let pairing = {
//       email:"",
//       password:"",
//       vault:""
//     }
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
//
// /*
//    Pioneer Eventing services
//
//  */
//
// ipcMain.on('onListen', async (event, data) => {
//   const tag = TAG + ' | onListen | '
//   try {
//     log.info(tag,"start events!")
//     //Start Event listener
//     let config = await getConfig()
//     if(!config.username) throw Error("invalid config! username")
//     if(!config.queryKey) throw Error("invalid config! queryKey")
//
//     //TODO Pioneer WS URL env
//
//     let configEvents = {
//       username:config.username,
//       queryKey:config.queryKey,
//       // pioneerWs:""
//       pioneerWs:"ws://127.0.0.1:9001"
//     }
//
//     //sub to events
//     let events = await client.init(configEvents)
//
//     //TODO settings
//
//     //TODO subscribers
//
//     //info
//     events.on('message',function(request){
//       console.log("***** message: ",request)
//
//
//       //TODO filtering
//       const notification = {
//         title: 'message',
//         body: JSON.stringify(request)
//       }
//       new Notification(notification).show()
//
//       //push event to pending store
//
//       //open
//       event.sender.send('navigation', {dialog: 'Request', action: 'open'})
//
//       console.log("open nav: Request")
//     })
//
//     //blocks
//     // events.on('block',function(block){
//     //   console.log("block: ",block)
//     // })
//     //
//     // //payments
//     // events.on('block',function(block){
//     //   console.log("block: ",block)
//     // })
//
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// /*
//
//     Pioneer Primary Application Interface
//                   -Highlander
//
//     IPC bride
//
//  */
//
// ipcMain.on('onLogin', async (event, data) => {
//   const tag = TAG + ' | onLogin | '
//   try {
//
//     onLogin(event, data)
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// //onTryPin
// ipcMain.on('onTryPin', async (event, data) => {
//   const tag = TAG + ' | onTryPin | '
//   try {
//     log.info(tag,"trying pin! ",data.pin)
//     //try pin
//     Hardware.enterPin(data.pin)
//     //if wrong?
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// //onTryPin
// ipcMain.on('onAttemptCreate', async (event, data) => {
//   const tag = TAG + ' | onAttemptCreate | '
//   try {
//     //is username available
//     log.info(tag,"data: ",data)
//
//     // let result = await onAttemptCreate()
//     //
//     // if(result.success){
//     //   //close window
//     //   event.sender.send('navigation', {dialog: 'Username', action: 'close'})
//     //   //open setup
//     //   event.sender.send('navigation', {dialog: 'Setup', action: 'open'})
//     // } else {
//     //   event.sender.send('errors', {dialog: 'Username', action: 'create',error:result.error})
//     // }
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// ipcMain.on('createWallet', async (event, data) => {
//   const tag = TAG + ' | createWallet | '
//   try {
//       log.info(tag,"data: ",data)
//
//       let result = await createWallet(data)
//
//       //f it, send it
//       if(result.success){
//         event.sender.send('navigation',{ dialog: 'Connect', action: 'open'})
//       } else {
//         event.sender.send('errors', {dialog: 'Connect', action: 'create',error:result.error})
//       }
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// ipcMain.on('viewSeed', async (event, data) => {
//   const tag = TAG + ' | viewSeed | '
//   try {
//     let seed = await viewSeed()
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// //checkPioneerUrl
// ipcMain.on('checkPioneerUrl', async (event, data) => {
//   const tag = TAG + ' | checkPioneerUrl | '
//   try {
//
//     let status = await checkPioneerUrl(data)
//
//     if(status.online){
//       event.sender.send('checkPioneerUrl',{ online:true,info:status})
//     } else {
//       event.sender.send('checkPioneerUrl',{ online:false,error:status})
//     }
//
//   } catch (e) {
//     console.error(tag, e)
//     event.sender.send('checkPioneerUrl',{ online:false,error:e})
//   }
// })
//
// ipcMain.on('setPioneerUrl', async (event, data) => {
//   const tag = TAG + ' | checkPioneerUrl | '
//   try {
//     let urlSpec
//     if(!data.urlSpec) {
//       urlSpec = process.env['URL_PIONEER_SPEC']
//       urlSpec = urlSpec.replace("\"","")
//       urlSpec = urlSpec.replace("\"","")
//     } else {
//       urlSpec = data.urlSpec
//     }
//
//     //URL_PIONEER_SPEC
//     URL_PIONEER_SPEC = urlSpec
//
//     //push to ui
//     event.sender.send('setPioneerUrl',{ urlSpec })
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// ipcMain.on('onPairKeepkey', async (event, data) => {
//   const tag = TAG + ' | onPairKeepkey | '
//   try {
//     //pair keepkey
//     log.info(tag," pair device: ",data.deviceId)
//
//     let result = await onPairKeepkey(data)
//     log.info(tag," result: ",result)
//
//     //if success
//     event.sender.send('navigation', {dialog: 'SetupKeepkey', action: 'close'})
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// // ipcMain.on('onCreate', async (event, data) => {
// //   const tag = TAG + ' | onCreate | '
// //   try {
// //
// //     //let result = await onCreate(data)
// //
// //     //TODO
// //
// //   } catch (e) {
// //     console.error(tag, e)
// //   }
// // })
//
// ipcMain.on('loadInstalledApps', async (event, data) => {
//   const tag = TAG + ' | loadInstalledApps | '
//   try {
//     log.info(tag," loadInstalledApps() ")
//     let urlSpec = process.env['URL_PIONEER_SPEC']
//     urlSpec = urlSpec.replace("\"","")
//     urlSpec = urlSpec.replace("\"","")
//
//     log.info("Pioneer Server: ",urlSpec)
//     await pioneer.init(urlSpec,{queryKey:'test'})
//
//     //check app directory
//     let apps = await pioneer.apps({query:" "})
//     //console.log("apps: ",apps)
//
//     for(let i = 0; i < apps.length; i++){
//       let app = apps[i]
//       APPS.push(app)
//     }
//
//     //Apps
//     event.sender.send('loadApps',{ APPS })
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
// let SEARCH_TERM = " "
// ipcMain.on('onSearchApps', async (event, data) => {
//   const tag = TAG + ' | searchApps | '
//   try {
//
//
//     // if(data.query !== SEARCH_TERM){
//     //   log.info(tag," search term ",data)
//     //   SEARCH_TERM = data.query
//     //   let apps = await pioneer.apps({query:data.query})
//     //   console.log("apps: ",apps)
//     //
//     //   for(let i = 0; i < apps.length; i++){
//     //     let app = apps[i]
//     //     APPS.push(app)
//     //   }
//     //
//     //   //Apps
//     //   event.sender.send('loadApps',{ APPS })
//     // }
//
//   } catch (e) {
//     console.error(tag, e)
//   }
// })
//
//

