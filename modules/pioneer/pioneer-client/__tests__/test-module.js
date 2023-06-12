// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey: 'key:public:2',
};

// Create an instance of the Pioneer class
const pioneer = new Pioneer(spec, config);

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        await pioneer.init();

        // Access the Pioneer methods and execute the API calls
        console.log("pioneer: ", pioneer);
        const globals = await pioneer.pioneer.Globals();
        console.log("globals: ", globals);

        const result = await pioneer.pioneer.Invocations();
        console.log("result: ", result);

        const redemptionBody = {
            publicAddress: "addy",
            signature: "sig",
            message: "msg"
        };

        const redemption = await pioneer.pioneer.Redemption(redemptionBody);
        console.log("redemption: ", redemption.data);

        const user = await pioneer.pioneer.User();
        console.log("user: ", user.data);
    } catch (e) {
        console.error(e);
    }
};

runTest();
