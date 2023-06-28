// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey:'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
    //queryKey: 'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
};

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        // const user = await pioneer.User();
        // console.log("user: ", user.data);

        // const uncharted = await pioneer.Uncharted();
        // console.log("uncharted: ", uncharted.data);

        const charting = await pioneer.RandomCharting();
        console.log("charting: ", charting.data);

    } catch (e) {
        console.error(e);
    }
};

runTest();
