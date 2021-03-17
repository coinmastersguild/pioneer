

const coinSelect = require('coinselect')




let selectedResults = coinSelect(utxos, targets, feeRate)
log.info(tag,"result coinselect algo: ",selectedResults)
