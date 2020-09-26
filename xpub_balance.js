const prompt = require('prompt');
const bip32 = require('bip32');
const ec = require('elliptic').ec('secp256k1');
const eth =require('ethereumjs-util');
var axios = require('axios');

prompt.start();

prompt.get(['xpub'], async function (err, result) {
    let xpub = result.xpub;
    console.log('xpub: ' + xpub);

    const bip32Addresses = bip32.fromBase58(xpub);

    let totalBalance = 0;
    console.log('i | Balance | Eth address');
    for (let i = 0; i< 20; i++) {
        let ethAddress = bip32PublicToEthereumPublic(bip32Addresses.derive(i).publicKey).toString('hex');
        let balance = await getBalanceInEth(ethAddress)
        console.log(i + " " + balance  + " 0x"  + ethAddress);

        totalBalance += balance;
    }

    // without toFixed side-affect: 0.4000000000000002
    console.log("Total " + totalBalance.toFixed(2));

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

async function getBalanceInEth(ethAddress) {
    try {
        let response = await axios({
            method: 'get',
            url: `https://api.blockcypher.com/v1/eth/main/addrs/${ethAddress}/balance`,
        });

        // 1 wei = 10^(-18) ETH (round 2 decimal precision)
        let resultResponse = response.data.balance;

        let eth = Math.floor(resultResponse / 10 ** 18 * 100) / 100

        return eth;
    } catch (error) {
        console.log("ERROR: " + error);

        return 0;
    }
}
