/*
    Primary Application Module

      Pioneer Platform

          -highlander
 */

const TAG = ' | APP | '
import {checkConfigs, getConfig, innitConfig, updateConfig} from "@pioneer-platform/pioneer-config";
const CryptoJS = require("crypto-js")
const bip39 = require(`bip39`)
const App = require("@pioneer-platform/pioneer-app");
const figlet = require('figlet');
const bcrypt = require("bcryptjs");
const chalk = require("chalk");
let wait = require('wait-promise');
let sleep = wait.sleep;
const log = require('electron-log');
const generator = require('generate-password');
const Hardware = require("@pioneer-platform/pioneer-hardware")
const Network = require("@pioneer-platform/pioneer-client")
const ethCrypto = require("@pioneer-platform/eth-crypto")
import {v4 as uuidv4} from 'uuid';
//Globals
let WALLETS_LOADED = []
let WALLETS_NAMES = []
let WALLET_CONTEXT = ""
let FIO_ACCEPT = false
let FIO_REJECT = false
let PASSWORDLESS_ENABLE = false
let WALLET_PASSWORD
let WALLET_HASH
let USERNAME
let PRIMARY_VAULT
let FIRST_START = true
let NETWORK
let KEEPKEY
function standardRandomBytesFunc(size) {
  /* istanbul ignore if: not testable on node */
  return CryptoJS.lib.WordArray.random(size).toString()
}

//feature flags
let featureKeepkey = process.env['KEEPKEY_FEATURE']
let featureSoftwareCreate = process.env['CREATE_SOFTWARE_FEATURE']
let featurePasswordless = process.env['PASSWORDLESS_FEATURE']
let featureInsecurePassword = process.env['INSECURE_PASSWORD']

export async function attemptPair(event, data) {
  let tag = TAG + " | attemptPair | ";
  try {
    log.info(tag,"data: ",data)
    let resultPair = await App.pair(data)
    return resultPair
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function initConfig() {
  let tag = TAG + " | initConfig | ";
  try {
    let config = await App.getConfig()
    if(config){
      //
      if(!config.pioneerUrl){
        let pioneerUrl = "http://127.0.0.1:9001/spec/swagger.json"
        App.updateConfig({pioneerUrl});
      }
      if(!config.queryKey){
        let queryKey = uuidv4()
        App.updateConfig({queryKey});
      }
      return true
    } else {
      //create key/save to config
      await App.initConfig("english");
      let queryKey = uuidv4()
      App.updateConfig({queryKey});
      //pioneer server
      //TODO get from ENV? always remote?
      let pioneerUrl = "http://127.0.0.1:9001/spec/swagger.json"
      App.updateConfig({pioneerUrl});
      App.updateConfig({spec:pioneerUrl});
      return true
    }
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function continueSetup(event, data) {
  let tag = TAG + " | continueSetup | ";
  try {
    let config = await App.getConfig()
    if(config){
      log.info(tag,"Checkpoint1 config found!")
      //verify net inited
      if(NETWORK){
        log.info(tag,"Checkpoint2 NETWORK found!")
        //is online?
        let globals = await NETWORK.instance.Globals()
        globals = globals.data
        log.info(tag,"globals: ",globals)

        //push status
        event.sender.send('pushPioneerStatus',{
          pioneerUrl:config.pioneerUrl,
          online:true,
          globals
        })

        //is username set?
        if(config.username){
          log.info(tag,"Checkpoint4a Username found! SuccessFully Setup Wallet!")
          //start wallet?
          //TODO final checks if able to startup?
          //username found! start wallet!
          event.sender.send('navigation',{ dialog: 'Setup', action: 'open'})
          //this doesnt seem to return?
          return {
            setup:true,
            success:true,
            result:"ready to start App!"
          }
        } else {
          log.info(tag,"Checkpoint4b Username NOT found! Need user input")
          //Create username
          event.sender.send('navigation',{ dialog: 'SetupUsername', action: 'open'})
          return {
            success:true,
            result:'prompting user to create username!'
          }
        }
      }else{
        log.info(tag,"Checkpoint2b NO NETWORK found!")
        if(config.pioneerUrl && config.queryKey){
          if(!config.pioneerUrl) throw Error("102: invalid config! pioneerUrl")
          if(!config.queryKey) throw Error("103: invalid config! queryKey")
          log.info(tag,"Checkpoint3a Starting network module!")
          //init network
          //get status
          NETWORK = new Network(config.pioneerUrl,{
            queryKey:config.queryKey
          })
          NETWORK = await NETWORK.init()
          await continueSetup(event, data)
        } else {
          log.info(tag,"Checkpoint3b invalid config :( trying again")
          await initConfig()
          await continueSetup(event, data)
        }
      }
    } else {
      await initConfig()
      await continueSetup(event, data)
    }
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

//checkPioneerUrl
export async function checkPioneerUrl(event, data) {
  let tag = TAG + " | checkPioneerUrl | ";
  try {
    console.log(tag,"data: ",data)
    let config = await App.getConfig()
    let pioneerUrl
    if(!data.pioneerUrl){
      log.info("url NOT passed to check, checking default")
      //is initialized?
      if(config){
        //use pioneerUrl from config
        log.info(tag,"config: ",config)
        pioneerUrl = config.pioneerUrl
      } else {
        await initConfig()
        config = await App.getConfig()
        if(!config) throw Error("Failed to init config!")
        pioneerUrl = config.pioneerUrl
      }
    } else {
      pioneerUrl = data.pioneerUrl
    }

    //get status
    let networkTest = new Network(pioneerUrl,{
      queryKey:config.queryKey
    })
    networkTest = await networkTest.init()

    //
    let globals = await networkTest.instance.Globals()
    globals = globals.data
    log.info(tag,"globals: ",globals)

    //TODO this assume online! lol fixme when remote
    //push status
    event.sender.send('pushPioneerStatus',{
      pioneerUrl,
      online:true,
      globals
    })

  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function getUsbDevices(event, data) {
  let tag = TAG + " | getUsbDevices | ";
  try {
    log.info(tag,"Checkpoint 0")

    let allUsbDevices = await Hardware.allDevices()
    event.sender.send('allUsbDevices',{ allUsbDevices })
    log.debug(tag,"allUsbDevices: ",allUsbDevices)

    let allKeepKeys = await Hardware.listKeepkeys()
    event.sender.send('allKeepKeys',{ allKeepKeys })
    log.debug(tag,"allKeepKeys: ",allKeepKeys)

  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}


/*
  Maintain current state of devices
  'unkown',
  'conected',
  'locked',
  'unlocked'

 */
let KEEPKEY_STATUS = 'unknown'
export async function startHardware(event, data) {
  let tag = TAG + " | startHardware | ";
  try {
    log.info(tag,"Checkpoint 0")
    //start
    KEEPKEY = await Hardware.start()
    log.info(tag,"Checkpoint 1")
    KEEPKEY.events.on('event', async (eventKeepkey) => {
      log.info(tag,"eventKeepkey: ",eventKeepkey)
      event.sender.send('hardware',{event:eventKeepkey})
    });

    let allUsbDevices = await Hardware.allDevices()
    event.sender.send('allUsbDevices',{ allUsbDevices })
    log.debug(tag,"allUsbDevices: ",allUsbDevices)

    let allKeepKeys = await Hardware.listKeepkeys()
    event.sender.send('allKeepKeys',{ allKeepKeys })
    log.info(tag,"allKeepKeys: ",allKeepKeys)

    let info = await Hardware.info()
    event.sender.send('hardwareInfo',{ info })
    log.info(tag,"info: ",info)

    let state = await Hardware.state()
    event.sender.send('hardwareState',{ state })
    log.debug(tag,"info: ",state)

    if(state > 1){
      //lockStatus
      let lockStatus = await Hardware.isLocked()
      event.sender.send('hardwareLockStatus',{ lockStatus })
      log.info("lockStatus: ",lockStatus)

      //if locked
      if(lockStatus){
        KEEPKEY_STATUS = 'locked'
        Hardware.displayPin()
        //open pin
        event.sender.send('navigation',{ dialog: 'Pin', action: 'open'})
      } else {
        KEEPKEY_STATUS = 'unlocked'
        //is connected?
        let info = await Hardware.info()
        log.info("info: ",info)
        //TODO next page?
        // if(info.features){
        //   event.sender.send('navigation',{ dialog: 'HardwareConnect', action: 'close'})
        // }
        event.sender.send('deviceInfo',info)
      }
    }
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}


// /*
//   Maintain current state of devices
//   'unkown',
//   'conected',
//   'locked',
//   'unlocked'
//
//  */
// let KEEPKEY_STATUS = 'unknown'
// async function lifecycleKeepkey(event, data) {
//   let tag = TAG + " | lifecycleKeepkey | ";
//   try {
//
//     //start
//     let KEEPKEY = await Hardware.start()
//     KEEPKEY.events.on('event', async (eventKeepkey) => {
//       log.info(tag,"eventKeepkey: ",eventKeepkey)
//       event.sender.send('hardware',{event:eventKeepkey})
//     });
//
//     let state = await Hardware.state()
//     log.info("state: ",state)
//
//     if(state > 1){
//       //lockStatus
//       let lockStatus = await Hardware.isLocked()
//       log.info("lockStatus: ",lockStatus)
//
//       //if locked
//       if(lockStatus){
//         KEEPKEY_STATUS = 'locked'
//         Hardware.displayPin()
//         //open pin
//         event.sender.send('navigation',{ dialog: 'Pin', action: 'open'})
//       } else {
//         KEEPKEY_STATUS = 'unlocked'
//         //is connected?
//         let info = await Hardware.info()
//         log.info("info: ",info)
//         if(info.features){
//           event.sender.send('navigation',{ dialog: 'HardwareConnect', action: 'close'})
//         }
//         event.sender.send('deviceInfo',info)
//       }
//     }
//   } catch (e) {
//     console.error(tag, "e: ", e);
//     return {error:e};
//   }
// }

export async function onStart(event,data) {
  let tag = TAG + " | onStart | ";
  try {

    log.info(tag," onStart() ")
    if(FIRST_START){
      //Print banner
      log.info(  chalk.red(
        figlet.textSync('Pioneer-Native', { horizontalLayout: 'full' })
      ))
      log.info(
        "\n \n \n        ,    .  ,   .           .\n" +
        "    *  / \\_ *  / \\_      " +
        chalk.yellowBright(".-.") +
        "  *       *   /\\'__        *\n" +
        "      /    \\  /    \\,   " +
        chalk.yellowBright("( ₿ )") +
        "     .    _/  /  \\  *'.\n" +
        " .   /\\/\\  /\\/ :' __ \\_  " +
        chalk.yellowBright(" - ") +
        "          _^/  ^/    `--.\n" +
        "    /    \\/  \\  _/  \\-'\\      *    /.' ^_   \\_   .'\\  *\n" +
        "  /\\  .-   `. \\/     \\ /==~=-=~=-=-;.  _/ \\ -. `_/   \\\n" +
        " /  `-.__ ^   / .-'.--\\ =-=~_=-=~=^/  _ `--./ .-'  `-\n" +
        "/        `.  / /       `.~-^=-=~=^=.-'      '-._ `._"
      );
      FIRST_START = false
    }

    let configStatus = checkConfigs()
    let config = await App.getConfig()
    delete config.isTestnet
    log.info(tag,"config: ",config)
    log.debug(tag,"configStatus() | configStatus: ", configStatus)

    if(data.password){
      config.temp = data.password
      WALLET_PASSWORD = data.password
      if(featureInsecurePassword){
        //write password to file (auto-login)
        //NOTE: it is bad form to store USER passwords on disk
        //however: it is accepted to store generated passwords on disk
        await App.updateConfig({temp: data.password});
      }
    }

    if(!config){
      throw Error("Attempting to start wallet before configuration!")
    }

    if(config && !config.promptedPasswordless){
      //log.info(tag," offer encryption ")
      //TODO opt-into passwords
      //event.sender.send('navigation',{ dialog: 'PasswordCreate', action: 'open'})
      //return true
    }

    if(config && !config.promptedFio){
      //TODO opt in to FIO
    }

    if(!config.username){
      throw Error("2 Attempting to start wallet before configuration!")
    }

    if(!config.temp && config.passwordHash && !WALLET_PASSWORD){
      WALLET_HASH = config.passwordHash
      event.sender.send('navigation',{ dialog: 'Unlock', action: 'open'})
      return
    } else if(config.temp) {
      WALLET_PASSWORD = config.temp
    } else {
      //generate password
      if(featurePasswordless){
        log.info(tag,"featurePasswordless TRUE")
        //create password
        let randomChars = generator.generateMultiple(1, {
          length: 10,
          uppercase: false
        });
        WALLET_PASSWORD = randomChars[0]
        await App.updateConfig({temp:WALLET_PASSWORD});
      } else {
        //get password
        event.sender.send('navigation',{ dialog: 'Unlock', action: 'open'})
        return true
      }
    }
    if(!WALLET_PASSWORD) throw Error("Error: Password required! ")

    //get wallet files
    let walletFiles = await App.getWalletNames()
    log.info("walletFiles: ",walletFiles)


    //TODO get local env to work! (adding ""bs from quasar conf
    if(!config.spec || true){
      // config.spec = "https://pioneers.dev/spec/swagger.json"
      // config.urlSpec = "https://pioneers.dev/spec/swagger.json" // rabble
      config.wss = "ws://127.0.0.1:9001"
      config.spec = "http://127.0.0.1:9001/spec/swagger.json"
      config.urlSpec = "http://127.0.0.1:9001/spec/swagger.json" // rabble
      //config.spec = "https://pioneers.dev/spec/swagger.json"
    }

    if(walletFiles.length === 0){
      //Always have atleast 1 wallet!
      log.info(" No Wallets found! ")

      return true
    }

    //TODO blockchains configurable?
    config.blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance']

    //start App
    if(!WALLET_PASSWORD) throw Error("unable to start! missing, WALLET_PASSWORD")
    config.password = WALLET_PASSWORD
    log.info(tag,"config: ",config)

    let resultInit = await initConfig()
    log.info(tag,"resultInit: ",resultInit)
    //push devices
    if(resultInit.devices){
      event.sender.send('loadDevices',{devices:resultInit.devices})
    }

    //push init
    // event.sender.send('init',resultInit)
    if(resultInit.TOTAL_VALUE_USD_LOADED){
      event.sender.send('updateTotalValue',resultInit.TOTAL_VALUE_USD_LOADED)
    }

    //TODO check success init?
    event.sender.send('navigation',{ dialog: 'Connect', action: 'close'})

    let wallets = await App.getWallets()
    if(wallets.length === 0) throw Error("Failed to start wallet APP. 0 wallets")
    //set global
    WALLETS_LOADED = wallets
    let walletNames = await App.getWalletNames()
    WALLETS_NAMES = walletNames

    log.info(tag,"walletNames: ",walletNames)
    event.sender.send('updateWallets',resultInit.wallets)

    //wallet events
    resultInit.events.on('message', async (request) => {
      console.log(tag,"*** message: ", request)

      //TODO messages
      //event.sender.send('navigation',{ dialog: 'Connect', action: 'close'})
    })

    //TODO block events per blockchain activated

    //txs TODO sub to username && subscribed usernames

    //requests Filter requests by privacy settings

    //globals


    //get user info
    let userInfo = await App.getuserInfo()
    if(!userInfo.context || userInfo.context !== WALLET_CONTEXT) {
      WALLET_CONTEXT = userInfo.context
      event.sender.send('setContext',userInfo.context)
      let resultUpdateConextRemote = await App.selectWallet(data.context)
      log.info(tag,"resultUpdateConextRemote: ",resultUpdateConextRemote)
    }


    //TODO is context pref in config?
    let contextName = await App.context()
    console.log("contextName: ",contextName)
    if(contextName && contextName !== WALLET_CONTEXT){
      log.info(tag,"Local context not matching remote! setting to local")
      WALLET_CONTEXT = userInfo.context
      event.sender.send('setContext',userInfo.context)
      let resultUpdateConextRemote = await App.selectWallet(data.context)
      log.info(tag,"resultUpdateConextRemote: ",resultUpdateConextRemote)
    }

    //get invocations
    let invocationsRemote = await App.getInvocations()
    log.info(tag,"invocationsRemote: ",invocationsRemote)
    event.sender.send('invocations',invocationsRemote)

    //load masters
    // let info = await context.getInfo(contextName)
    // log.info("(context) info: ",info)
    // event.sender.send('setWalletInfoContext',info)

    //Start wallet interface
    log.info(tag,"CHECKPOINT **** return start")
    return resultInit
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function refreshPioneer(event, data) {
  let tag = TAG + " | refreshPioneer | ";
  try {
    //is initialized?
    let config = await App.getConfig()
    if(config){
      log.info(tag,"loadConfig: ",config)
      event.sender.send('loadConfig',{
        config
      })

      //if App is init
      let initStatus = App.isInitialized()
      if(initStatus){
        let userInfo = await App.getUserInfo()
        log.info(tag,"userInfo: ",userInfo)
        if(userInfo){
          if(userInfo.context){
            event.sender.send('setContext',userInfo.context)
          }
          if(userInfo.contextInvoke){
            //launch invoke dialog
            event.sender.send('setContextInvoke',userInfo.contextInvoke)
          }

          //get global online
          let usersOnline = await App.getUsersOnline()
          log.info(tag,"usersOnline: ",usersOnline)
        } else {
          log.info(tag,"user is unregistered!  no remote user info!")
        }

        //wallets
        let walletNames = await App.getWalletNames()
        if(walletNames){
          WALLETS_NAMES = walletNames
          log.info(tag,"walletNames: ",walletNames)
        } else {
          log.info(tag,"No wallets loaded!")
        }
      } else {
        log.info(tag,"Wallet not started yet! ")
      }
    } else {
      log.info(tag,"No config file! start new user")
      //TODO
      //launch startup
      event.sender.send('navigation',{ dialog: 'Welcome', action: 'open'})
    }
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function updateContext(event, data) {
  let tag = TAG + " | setMnemonic | ";
  try {
    log.info(tag,"data: ",data)
    if(data.context){
      //TODO is differnt then remote?
      if(data.context !== WALLET_CONTEXT){
        log.info(tag,"Current context match's update?")
      }

      //TODO verify in wallet array?

      //verify local wallets match remote available

      let resultCreate = await App.selectWallet(data.context)
      return resultCreate
    }
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function setMnemonic(event, data) {
  let tag = TAG + " | setMnemonic | ";
  try {
    log.info(tag,"data: ",data)
    let resultCreate = await App.setSeed('software',wallet)
    return resultCreate
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function approveTransaction(event, data) {
  let tag = TAG + " | setMnemonic | ";
  try {
    log.info(tag,"data: ",data)
    let resultApprove = await App.approveTransaction(await App.context(),data.invocationId)
    return resultApprove
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function onAttemptCreateUsername(event, data) {
  let tag = TAG + " | onAttemptCreateUsername | ";
  try {
    let config = await App.getConfig()
    if(!data.username) throw Error("102: Must give username for creating username!")
    if(!config) throw Error("103: Must init config before creating username!")
    let urlSpec = config.pioneerUrl
    if(!urlSpec) throw Error("104: pioneerUrl NOT set before onAttemptCreateUsername!")
    if(!NETWORK) throw Error("105: Network not initialized! before onAttemptCreateUsername")

    let userInfoPublic = await NETWORK.instance.Username(data.username)
    userInfoPublic = userInfoPublic.data
    console.log("userInfoPublic: ",userInfoPublic)

    if(userInfoPublic.available){
      await innitConfig("english");
      log.info("username available!: ")
      updateConfig({username: data.username});

      //close window
      event.sender.send('navigation', {dialog: 'Username', action: 'close'})
      //open setup
      event.sender.send('navigation', {dialog: 'Setup', action: 'open'})

    } else {
      log.info("username NOT available!: ",userInfoPublic.data)
      event.sender.send('errors', {dialog: 'Username', action: 'create',error:userInfoPublic.data})
    }

  } catch (e) {
    console.error(tag, "e: ", e);
    return {};
  }
}

export async function createWallet(event, data) {
  let tag = TAG + " | createWallet | ";
  try {
    log.info(tag,"data: ",data)

    //if no password
    if(!data.password){
      if(featurePasswordless){
        log.info(tag,"featurePasswordless TRUE")
        let randomChars = generator.generateMultiple(1, {
          length: 10,
          uppercase: false
        });
        data.password = "temp:"+randomChars[0]
      }else{
        throw Error("unhandled action featurePasswordless: "+featurePasswordless)
      }
    }

    //if no username
    if(!data.username){
      let randomChars = generator.generateMultiple(1, {
        length: 10,
        uppercase: false
      });
      data.username = "user:"+randomChars[0]
      //add to config
      await updateConfig({username:data.username})
    }

    //if no mnemonic
    if(!data.mnemonic){
      if(featureSoftwareCreate){
        log.info(tag,"featureSoftwareCreate TRUE")
        let randomBytesFunc = standardRandomBytesFunc
        const randomBytes = Buffer.from(randomBytesFunc(32), `hex`)
        if (randomBytes.length !== 32) throw Error(`Entropy has incorrect length`)
        let mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`))
        data.mnemonic = mnemonic

      }else{
        throw Error("unhandled action featureSoftwareCreate: "+featureSoftwareCreate)
      }
    }

    //create
    let wallet = {
      mnemonic:data.mnemonic,
      username:data.username,
      password:data.password
    }
    //get master for seed
    let walletEth = await ethCrypto.generateWalletFromSeed(data.mnemonic)
    wallet.masterAddress = walletEth.masterAddress

    //create wallet files
    log.info("1 creating wallet: ",wallet)
    let resultCreate = await App.createWallet('software',wallet)
    return resultCreate
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export function onLogin(event, data) {
  let tag = TAG + " | onLogin | ";
  try {
    //
    if(!WALLET_HASH) throw Error("Wallet Hash not found! ")
    if(!data.password) throw Error("password not found! ")

    let isValid = bcrypt.compareSync(data.password, WALLET_HASH); // true
    if(isValid) {
      //close password
      WALLET_PASSWORD = data.password
      onStart(event, data)
    } else {
      log.error(tag," invalid password! ")
      //TODO send error msg over ipc invalid pw
    }
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}
