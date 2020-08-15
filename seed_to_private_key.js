const prompt = require('prompt');
const bip32 = require('bip32');
const bip39 = require('bip39');

const properties = [
    {
        name: 'walletNumber',
        validator: /^[\d]+$/,
        warning: 'Enter wallet number (0..100)'
    },
    {
        name: 'addressNumber',
        validator: /^[\d]+$/,
        warning: 'Enter address number (0..100)'
    },
    {
        name: 'mnemonic',
        hidden: true
    },
];
prompt.start();

prompt.get(properties, function (err, result) {

    let mnemonic = result.mnemonic;

    let walletNumber = result.walletNumber;
    let type = 0; // 0 - public, 1 - private
    let addressNumber = result.addressNumber;


    console.log("Mnemonic: '" + mnemonic.substr(0, 6) + ".." + mnemonic.substr(-6, 6) + "'");
    if (!bip39.validateMnemonic(mnemonic)) {
        console.log('Invalid mnemonic');
        return 1;
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    let path =  "m/44'/60'/" + walletNumber + "'/" + type + "/" + addressNumber;
    const bip32Interface = bip32
        .fromSeed(seed)
        .derivePath(path);


    console.log("Derived path: " + path);
    console.log("Priv: " + bip32Interface.privateKey.toString('hex'));
    console.log("Pub:  " + bip32Interface.publicKey.toString('hex'));
});
