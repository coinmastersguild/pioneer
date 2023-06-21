// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey: 'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
};

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        // const user = await pioneer.User();
        // console.log("user: ", user.data);

        // let query = "How much ETH I got?"
        // let result = await pioneer.Query({query});
        // console.log("result: ",result.data)

        // let name = "shapeshift"
        // let result = await pioneer.ListAppVotesByName({name});
        // console.log("result: ",result.data)

        let result = await pioneer.ListDevelopers({limit:100,skip:0});
        console.log("result: ",result.data)

        //public developer info
        // let address = '0x141d9959cae3853b035000490c03991eb70fc4ac'
        // let result = await pioneer.GetDevInfo({address});
        // console.log("result: ",result.data)


        // // Access the Pioneer methods and execute the API calls
        // console.log("pioneer: ", pioneer);
        // const globals = await pioneer.Globals();
        // console.log("globals: ", globals);
        //
        // const result = await pioneer.Invocations();
        // console.log("result: ", result);
        //
        // const redemptionBody = {
        //     publicAddress: "addy",
        //     signature: "sig",
        //     message: "msg"
        // };
        //
        // const redemption = await pioneer.Redemption(redemptionBody);
        // console.log("redemption: ", redemption.data);
        //
        // const user = await pioneer.User();
        // console.log("user: ", user.data);
        
        //get pioneers
        // const developers = await pioneer.ListDevelopers({limit:1000,skip:0});
        // console.log("developers: ", developers.data);

    } catch (e) {
        console.error(e);
    }
};

runTest();
