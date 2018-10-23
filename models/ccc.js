var bip39 = require("bip39")
var randomBytes = require('randombytes')

var ran = randomBytes(128 / 8)

var cs = bip39.entropyToMnemonic(ran, bip39.wordlists.chinese_simplified)
var ct = bip39.entropyToMnemonic(ran, bip39.wordlists.chinese_traditional)
var j = bip39.entropyToMnemonic(ran, bip39.wordlists.japanese)
var k = bip39.entropyToMnemonic(ran, bip39.wordlists.korean)
var e = bip39.entropyToMnemonic(ran, bip39.wordlists.english)
console.log(bip39.validateMnemonic("fuc kkl iii"))
