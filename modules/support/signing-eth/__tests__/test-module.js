/*


	sign and validate



 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let sign = require('../lib/index')

let TEST_SEED_ALL="all all all all all all all all all all all all"

let message = "wuddup"

let address = ""

// sign.sign(,message,process.env['SIGNING_PRIVKEY'])
//     .then(function(signature){
//         console.log("signature: ",signature)
//         //validate sig
//         let isValid = sign.validate(process.env['SIGNING_PUBKEY'],signature,message)
//         console.log(isValid)
//     })
