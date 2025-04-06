
const {redis,redisQueue,publisher} = require("../index")

let message = {
    queryKey:'adsfgdfgds3sdfsd'
}

publisher.publish('keepkey-support',JSON.stringify(message))
