var sign = require("./sign.js")
var date = new Date();
var config = require('../config/default.js');
var bitcoin = require('../bitcoinjs')
var bitcoin = require('../balance')


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
	},
	getBalance_app: function getBalance_app(req, res, next) {
		balance.getBalance_app(req, res, next);
		/*
		console.log(date + ":getBalance");
		console.log(date + ":getBalance-success");
		res.send(web3.eth.getBalance(req.params.address));
		*/
	}

}





































