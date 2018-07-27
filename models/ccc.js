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


var privateKey = 'be7f9dfe3c8f6c25eed21c0d292485cfad991e2bb2abb1a1c773b7130635eee1'

var privateKey = Buffer.from(privateKey, 'hex');
console.log(privateKey)
var G = ec.g; // Generator point
var pk = new BN(privateKey); // private key as big number

var pubPoint = G.mul(pk); // EC multiplication to determine public point

var x = pubPoint.getX().toBuffer(); //32 bit x co-ordinate of public point
var y = pubPoint.getY().toBuffer(); //32 bit y co-ordinate of public point 

var publicKey = Buffer.concat([x, y])

console.log("public key::" + publicKey.toString('hex'))
//console.log(keccak256)
const address = keccak256(publicKey) // keccak256 hash of  publicKey
const buf2 = Buffer.from(address, 'hex')

var bitcoinprivateKey = new bitcoin.PrivateKey(privateKey);
var bitcoinAddress = bitcoinprivateKey.toAddress().toString();//bitcoin address
var bitcoinpublicKey = new bitcoin.PublicKey('04' + publicKey.toString('hex'));
var bitcoinAddUnCompress = bitcoinpublicKey.toAddress().toString()
console.log('bitcoinAddUnCompress:' + bitcoinAddUnCompress)
console.log("Ethereum Adress:::" + "0x" + buf2.slice(-20).toString('hex')) // take lat 20 bytes as ethereum adress
console.log("Bitcoin Adress:::" + bitcoinAddress) // take lat 20 bytes as ethereum adress		

