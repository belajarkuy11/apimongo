let crypto = require('crypto'); 
let fs = require('fs');

let privPem = fs.readFileSync('./security/key/newprivate.key');
let privateKey = privPem.toString('ascii');

let pubPem = fs.readFileSync('./security/key/pub.key');
let pubKey = pubPem.toString('ascii');

function Sec(){}

Sec.prototype.sign = function (buffData) {
    let sig = crypto.createSign('RSA-SHA256').update(buffData).sign({
        key: privateKey//,
        //passphrase: 'ardicakep'
    }, 'hex');

    return sig
}

Sec.prototype.ver = function (buffData, signature) {
    let verifier = crypto.createVerify('RSA-SHA256').update(buffData)
    let publicKeyBuf = Buffer.from(pubKey, 'utf-8')
    let signatureBuf = Buffer.from(signature, 'hex')
    const result = verifier.verify(pubKey, signatureBuf)
    return result
}

module.exports = Sec