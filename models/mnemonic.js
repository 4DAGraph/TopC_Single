var date = new Date();
var bip39 = require("bip39")
var bip32 = require("bip32")
var bitcoin = require('bitcore-lib')
var HDKey = require('hdkey')
var bitcoinjs = require("bitcoinjs-lib")
var EthereumBip44 = require('ethereum-bip44');
var litecore = require('litecore');
var EC = require('elliptic').ec;
var BN = require('bn.js');
var ec = new EC('secp256k1');
const keccak256 = require('js-sha3').keccak256;
//var ethereum = require('ethereumjs-wallet')

const secp256k1 = require('secp256k1')
var sha256 = require("sha256")
var request = require('request');
var config = require('../config/default.js');
var CICport = config.cicport;
var GUCport = config.gucport;
var crypto = require('crypto');
var encrypto = require('../../homework/firstclass');

/*
var fs=require("fs");

var x = ["123"];

x.push(account());
console.log(x)
fs.writeFileSync("tmp.txt", x.toString())

struct AEStest {
	static let key = "gibofflinewallet"
	static let iv = "walletofflinegib"
}*/

module.exports = {


	account: function account(req, res, next) {
		//bitcoin
		console.log("==============================================================")
		console.log("date :"+date);
		console.log("method:account")
		if (req.body.mnemonic != undefined) {
			var mnemonic = req.body.mnemonic;
	        if (req.body.encry != undefined && req.body.encry == true){
		        mnemonic = encrypto.decrypt(mnemonic)
			}
		} else {
			var mnemonic = bip39.generateMnemonic()
		}
		var seed = bip39.mnemonicToSeedHex(mnemonic)
		var hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
		var HDkey = hdkey.privateExtendedKey
		var node = bip32.fromBase58(HDkey)
		var child = node.derivePath("m/44'/0'/0'/0/0")
		bitcoinKey = child.toWIF()
		
		console.log("HDkey generate done")

		var key = bitcoin.HDPrivateKey(HDkey);
		var wallet = new EthereumBip44(key);
		//ethereum
		var ethereumKey = wallet.getPrivateKey(0).toString('hex')
		var ethereumAddress = wallet.getAddress(0)
		var keyPair = bitcoinjs.ECPair.fromWIF(bitcoinKey)
		var bitcoinAddress = keyPair.getAddress()
		console.log("key pair generate done")
		//litecoin
		//var litecore = require('litecore');
		var privateKey = new litecore.PrivateKey(ethereumKey);
		var litecoinKey = privateKey.toWIF()
		var litecoinAddress = privateKey.toAddress().toString();
		console.log("ltc key generate done")

		var bitcoinprivateKey = new bitcoin.PrivateKey(ethereumKey);
		var btcAddress = bitcoinprivateKey.toAddress().toString();
		var btcKey = bitcoinprivateKey.toWIF()
		console.log("btc key generate done")

		var BufferprivateKey = Buffer.from(ethereumKey, 'hex');
		var G = ec.g; // Generator point
		var pk = new BN(BufferprivateKey); // private key as big number

		var pubPoint = G.mul(pk); // EC multiplication to determine public point

		var x = pubPoint.getX().toBuffer(); //32 bit x co-ordinate of public point
		var y = pubPoint.getY().toBuffer(); //32 bit y co-ordinate of public point 
		var publicKey = Buffer.concat([x, y])
		
		console.log("public key generate done")
		var bitcoinpublicKey = new bitcoin.PublicKey('04' + publicKey.toString('hex'));
		var bitcoinAddUnCompress = bitcoinpublicKey.toAddress().toString()

		var re = secp256k1.publicKeyCreate(Buffer.from(ethereumKey, "hex"), false).slice(1)
		//var cicAddress = "cx" + sha256("0x" + re.toString("hex")).substr(24, 64)
		var cicAddress = "cx" + sha256(re.toString("hex")).substr(24, 64)
		var gucAddress = "gx" + sha256(re.toString("hex")).substr(24, 64)
		//console.log(re.toString("hex"))
		var re = {
			"version": "0.01", "mnemonic": mnemonic, "HDkey": HDkey,
			"litecoin":
				{ "privateKey": litecoinKey, "address": litecoinAddress },
			"bitcoin":
				{ "privateKey": btcKey, "address": btcAddress, "UncompressAddress": bitcoinAddUnCompress },
			"ethereum":
				{ "privateKey": ethereumKey, "address": ethereumAddress },
			"cic":
				{ "privateKey": ethereumKey, "address": cicAddress },
			"guc":
				{ "privateKey": ethereumKey, "address": gucAddress }
		}
		//res.send(re);
		if(req.body.encry != undefined && req.body.encry == true){
			var stringre = JSON.stringify(re)
			var crypted = encrypto.encrypt(stringre)
			res.send({"eprivatekey":crypted})		
		}
		else{
			res.send(re);
		}
	},

	keyToAddress: function keyToAddress(req, res, next) {
        console.log("==============================================================")
        console.log("date :"+date);
        console.log("method:keytoaddress")
		var privateKey = req.body.privateKey
		if (req.body.encry != undefined && req.body.encry == true){
			privateKey = encrypto.decrypt(privateKey)
		}

		var bitcoinprivateKey = new bitcoin.PrivateKey(privateKey);
        
        //var LTCprivateKey = new litecore.PrivateKey("6760fa752de1a78d298b60a87ff28c5c9d3079fadce05db8d1f70501761e9890");
        //var litecoinAddress = LTCprivateKey.toAddress().toString();

		var privateKey = bitcoinprivateKey.toString()
		var privateKey = Buffer.from(privateKey, 'hex');

		var G = ec.g; // Generator point
		var pk = new BN(privateKey); // private key as big number

		var pubPoint = G.mul(pk); // EC multiplication to determine public point

		var x = pubPoint.getX().toBuffer(); //32 bit x co-ordinate of public point
		var y = pubPoint.getY().toBuffer(); //32 bit y co-ordinate of public point 

		var publicKey = Buffer.concat([x, y])
		console.log("public key generate done")
		//console.log("public key::" + publicKey.toString('hex'))
		//console.log(keccak256)
		const address = keccak256(publicKey) // keccak256 hash of  publicKey
		const buf2 = Buffer.from(address, 'hex');

		var bitcoinAddress = bitcoinprivateKey.toAddress().toString();//bitcoin address
		var bitcoinpublicKey = new bitcoin.PublicKey('04' + publicKey.toString('hex'));
		var bitcoinAddUnCompress = bitcoinpublicKey.toAddress().toString()


		var cicAddress = "cx" + sha256(publicKey.toString("hex")).substr(24, 64)
		var gucAddress = "gx" + sha256(publicKey.toString("hex")).substr(24, 64)
		console.log("address generate done")
		var re = {
			"publickey:":
				publicKey.toString('hex'),
			"EthereumAddress:":
				"0x" + buf2.slice(-20).toString('hex'),
			"BitcoinAddress:":
				bitcoinAddress,
			"BitcoinAddressUncompress:":
				bitcoinAddUnCompress,
			"CICAddress:":
				cicAddress,
            "guc:":
                gucAddress,
		}
		res.send(re);
	},

	accountQT: function accountQT(req, res, next) {
		var result = [];
		var times = 0;
		var keyAmounts = req.params.amount;
		//var type = req.params.type;
		function mn() {
			var mnemonic = bip39.generateMnemonic()
			var seed = bip39.mnemonicToSeedHex(mnemonic)
			var hdkey = HDKey.fromMasterSeed(new Buffer(seed, 'hex'))
			var HDkey = hdkey.privateExtendedKey
			var node = bip32.fromBase58(HDkey)
			var child = node.derivePath("m/44'/0'/0'/0/0")
			bitcoinKey = child.toWIF()
			var key = bitcoin.HDPrivateKey(HDkey);
			var keyPair = bitcoinjs.ECPair.fromWIF(bitcoinKey)
			var bitcoinAddress = keyPair.getAddress()
			//ethereum
			var wallet = new EthereumBip44(key);
			var ethereumKey = wallet.getPrivateKey(0).toString('hex')
			var ethereumAddress = wallet.getAddress(0)
			//var keyPair = bitcoinjs.ECPair.fromWIF(bitcoinKey)
			//var bitcoinAddress = keyPair.getAddress()
			//			console.log(ethereumAddress);
			//litecoin
			//var litecore = require('litecore');
			var privateKey = new litecore.PrivateKey(ethereumKey);
			//			console.log(privateKey)
			//privateKey = privateKey.toWIF();
			var litecoinAddress = privateKey.toAddress().toString();
			var litecoinKey = privateKey.toWIF();

			var BCCprivateKey = new bitcoin.PrivateKey();
			var BCCKey = BCCprivateKey.toWIF();
			var BCCpublicKey = BCCprivateKey.toPublicKey();
			var BCCAddress = BCCpublicKey.toAddress("mainnet").toString();
			var USDTprivateKey = new bitcoin.PrivateKey();
			var USDTKey = USDTprivateKey.toWIF();
			var USDTpublicKey = USDTprivateKey.toPublicKey();
			var USDTAddress = USDTpublicKey.toAddress("mainnet").toString();
			result.push({ "TypeID": 20, "coin": "USDT", "privateKey": USDTKey, "address": USDTAddress }, { "TypeID": 3, "coin": "bitcoincash", "privateKey": BCCKey, "address": BCCAddress }, { "TypeID": 2, "coin": "litecoin", "privateKey": litecoinKey, "address": litecoinAddress }, { "TypeID": 1, "coin": "bitcoin", "privateKey": bitcoinKey, "address": bitcoinAddress }, { type: 4, "coin": "ethereum", "privateKey": ethereumKey, "address": ethereumAddress })
		}
		loop()
		function loop() {
			mn();
			times++;
			console.log("keypublish:" + times)
			if (times != keyAmounts) {
				loop();
			}
		}
		res.send(result);
	},
	CICBroadcast: function CICBroadcast(req, res, next) {
        console.log("==============================================================")
        console.log("date :"+date);
        console.log("method:account")
        console.log("req.param:")
        console.log(req.params)
        console.log("req.body:")
        console.log(req.body)
        
		var PortSelect = CICport
        if (req.body.token == "guc"){
            var PortSelect = GUCport
        }
		console.log("port :"+PortSelect)
		console.log("param :"+Object.keys(req.body.param).length)		
		var CICbroadparam = req.body
		var CICtestparam ='{"method":"'+req.body.method+'",'+'"param":'+JSON.stringify(req.body.param)+'}'
		console.log("CICbroadparam :"+JSON.stringify({json:CICbroadparam})) 
		console.log("CICtestparam :"+JSON.stringify({json:JSON.parse(CICtestparam)}))
			request.post(
				PortSelect,
                /*{				
					//json: { "method": "sendTransaction", "param": [params.result] }
                },*/
				{json:CICbroadparam},
					function (error, response, body) {
                        if (!error && response.statusCode == 200) {
							console.log(body)
                            res.send(body)
                        }
                    }
            );
	}
}
/*
var keyPair = bitcoinjs.ECPair.fromWIF(bitcoinKey)
var address = keyPair.getAddress()
console.log(address)

*/
