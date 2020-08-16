const prompt = require('prompt');
const EthereumTx = require('ethereumjs-tx').Transaction;

const properties = [
    {
        name: 'nonce',
        validator: /^[\d]+$/,
        warning: 'Transaction number (0..100)',
    },
    {
        name: 'toAddress',
        validator: /^0x[\da-fA-F]{40}$/,
        warning: 'Address starts with 0x',
    },
    {
        name: 'amountMiliEther',
        validator: /^[\d]+$/,
    },
    {
        name: 'gwei',
        validator: /^[\d]+$/,
    },
    {
        name: 'chain',
        validator: /^[\w]+$/,
    },
    {
        name: 'privateKey',
        hidden: true,
    }
];
prompt.start();

prompt.get(properties, function (err, result) {

    let nonce = result.nonce;
    let toAddress = result.toAddress;
    let weiSendValue = result.amountMiliEther * 10**15; // wei -> 10^(-18) ETH
    let Gwei = result.gwei;  //  Gwei * 21 * 10 ^(-6) ETH
    let chain = result.chain; // ropsten - 3,  mainnet - 1

    let privateKey = result.privateKey;

    let txParams = {
        nonce: '0x' + (nonce).toString(16),
        gasPrice: '0x' + (Gwei * (10**9)).toString(16),
        gasLimit: '0x' + (21000).toString(16), // Для обычной транзакции (21000)
        to: toAddress,
        value: '0x' + (weiSendValue).toString(16),
        data: '0x',
    };

    console.log("Send ETH: " + parseInt(txParams.value,16) * 10**(-18));
    let commision = (txParams.gasPrice * txParams.gasLimit) * (10 ** (-18));
    console.log('Tnx Fee: ' + commision + ' ETH');

    const tx = new EthereumTx(txParams, {
        chain: chain, // (ropsten или mainnet)
    });

    tx.sign(Buffer.from(privateKey, 'hex'));

    console.log("Signed Tnx: " + tx.serialize().toString('hex'));
    console.log("Sender Addr: " + tx.getSenderAddress().toString('hex'));
    console.log("Tnx hash: " + tx.hash().toString('hex'));
});
