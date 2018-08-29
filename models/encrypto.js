var crypto = require('crypto');

module.exports ={
    encrypt : function (data) {
        var aeskey = "gibofflinewallet"
        var iv = "walletofflinegib"
        var md5 = crypto.createHash("md5");
        md5.update(aeskey);
        var key = md5.digest('hex');

        var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        var crypted = cipher.update(data, 'utf8', 'binary');
        crypted += cipher.final('binary');
        crypted = new Buffer(crypted, 'binary').toString('base64');
        return crypted;
    },

    decrypt : function (crypted) {
        var aeskey = "gibofflinewallet"
        var iv = "walletofflinegib"
        var md5 = crypto.createHash("md5");
        md5.update(aeskey);
        var key = md5.digest('hex');
        
		crypted = new Buffer(crypted, 'base64').toString('binary');
        var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }
}
