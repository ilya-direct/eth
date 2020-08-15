const prompt = require('prompt');
const bip32 = require('bip32');
const ec = require('elliptic').ec('secp256k1');
const eth =require('ethereumjs-util');

prompt.start();

prompt.get(['xpub'], function (err, result) {
    let xpub = result.xpub;
    console.log('xpub: ' + xpub);

    const bip32Addresses = bip32.fromBase58(xpub);

    console.log('i |   Eth address  |   Public key');
    for (let i = 0; i< 20; i++) {
        console.log(i + ' ' + bip32PublicToEthereumPublic(bip32Addresses.derive(i).publicKey).toString('hex') + ' ' + bip32Addresses.derive(i).publicKey.toString('hex'));
    }

});

function padTo32(msg) {
    while (msg.length < 32) {
        msg = Buffer.concat([new Buffer([0]), msg]);
    }
    return msg;
}

function bip32PublicToEthereumPublic(pubKey) {
    let key = ec.keyFromPublic(pubKey).getPublic().toJSON();
    let correctPublicKey = Buffer.concat([padTo32(Buffer.from(key[0].toArray())), padTo32(Buffer.from(key[1].toArray()))]);

    return eth.publicToAddress(correctPublicKey);
}
