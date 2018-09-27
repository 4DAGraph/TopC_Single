
var date = new Date();
var config = require('../config/default.js');
var CICport = config.cicport;
var GUCport = config.gucport;
//console.log(CICport)
var Tx = require('ethereumjs-tx');
var address = require("./address.json")
var toHex = require('./bigIntToHex.js');
var bitcoin = require('../bitcoinjs')
var request = require('request');
var encrypto = require('../../homework/firstclass');

//var litecore = require('litecore-lib')
//var bitcoincashjs = require("bitcoincashjs")

module.exports = {
        signETH: function cc_sign(req, res, next) {
                console.log(date + ":CC_signInformation");
                console.log(req.params.rawtx);
                var tx = new Tx(JSON.pnoarse(req.params.rawtx));
                var privateKey = new Buffer(req.params.privateKey, 'hex')

                tx.sign(privateKey);

                var serializedTx = tx.serialize();
                var result = '{"signText":"' + serializedTx.toString('hex') + '","tx":' + req.params.rawtx + '}';
                console.log(date + ":CC_signInformation:success");
                res.send(result);
        },
        signNewETH: function signNewETH(req, res, next, rawtx) {

                console.log(date + ":CC_signInformation");
                console.log(rawtx);
                console.log("test:" + rawtx.gasPrice)
                var tx = new Tx(rawtx);
                //var privateKey = new Buffer(req.body.privateKey, 'hex')
                var privateKey = req.body.privateKey
                if (req.body.encry != undefined && req.body.encry == true){
					privateKey = encrypto.decrypt(privateKey)
                }
				var privateKey = new Buffer(privateKey, 'hex')
				//var privateKey = new Buffer(req.params.privateKey, 'hex')
                tx.sign(privateKey);

                var serializedTx = tx.serialize();
                var result = '{"signText":"' + serializedTx.toString('hex') + '","tx":' + req.params.rawtx + '}';
                console.log(date + ":CC_signInformation:success");
                console.log(result)
                res.send(result);
                //}
        },
        signUSDT: function signUSDT(req, res, next) {
                console.log("signusdt")
                var priv = req.body.privatekey
                var tx = req.body.tx
                var unspend = req.body.unspend
                //console.log(priv)
                var keyPair = bitcoin.ECPair.fromWIF(priv)
                console.log("")
                var txb = new bitcoin.TransactionBuilder()
                //console.log(unspend);
                unspend.forEach(function (result) {
                        txb.addInput(result.txid, result.value)
                        //console.log(result.txid)
                        //console.log(result.value)
                })
                //console.log(result.txid)
                //console.log(result.value)
                var usdtvalue = toHex.toHex(tx[0].value);
                usdtvalue = toHex.paddingLeft(usdtvalue, 16)
                //console.log(1)
                var data = Buffer.from('6f6d6e69000000000000001f' + usdtvalue, 'hex')
                var dataScript = bitcoin.script.nullData.output.encode(data)
                //console.log(2)
                //console.log(tx)
                txb.addOutput(dataScript, 0)
                //console.log(3)
                //console.log(tx[1].address)
                txb.addOutput(tx[1].address, tx[1].value)
                //console.log(4)
                txb.addOutput(tx[0].address, 546)
                //txb.addOutput(tx[1].address,tx[1].value)
                //console.log(3)
                /*
                                tx.forEach(function(result){
                                       txb.addOutput(result.address,result.value)
                                })
                */
                txb.sign(0, keyPair)
                //console.log(4)
                //console.log('{"signText":"'+txb.build().toHex()+'"}')
                res.send('{"signText":"' + txb.build().toHex() + '"}')
        },

        signBTC: function signBTC(req, res, next) {	
                console.log("==============================================================")
				console.log("date :"+date);
				console.log("method:btc")
				console.log("req.params")
				console.log(req.params)
				console.log("req.body")
				console.log(req.body)
				var priv = req.body.privatekey
				if (req.body.encry != undefined && req.body.encry == true){
					priv = encrypto.decrypt(priv)
				}
				var tx = req.body.tx
                var unspend = req.body.unspend
                var keyPair = bitcoin.ECPair.fromWIF(priv/*,{compressed: false}*/)
				if(req.body.compressed != undefined)
					keyPair["compressed"] = req.body.compressed
				//console.log(keyPair)
				//keyPair = keyPair.privateKey.toString('hex')
				//console.log(keyPair)
				//keyPair = bitcoin.ECPair.fromPrivateKey(keyPair,{compressed: false})
				var txb = new bitcoin.TransactionBuilder()
                //txb.addInput('6c215b731831dceed69f2a36312ef1b305df8ad3af57df37609b571b9727e42d', 0)
                //console.log(123)
                console.log("params correct")
                unspend.forEach(function (result) {
                        txb.addInput(result.txid, result.value)
                        //txb.addInput('b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c', 6)
                        console.log(result.txid)
                        //console.log(result.value)
                })
                //txb.addInput('b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c', 6)
                tx.forEach(function (result) {
                        txb.addOutput(result.address, result.value)
                        console.log(result)
                })
                //txb.sign(0, keyPair) 
                console.log("gospend")
				var inputs_t = 0;
                unspend.forEach(function (result) {
                        //console.log()
                        txb.sign(inputs_t, keyPair);
                        inputs_t = inputs_t + 1;
                })
				
                //console.log(txb.build())
                var re = '{"signText":"' + txb.build().toHex() + '"}'
                //console.log(123)
                res.send(re)
                //res.send('{"signText":"'+txb.build().toHex()+'"}')
        },

        signBTCrelay: function signBTCrelay(req, res, next) {
				console.log("==============================================================")
				console.log("date :"+date);
				console.log("method:btcRelay")
				console.log("req.param:")
				console.log(req.params)
				console.log("req.body:")
				console.log(req.body)
                var priv = req.body.privatekey
                if (req.body.encry != undefined && req.body.encry == true){
                    priv = encrypto.decrypt(priv)
                }
                var tx = req.body.tx
                var unspend = req.body.unspend
                var keyPair = bitcoin.ECPair.fromWIF(priv)
                var txb = new bitcoin.TransactionBuilder()
                var cicAddress = req.body.cicAddress
				console.log("params correct");
                if(req.body.compressed != undefined)
					keyPair["compressed"] = req.body.compressed
                unspend.forEach(function (result) {
                        txb.addInput(result.txid, result.value)
                        console.log(result.txid)
                })
				//console.log("111")
                tx.forEach(function (result) {
						console.log("tx:",tx)
						console.log("go:",parseInt(result.value))
                        txb.addOutput(result.address, parseInt(result.value))
                        console.log(result)
						console.log("unspend")
                })
				console.log("gospend")
                //var usdtvalue = toHex.toHex(10000);
                //usdtvalue = toHex.paddingLeft(usdtvalue, 16)
				console.log("++++++++++cictest:"+cicAddress)
                var data = Buffer.from('c2cccccc0000000000000001' + cicAddress, 'hex')
                var dataScript = bitcoin.script.nullData.output.encode(data)
                txb.addOutput(dataScript, 0)
                var inputs_t = 0;
                unspend.forEach(function (result) {
                        txb.sign(inputs_t, keyPair);
                        inputs_t = inputs_t + 1;
                })
                var re = '{"signText":"' + txb.build().toHex() + '"}'
                res.send(re)
        },
        /*signLTC: function signLTC(req, res, next) {
                console.log(1)
                var privateKey = new litecore.PrivateKey(req.body.privatekey);

                var publicKey = privateKey.toPublicKey();
                var address = privateKey.toAddress()
                var tx = req.body.tx
                var unspend = req.body.unspend

                var utxo = []

                unspend.forEach(function (result) {
                        console.log(result)
                        utxo.push({
                                txId: result.txid,
                                outputIndex: result.value, 1111
                                address : address,
                                script: new litecore.Script(address).toHex(),
                                satoshis: 20000
                        })
                })
                console.log(3)
                var transaction = new litecore.Transaction()
                transaction.from(utxo, publicKey)
                console.log(4)
                tx.forEach(function (result) {
                        console.log(result.value)
                        transaction.to(result.address, result.value)
                        console.log(6)
                })
                console.log(5)
                transaction.sign(privateKey);
                var re = '{"signText":"' + transaction + '"}'
                console.log(re)
                res.send(re)
        },
        signBCH: function signBCH(req, res, next) {
                console.log(1)
                var privateKey = new bitcoincashjs.PrivateKey(req.body.privatekey);

                var publicKey = privateKey.toPublicKey();
                var address = privateKey.toAddress()
                var tx = req.body.tx
                var unspend = req.body.unspend
                var utxo = []

                unspend.forEach(function (result) {
                        console.log(result)
                        utxo.push({
                                txId: result.txid,
                                outputIndex: result.value,
                                address: address,
                                script: new bitcoincashjs.Script(address).toHex(),
                                satoshis: 20000
                        })
                })
                console.log(3)
                var transaction = new bitcoincashjs.Transaction()
                transaction.from(utxo, publicKey)
                console.log(4)
                tx.forEach(function (result) {
                        console.log(result.value)
                        transaction.to(result.address, result.value)
                        console.log(6)
                })
                console.log(5)
                transaction.sign(privateKey);
                var re = '{"signText":"' + transaction + '"}'
                console.log(re)
                res.send(re)
        },*/

        newSignAll: function newSignAll(req, res, next) {
                //console.log(req.body.token);
                //console.log("test3"+req.params.rawtx)
                //console.log(rawtx.to);
                //console.log(rawtx.to)
				console.log("param:"+JSON.stringify(req.params))
				console.log("body:"+JSON.stringify(req.body))
                var rawtx = JSON.parse(req.params.rawtx);
                console.log("rawtx: "+rawtx)
				console.log("test10" + rawtx.gasPrice)
                if (req.body.to == undefined) {
                        req.params.gasPrice = rawtx.gasPrice
                        req.params.gasLimit = rawtx.gasLimit
                        req.params.nonce = rawtx.nonce
                        req.params.to = rawtx.to
                        console.log(req.params.to);
                        req.params.value = rawtx.value
                }
                if ((req.body.token == "eth" || req.body.token == undefined) && req.body.contractAddress == undefined) {
						console.log("==============================================================")
						console.log("date :"+date);
						console.log("method:eth")

                        console.log(date + ":HC_signInformationIn");
                        //const gasPrice = web3.eth.gasPrice;
                        const gasPriceHex = "0x" + toHex.toHex(req.params.gasPrice);
                        const gasLimitHex = "0x" + parseInt(req.params.gasLimit).toString(16);
                        const nonce = req.params.nonce;
                        const nonceHex = "0x" + parseInt(nonce).toString(16);
                        var rawTx = {
                                nonce: nonceHex,
                                gasLimit: gasLimitHex,
                                to: req.params.to,
                                value: parseInt(req.params.value),
                                gasPrice: gasPriceHex
                        }
						console.log("rawTx : ")
                        console.log(rawTx)
                        console.log(date + ":HC_signInformationIn-success");
                        return rawTx;
                }


                if ((req.body.token == "eth" && req.body.token != undefined) && req.body.contractAddress != undefined) {
		                console.log("==============================================================")
				        console.log("date :"+date);
						console.log("method:eth_contract")
                        
						console.log(date + ":HC_signInformationIn");
                        //const gasPrice = web3.eth.gasPrice;
                        const gasPriceHex = "0x" + parseInt(req.params.gasPrice).toString(16);
                        const gasLimitHex = "0x" + parseInt(req.params.gasLimit).toString(16);
                        const nonce = req.params.nonce;
                        const nonceHex = "0x" + parseInt(nonce).toString(16);
                        var func = "0xa9059cbb000000000000000000000000"
                        
                        var to = req.params.to
                        var amount = toHex.toHex(req.params.value.toString())//parseInt(req.params.value).toString(16)
                        var input = func + to.substr(2) + paddingLeft(amount, 64);
                        var rawTx = {
                                nonce: nonceHex,
                                gasLimit: gasLimitHex,
                                to: req.body.contractAddress,
                                value: 0,
                                input: input,
                                gasPrice: gasPriceHex
                        }
						console.log("rawTx : ")
                        console.log(rawTx)
                        console.log(date + ":HC_signInformationIn-success");
                        console.log("top")
                        //console.log(input)
                        //console.log(rawTx);
                        return rawTx;
                        function paddingLeft(str, lenght) {
                                if (str.length >= lenght)
                                        return str;
                                else
                                        return paddingLeft("0" + str, lenght);
                        }
                }
        },
        newSign: function newSign(req, res, next) {
                console.log(req.body.token);
                if (req.body.token == "eth" || req.body.token == undefined) {
                        console.log(date + ":HC_signInformationIn");
                        //const gasPrice = web3.eth.gasPrice;
                        //console.log(123);
                        const gasPriceHex = "0x" + toHex.toHex(req.params.gasPrice);
                        const gasLimitHex = "0x" + parseInt(req.params.gasLimit).toString(16);
                        const nonce = req.params.nonce;
                        const nonceHex = "0x" + parseInt(nonce).toString(16);
                        var rawTx = {
                                nonce: nonceHex,
                                gasLimit: gasLimitHex,
                                to: req.params.to,
                                value: parseInt(req.params.value),
                                gasPrice: gasPriceHex
                        }
                        console.log(date + ":HC_signInformationIn-success");
                        res.send(rawTx);
                }


                if (req.body.token != "eth" && req.body.token != undefined) {
                        console.log(date + ":HC_signInformationIn");
                        //const gasPrice = web3.eth.gasPrice;

                        const gasPriceHex = "0x" + parseInt(req.params.gasPrice).toString(16);

                        const gasLimitHex = "0x" + parseInt(req.params.gasLimit).toString(16);

                        const nonce = req.params.nonce;

                        const nonceHex = "0x" + parseInt(nonce).toString(16);

                        var func = "0xa9059cbb000000000000000000000000"




                        var to = req.params.to

                        var amount = toHex.toHex(req.params.value)//parseInt(req.params.value).toString(16)
                        //console.log(req.params.value);
                        //console.log(amount);
                        //console.log(toHex.toHex(req.params.value))
                        var input = func + to.substr(2) + paddingLeft(amount, 64);

                        var rawTx = {

                                nonce: nonceHex,

                                gasLimit: gasLimitHex,

                                to: address[req.body.token],

                                value: 0,

                                input: input,

                                gasPrice: gasPriceHex
                        }
                        console.log(date + ":HC_signInformationIn-success");
                        //res.send(rawTx);
                        function paddingLeft(str, lenght) {
                                if (str.length >= lenght)
                                        return str;
                                else
                                        return paddingLeft("0" + str, lenght);
                        }
                }
        },
        signCIC: function signCIC(req, res, next) {
			console.log("==============================================================")
			console.log("date :"+date);
			console.log("method:cic_sign")
			console.log("req.param:")
			console.log(req.params)
			console.log("req.body:")
			console.log(req.body)

            var PrivateKey = req.body.PrivateKey
			if (req.body.encry != undefined && req.body.encry == true){
                PrivateKey = encrypto.decrypt(PrivateKey)
            }
			if (req.body.token == "cic"||req.body.token == undefined){
				var PortSelect = CICport
			}
			else if (req.body.token == "guc"){
				var PortSelect = GUCport
			}
			else{
				res.send("token error")
			}
            //function CICsign2(fee, address, outbtr, outcoin, nonce, type, input, PrivateKey) {

            //var aaaa = '{ "method": "signTransaction", "param": [{ "fee": "' + fee + '", "to": "' + address + '", "out": {"' + outbtr + '": "' + outcoin + '" }, "nonce": "' + nonce + '", "type": "' + type + '", "input": "' + input + '" }, "' + PrivateKey + '"] }'
            var CICsignParam = '{ "method": "signTransaction","param": [	{ "fee": "' + req.body.fee + '", "to": "' + req.body.address + '", "out": {"' + req.body.coin + '": "' + req.body.balance + '" }, "nonce": "' + req.body.nonce + '", "type": "' + req.body.type + '", "input": "' + req.body.input + '"}, "' + PrivateKey + '"]}'
	       	console.log("CICsignParam : "+CICsignParam)
       		CICsignParam = JSON.parse(CICsignParam)
			console.log("Port : "+PortSelect)
            request.post(
				//'http://192.168.51.201:9000/',
                PortSelect,
                {
					json: CICsignParam
                },
                function (error, response, body) {
                    console.log(body)
                    res.send(body)
				}
            );
        }
}
