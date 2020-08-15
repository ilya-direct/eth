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
        name: 'mnenonic',
        hidden: true
    }
];
prompt.start();

prompt.get(properties, function (err, result) {
    if (err) {
        console.log("Failed: " + err);
        return 1;
    }

    let mnemonic = result.mnenonic;
    let walletNumber = result.walletNumber;

    let type = 0; // 0 - public, 1 = private (публичный аккаунт или личный)

    console.log("Mnemonic: '" + mnemonic.substr(0, 6) + ".." + mnemonic.substr(-6, 6) + "'");

    if (!bip39.validateMnemonic(mnemonic)) {
        console.log('Invalid mnemonic');
        return 1;
    }

    const seed = bip39.mnemonicToSeedSync(mnemonic);

    let path = "m/44'/60'/"+walletNumber + "'/" + type;

    const xpub = bip32
        .fromSeed(seed)
        .derivePath(path) // Ethereum
        .neutered() // удаляем приватную часть
        .toBase58();

    console.log("Derive path: " + path);
    console.log("xpub: " + xpub.toString('hex'));
});
