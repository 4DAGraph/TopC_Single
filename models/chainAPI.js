var sign = require("./sign.js")
var date = new Date();
var config = require('../config/default.js');
var bitcoin = require('../bitcoinjs')


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
		if (req.body.token == "cic") {
			console.log("cic")
			sign.signCIC(req, res, next);
		}
	}

}





































