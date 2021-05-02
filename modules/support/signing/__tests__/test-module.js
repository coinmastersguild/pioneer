/*


	sign and validate



 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let sign = require('../lib/index')

console.log("Pubkey: ",process.env['SIGNING_PUBKEY'])
console.log("Privkey: ",process.env['SIGNING_PRIVKEY'])

let message = "wuddup"

sign.sign(process.env['SIGNING_PUBKEY'],message,process.env['SIGNING_PRIVKEY'])
    .then(function(signature){
        console.log("signature: ",signature)
        //validate sig
        let isValid = sign.validate(process.env['SIGNING_PUBKEY'],signature,message)
        console.log(isValid)
    })
