// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey: 'key:public:2',
};

// Define an async function to run the test
const runTest = async () => {
    try {
        // Create an instance of the Pioneer class
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        // const user = await pioneer.User();
        // console.log("user: ", user.data);

        //submit dapp
        let homepage = "https://etherscan.io/"
        let app = homepage
        //
        const dappInfo = await pioneer.SubmitUrl({homepage,app});
        console.log("dappInfo: ", dappInfo.data);

    } catch (e) {
        console.error(e);
    }
};

runTest();
