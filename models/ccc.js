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


                var bitcoinprivateKey = new bitcoin.PrivateKey("L5oBKvPuqWwckm6QHfe7jrqwioL3mnnyHqRvZ9JFm8r68Zq56G29");
                var bitcoinAddress = bitcoinprivateKey.toAddress().toString();
                var bitcoinKey = bitcoinprivateKey.toString()
				console.log(bitcoinprivateKey.toWIF());
                console.log(bitcoinAddress)
				console.log(bitcoinprivateKey)
				

                var bitcoinprivateKey1 = new bitcoin.PrivateKey("ffea96f4c8910006bdb25eb908b00b4f647b4e3f9ee9571c1f89121e9180f585");
                var bitcoinAddress1 = bitcoinprivateKey1.toAddress().toString();
                var bitcoinKey1 = bitcoinprivateKey.toString()
				console.log(bitcoinprivateKey1.toWIF());
                console.log(bitcoinAddress1)
				console.log(bitcoinprivateKey1)				

				