var express = require('express');
var router = express.Router();

var chainAPI = require('../models/chainAPI');
var mnemonic = require('../models/mnemonic');


router.post("/account",mnemonic.account);
router.get("/accountQT/:amount",mnemonic.accountQT);
router.post("/newSignAll/:privateKey/:rawtx",chainAPI.newSignAll);


router.post("/keyToAddress",mnemonic.keyToAddress)
///測試專用


module.exports = router;
