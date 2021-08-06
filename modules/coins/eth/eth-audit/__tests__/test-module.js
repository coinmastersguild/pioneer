

let receipt = require('../data/0x788165bb1d93ba0ab3d0abd69346c6b0f4ca4614cb5635779000f197f3c53eb7.info.json')

let audit = require("../lib/index")

console.log(receipt)
//
// //sablier proxy
// //sablier main
//
//
console.log(audit.auditReceipt('sablier (proxy)',receipt))
