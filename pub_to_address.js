const prompt = require('prompt');
const ec = require('elliptic').ec('secp256k1');
const eth =require('ethereumjs-util');
prompt.start();

prompt.get(['bip32publicKey'], function (err, result) {
    let bip32publicKey = result.bip32publicKey;
    console.log("Bip32publicKey: " + bip32publicKey);
    console.log("ETH address: " + bip32PublicToEthereumPublic(Buffer.from(bip32publicKey, 'hex')).toString('hex'));
});


function bip32PublicToEthereumPublic(pubKey) {
    let key = ec.keyFromPublic(pubKey).getPublic().toJSON();
    let correctPublicKey = Buffer.concat([padTo32(Buffer.from(key[0].toArray())), padTo32(Buffer.from(key[1].toArray()))]);

    return eth.publicToAddress(correctPublicKey);
}

function padTo32(msg) {
    while (msg.length < 32) {
        msg = Buffer.concat([new Buffer([0]), msg]);
    }
    return msg;
}
