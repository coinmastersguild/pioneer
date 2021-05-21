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
let WALLET_INIT = false
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

//
let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance']

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

export async function onPairKeepKey(event, data) {
  let tag = TAG + " | onPairKeepkey | ";
  try {
    log.info(tag,"data: ",data)
    let wallet = await Hardware.getPubkeys(blockchains)
    //init
    wallet.hardware = true
    wallet.type = 'keepkey'
    wallet.features = KEEPKEY.features
    console.log("wallet: ",wallet)
    //event.sender.send('navigation',{ dialog: 'Setup', action: 'open'})


    let resultPairKeepKey = await App.pairKeepkey(wallet,blockchains)

    //start wallet
    //TODO dont do this here?
    onStart(event, data)

    return resultPairKeepKey
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
        // let pioneerUrl = "http://127.0.0.1:9001/spec/swagger.json"
        let pioneerUrl = "https://pioneers.dev/spec/swagger.json"
        App.updateConfig({pioneerUrl});
      }
      if(!config.queryKey){
        let queryKey = uuidv4()
        App.updateConfig({queryKey});
      }
      if(!config.blockchains){
        App.updateConfig({blockchains});
      }
      return true
    } else {
      //create key/save to config
      await App.initConfig("english");
      let queryKey = uuidv4()
      App.updateConfig({queryKey});
      //pioneer server
      //TODO get from ENV? always remote?
      let pioneerUrl = "https://pioneers.dev/spec/swagger.json"
      App.updateConfig({pioneerUrl});
      App.updateConfig({spec:pioneerUrl});
      App.updateConfig({blockchains});
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
          if(!WALLET_INIT){
            log.info(tag,"Checkpoint5a Started Wallet!")
            //if wallet files?
            let walletFiles = await App.getWalletNames()
            log.info(tag,"walletFiles: ",walletFiles)
            if(walletFiles.length > 0){
              log.info(tag,"Checkpoint6a wallet ready")
              return {
                setup:true,
                success:true,
                result:"ready to start!"
              }
            } else {
              log.info(tag,"Checkpoint6b wallet failed to load")
              //event.sender.send('navigation',{ dialog: 'Setup', action: 'open'})
              //this doesnt seem to return?
              return {
                setup:false,
                success:false,
                result:"setup required! wallet not initialized"
              }
            }
          } else {
            log.info(tag,"Checkpoint5b Wallet already started! will not re-attempt")
          }
        } else {
          log.info(tag,"Checkpoint4b Username NOT found! Need user input")
          //Create username
          event.sender.send('navigation',{ dialog: 'SetupUsername', action: 'open'})
          return {
            success:false,
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
          return {
            setup:false,
            success:false,
            result:"setup required! network not found!"
          }
        } else {
          log.info(tag,"Checkpoint3b invalid config :( trying again")
          await initConfig()
          return {
            setup:false,
            success:false,
            result:"setup required! missing config params"
          }
        }
      }
    } else {
      await initConfig()
      return {
        setup:false,
        success:false,
        result:"setup required!"
      }
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

    let allKeepKeys = await Hardware.listKeepKeys()
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

    let allKeepKeys = await Hardware.listKeepKeys()
    event.sender.send('allKeepKeys',{ allKeepKeys })
    log.info(tag,"allKeepKeys: ",allKeepKeys)

    let info = await Hardware.info()
    event.sender.send('hardwareInfo',{ info })
    log.info(tag,"info: ",info)

    let state = await Hardware.state()
    event.sender.send('hardwareState',{ state })
    event.sender.send('hardwareStatus',{ state })
    log.info(tag,"state: ",state)

    if(parseInt(state.state) > 1){
      log.info(tag,"Connected to device!")
      //lockStatus
      let lockStatus = await Hardware.isLocked()
      event.sender.send('hardwareLockStatus',{ lockStatus })
      log.info("lockStatus: ",lockStatus)

      //if locked
      if(lockStatus){
        KEEPKEY_STATUS = 'locked'
        Hardware.displayPin(blockchains)
        //open pin
        event.sender.send('navigation',{ dialog: 'Pin', action: 'open'})
      } else {
        KEEPKEY_STATUS = 'unlocked'
        //is connected?
        let info = await Hardware.info()
        log.info("info: ",info)

        //check Is paired
        //TODO if not paired/ start pairing

        event.sender.send('deviceInfo',info)
      }
    }

    return KEEPKEY
  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function onStart(event,data) {
  let tag = TAG + " | onStart | ";
  try {
    if(!event) throw Error("Failed to pass ipc to app")
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
    delete config.isTestnet //kill flag with fire rabble

    //send config to ui
    event.sender.send('updateConfig',config)

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
      config.spec = "https://pioneers.dev/spec/swagger.json"
      config.urlSpec = "https://pioneers.dev/spec/swagger.json" // rabble
      config.wss = "wss://pioneers.dev"

      // config.wss = "ws://127.0.0.1:9001"
      // config.spec = "http://127.0.0.1:9001/spec/swagger.json"
      // config.urlSpec = "http://127.0.0.1:9001/spec/swagger.json" // rabble
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

    //TODO validate config?
    // let resultInit = await initConfig()

    let resultInit = await App.init(config)
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
    //event.sender.send('navigation',{ dialog: 'Connect', action: 'close'})

    let wallets = await App.getWallets()
    if(wallets.length === 0) throw Error("Failed to start wallet APP. 0 wallets")
    //set global
    WALLETS_LOADED = wallets
    let walletNames = await App.getWalletNames()
    WALLETS_NAMES = walletNames

    if(resultInit.wallets){
      log.info(tag,"registering wallets: ",resultInit.wallets)
      event.sender.send('updateWallets',resultInit.wallets)
    } else {
      throw Error("102: failed to init, failed to get wallets!")
    }


    //wallet events
    resultInit.events.on('message', async (request) => {
      console.log(tag,"*** message: ", request)
      switch(request.type) {
        case 'context':
          console.log(" **** PROCESS EVENT ****  request: ",request)
          event.sender.send('setContext',{ context: request.context })
          break
        case 'transfer':
          console.log(" **** PROCESS EVENT ****  request: ",request)
          // event.sender.send('navigation',{ dialog: 'Invocation', action: 'open'})
          // event.sender.send('setContextInvoke',{ context: request.context })
          break
        // case 'swap':
        //   console.log(" **** PROCESS EVENT ****  request: ",request)
        //   event.sender.send('setContext',{ context: request.context })
        //   break
        // case 'approve':
        //   console.log(" **** PROCESS EVENT ****  request: ",request)
        //   event.sender.send('setContext',{ context: request.context })
        //   break
        default:
          console.log("Unhandled type: ",request.type)
      }
      //if context

      //TODO messages
      //event.sender.send('navigation',{ dialog: 'Connect', action: 'close'})
    })

    //TODO block events per blockchain activated

    //txs TODO sub to username && subscribed usernames

    //requests Filter requests by privacy settings

    //globals


    //get user info
    let userInfo = await App.getUserInfo()
    if(!userInfo.context) throw Error("113: invalid user! missing context!")
    if(userInfo.context && userInfo.context !== WALLET_CONTEXT) {
      log.info(tag,"set context to remote")
      WALLET_CONTEXT = userInfo.context
      event.sender.send('setContext',{context:userInfo.context})
      let resultUpdateConextRemote = await App.setContext(userInfo.context)
      log.info(tag,"resultUpdateConextRemote: ",resultUpdateConextRemote)
    }


    //TODO is context pref in config?
    //redundant to above?
    // let contextName = await App.context()
    // console.log("contextName: ",contextName)
    // if(contextName && contextName !== WALLET_CONTEXT){
    //   log.info(tag,"Local context not matching remote! setting to local")
    //   WALLET_CONTEXT = userInfo.context
    //   event.sender.send('setContext',{context:userInfo.context})
    //   let resultUpdateConextRemote = await App.setContext(contextName)
    //   log.info(tag,"resultUpdateConextRemote: ",resultUpdateConextRemote)
    // }

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
      log.info(tag,"initStatus: ",initStatus)
      if(initStatus){
        let userInfo = await App.getUserInfo()
        log.info(tag,"userInfo: ",userInfo)
        if(userInfo){
          if(userInfo.context){
            event.sender.send('setContext',{context:userInfo.context})
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

        //wallets
        let wallets = await App.getWallets()
        if(wallets){
          WALLETS_LOADED = wallets
          log.info(tag,"registering wallets: ",wallets)
          event.sender.send('updateWallets',wallets)
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

export async function setContext(event, data) {
  let tag = TAG + " | setContext | ";
  try {
    log.info(tag,"data: ",data)
    if(WALLETS_NAMES.indexOf(data.context) >= 0){
      log.info(tag,"valid context")
      let resultCreate = await App.setContext(data.context)
      return resultCreate
    } else {
      log.error(tag,"invalid context offline: ",data.context)
      //not a change
      throw Error("Invalid context")
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

export async function buildTransaction(event, data) {
  let tag = TAG + " | buildTransaction | ";
  try {
    log.info(tag,"data: ",data)
    //get invocation

    //TODO validate type and fields

    let invocation = await App.getInvocation(data.invocationId)
    log.info(tag,"invocation: ",invocation)

    if(!invocation.type) invocation.type = invocation.invocation.type

    let context
    if(!data.context){
      context = WALLET_CONTEXT
    }
    if(!context) {
      log.error("context: ",context)
      log.error("Available: ",Object.keys(WALLETS_LOADED))
      throw Error("103: could not find context!")
    }
    let walletContext = WALLETS_LOADED[context]
    log.info(tag,"walletContext: ",walletContext.walletId)

    switch(invocation.type) {
      case 'transfer':
        console.log(" **** BUILD TRANSACTION ****  invocation: ",invocation.invocation)

        //TODO validate transfer object

        let transferUnSigned = await walletContext.buildTransfer(invocation.invocation)
        log.info(" **** RESULT TRANSACTION ****  transferUnSigned: ",transferUnSigned)

        let invocationId = invocation.invocationId
        let updateBody = {
          invocationId,
          invocation,
          unsignedTx:transferUnSigned
        }
        log.info(tag,"updateBody: ",updateBody)

        //update invocation remote
        let resultUpdate = await App.updateInvocation(updateBody)
        log.info(tag,"resultUpdate: ",resultUpdate)

        //push update to sign tab
        event.sender.send('transactionBuilt', {invocationId,invocation,unsignedTx:transferUnSigned,resultUpdate})

        break
      case 'approve':
        console.log(" **** BUILD SWAP ****  invocation: ",invocation.invocation)
        let approvalSigned = await walletContext.buildApproval(invocation.invocation)
        console.log(" **** RESULT TRANSACTION ****  approvalSigned: ",approvalSigned)
        break
      case 'swap':
        console.log(" **** BUILD SWAP ****  invocation: ",invocation.invocation)
        let swapSigned = await walletContext.buildSwap(invocation.invocation)
        console.log(" **** RESULT TRANSACTION ****  swapSigned: ",swapSigned)
        break
      default:
        console.error("Unhandled type: ",invocation.type)
        console.error("Unhandled: ",invocation)
    }

    //types
    //transfer (all coins + eth (except swaps)
    //approve
    //swap


    // let resultBuild = await App.buildTransfer(await App.context(),data.invocationId)
    //
    // return resultBuild

  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function approveTransaction(event, data) {
  let tag = TAG + " | approveTransaction | ";
  try {
    //get invocation

    let invocation = await App.getInvocation(data.invocationId)
    log.info(tag,"invocation: ",invocation)

    //
    let context
    if(!data.context){
      context = WALLET_CONTEXT
    }
    if(!context) {
      log.error("context: ",context)
      log.error("Available: ",Object.keys(WALLETS_LOADED))
      throw Error("103: could not find context!")
    }
    let walletContext = WALLETS_LOADED[context]
    log.info(tag,"walletContext: ",walletContext.walletId)

    //get
    //if(invocation.unsignedTx.HDwalletPayload.coin === 'BitcoinCash') invocation.unsignedTx.HDwalletPayload.coin = 'BCH'

    //unsinged TX
    log.info(tag,"invocation.unsignedTx: ",JSON.stringify(invocation.unsignedTx))
    let signedTx = await walletContext.signTransaction(invocation.unsignedTx)

    //update invocation
    let invocationId = invocation.invocationId
    let updateBody = {
      invocationId,
      invocation,
      unsignedTx:invocation.unsignedTx,
      signedTx
    }

    //update invocation remote
    let resultUpdate = await App.updateInvocation(updateBody)
    log.info(tag,"resultUpdate: ",resultUpdate)

    //push update to sign tab
    event.sender.send('transactionSigned', {invocationId,invocation,unsignedTx:invocation.unsignedTx,signedTx,resultUpdate})

  } catch (e) {
    console.error(tag, "e: ", e);
    return {error:e};
  }
}

export async function broadcastTransaction(event, data) {
  let tag = TAG + " | broadcastTransaction | ";
  try {
    //get invocation

    let invocation = await App.getInvocation(data.invocationId)
    log.info(tag,"invocation: ",invocation)

    //
    let context
    if(!data.context){
      context = WALLET_CONTEXT
    }
    if(!context) {
      log.error("context: ",context)
      log.error("Available: ",Object.keys(WALLETS_LOADED))
      throw Error("103: could not find context!")
    }
    let walletContext = WALLETS_LOADED[context]
    log.info(tag,"walletContext: ",walletContext.walletId)

    //normalize
    if(!invocation.invocation.invocationId) invocation.invocation.invocationId = invocation.invocationId
    //override noBroadcast
    if(invocation.signedTx.noBroadcast) invocation.signedTx.noBroadcast = false

    let broadcastResult = await walletContext.broadcastTransaction(invocation.invocation.coin,invocation.signedTx)



    //update invocation
    let invocationId = invocation.invocationId
    let updateBody = {
      invocationId:invocation.invocation.invocationId,
      invocation:invocation.invocation,
      unsignedTx:invocation.unsignedTx,
      signedTx:invocation.signedTx,
      broadcastResult
    }
    log.info(tag,"updateBody: ",updateBody)
    //update invocation remote
    let resultUpdate = await App.updateInvocation(updateBody)
    log.info(tag,"resultUpdate: ",resultUpdate)

    //push update to sign tab
    event.sender.send('transactionSigned', {
      invocationId,
      invocation,
      unsignedTx:invocation.unsignedTx,
      signedTx:invocation.signedTx,
      broadcastResult,
      resultUpdate
    })

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

// export function onLogin(event, data) {
//   let tag = TAG + " | onLogin | ";
//   try {
//     //
//     if(!WALLET_HASH) throw Error("Wallet Hash not found! ")
//     if(!data.password) throw Error("password not found! ")
//
//     let isValid = bcrypt.compareSync(data.password, WALLET_HASH); // true
//     if(isValid) {
//       //close password
//       WALLET_PASSWORD = data.password
//       onStart(event, data)
//     } else {
//       log.error(tag," invalid password! ")
//       //TODO send error msg over ipc invalid pw
//     }
//   } catch (e) {
//     console.error(tag, "e: ", e);
//     return {error:e};
//   }
// }
