var Web3 = require('web3');
var web3 = new Web3();
var fs = require('fs');
//var solc = require("solc");
const Wallet = require('ethereumjs-wallet');
var ethKeys = require("ethereumjs-keys");
var date = new Date();
var config = require('../config/default.js');
//var crypto = require('crypto');
var Tx = require('ethereumjs-tx');
var abi = require('./erc.json');
var request = require('request');
//var nodeConnect = 'https://mainnet.infura.io/metamask';
//var nodeConnect = 'http://'+config.nodeip+':'+config.rpcPort;
var nodeConnect = config.nodeRpc;
web3.setProvider(new web3.providers.HttpProvider(nodeConnect));
var address = require("./address.json")
module.exports = {
	getBalance: function getBalance(req, res, next) {
		console.log(req.query.token);
		if (req.query.token == "eth" || req.query.token == undefined) {
			console.log(date + ":getBalance");
			console.log(date + ":getBalance-success");
			res.send(web3.eth.getBalance(req.params.address));
		}
		if (req.query.token != "eth" && req.query.token != undefined) {
			console.log(date + ":Token");
			var CoursetroContract = web3.eth.contract(abi["abi"]);
			var Coursetro = CoursetroContract.at(address[req.query.token]);

			Coursetro.balanceOf(req.params.address, function (error, result) {
				if (!error) {
					//console.log(result)
					console.log(date + ":getTokenBalance-success");
					res.send(result);
				} else
					console.log(error);
			});
		}
	},
	getBalance_app: function getBalance(req, res, next) {
		console.log(req.query.token);
		if (req.query.token == "ETH" || req.query.token == undefined) {
			console.log(date + ":getBalance");
			console.log(date + ":getBalance-success");
			res.send({ "balance": web3.eth.getBalance(req.params.address), "code": 0, "message": "json" });
		}

		if (req.query.token != "ETH" && req.query.token != undefined && req.query.token != "BTC") {
			console.log(date + ":Token");
			var CoursetroContract = web3.eth.contract(abi["abi"]);
			var Coursetro = CoursetroContract.at(address[req.query.token]);
			Coursetro.balanceOf(req.params.address, function (error, result) {
				if (!error) {
					//console.log(result)
					console.log(date + ":getTokenBalance-success");
					res.send({ "balance": result, "code": 0, "message": "json" });
				} else
					console.log(error);
			});
		}

		//console.log(req.query.token)		
		if (req.query.token == "BTC" && req.query.token != undefined) {
			console.log("ttest");
			request.get('https://blockexplorer.com/api/addr/3D2oetdNuZUqQHPJmcMDDHYoqkyNVsFk9r', function (error, response, body) {
				//console.log(body)
				body = JSON.parse(body);
				body["code"] = 0
				body["balance"] = body["balanceSat"]

				//console.log(JSON.parse(body)["balance"])
				body["message"] = "json"
				res.send(body);
			});
		}
	}
}
