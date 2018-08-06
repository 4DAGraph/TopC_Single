var express = require('express');
var router = express.Router();

var chainAPI = require('../models/chainAPI');
var mnemonic = require('../models/mnemonic');

router.post("/account",mnemonic.account);
router.get("/accountQT/:amount",mnemonic.accountQT);
router.post("/newSignAll/:privateKey/:rawtx",chainAPI.newSignAll);

router.post("/CICBroadcast",mnemonic.CICBroadcast);

router.post("/keyToAddress",mnemonic.keyToAddress)

//router.get("/getBalance_app/:address",chainAPI.getBalance_app);
///測試專用


module.exports = router;
