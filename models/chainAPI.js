var sign = require("./sign.js")
var date = new Date();
var config = require('../config/default.js');
var bitcoin = require('../bitcoinjs')
//var balance = require("./balance.js")
var crypto = require('crypto');
/*
var encrypt = function (data) {
    var aeskey = "gibofflinewallet"
    var iv = "walletofflinegib"
    var md5 = crypto.createHash("md5");
    md5.update(aeskey);
    var key = md5.digest('hex');

    var cipher = crypto.createCipheriv('aes-256-cbc', key, aesiv);
    var crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString('base64');
    return crypted;
};

var decrypt = function (crypted) {
    var aeskey = "gibofflinewallet"
    var iv = "walletofflinegib"
    var md5 = crypto.createHash("md5");
    md5.update(aeskey);
    var key = md5.digest('hex');

    crypted = new Buffer(crypted, 'base64').toString('binary');
    var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    var decoded = decipher.update(crypted, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    return decoded;
};*/

module.exports = {

	newSignAll: function newSignAll(req, res, next) {
		console.log(req.body.token)
		console.log(123)
		if (req.body.token == "eth") {
			var tx = sign.newSignAll(req, res, next);
			sign.signNewETH(req, res, next, tx);
		}

		if (req.body.token == "usdt") {
			sign.signUSDT(req, res, next);
		}

		if (req.body.token == "btc") {
			console.log("btcsign")
			sign.signBTC(req, res, next);
		}
		if (req.body.token == "btcrelay") {
			console.log("btcrelaysign")
			sign.signBTCrelay(req, res, next);
		}
		if (req.body.token == "ltc") {
			console.log("ltc")
			sign.signLTC(req, res, next);
		}
		if (req.body.token == "bch") {
			console.log("bch")
			sign.signBCH(req, res, next);
		}
		if (req.body.token == "cic"||req.body.token == "guc") {
			console.log("cic")
			sign.signCIC(req, res, next);
		}
	},
        //getBalance_app:  function getBalance_app(req, res, next){
          //      balance.getBalance_app(req, res, next);
                /*
                console.log(date+":getBalance");
                console.log(date+":getBalance-success");
                res.send(web3.eth.getBalance(req.params.address));
                */
       // }

}





































