// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey:'key:337e39de-3f45-40ac-ace0-d60684d2b92f',
    //queryKey: 'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
};

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        // let terminalInfo = await pioneer.BanklessInfo()
        // console.log("terminalInfo: ",terminalInfo.data)

        // let terminalName = "ALPHA_BANKLESS_1"
        // let terminalInfo = await pioneer.TerminalPrivate({terminalName})
        // console.log("terminalInfo: ",terminalInfo.data)

        let terminalName = "ALPHA_BANKLESS_1"
        let terminalInfo = await pioneer.TerminalPublic({terminalName})
        console.log("terminalInfo: ",terminalInfo.data)

        // let terminal = {
        //     terminalId:"terminal:1",
        //     terminalName:"test terminal",
        //     tradePair: "USD_DAI",
        //     lastRate:"0.94",
        //     pubkey:"0x651982e85D5E43db682cD6153488083e1b810798",
        //     fact:"",
        //     location:[ 4.5981, -74.0758 ]
        // }
        // let result = await pioneer.SubmitTerminal()
        // console.log("result: ",result)

        //create LP add
        // let lpAdd = {
        //     terminalName:"ALPHA_BANKLESS_1",
        //     address: "0xC3aFFff54122658b89C31183CeC4F15514F34624",
        //     type:"lpAddAsym"
        // }
        // let result = await pioneer.StartSession(lpAdd)
        // console.log("result: ",result)
        


    } catch (e) {
        console.error(e);
    }
};

runTest();
