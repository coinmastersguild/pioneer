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

        // const charting = await pioneer.RandomCharting();
        // console.log("charting: ", charting.data);
        
        //submit chart
        // let body = {
        //     "signer": "0x33b35c665496ba8e71b22373843376740401f106",
        //     "payload": "{\"type\": \"chart\", \"blockchain\": \"ethereum\"}",
        //     "signature": "0x2728da70e46d3e3ef73e9304e6447f20ae1ec0e3d4b63b9764f7db72df9cf8e112c93517f514e0c909cb9e8823637615130b41390f8b6802110e9bdf083a131e1c"
        // }
        //
        // let result = await pioneer.SubmitChart(body);
        // console.log("result: ",result.data)
        // const chart = await pioneer.SubmitChart();
        
    } catch (e) {
        console.error(e);
    }
};

runTest();
