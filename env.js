GLOBAL.BigNumber = require('bignumber.js');
GLOBAL.keccak_256 = require('js-sha3').keccak_256;
GLOBAL.XHR2 = require('xhr2');
GLOBAL.request = require('sync-request');
GLOBAL.crypto = require('crypto');
GLOBAL._ = require('lodash');
GLOBAL.chalk = require('chalk');
GLOBAL.moment = require('moment');
GLOBAL.Augur = require('./augur');
GLOBAL.constants = require('./test/constants');
GLOBAL.augur = Augur;
GLOBAL.log = console.log;
GLOBAL.b = Augur.branches.dev;
GLOBAL.ballot=[ 2, 1.5, 1.5, 1, 1.5, 1.5, 1 ];
GLOBAL.accounts = [
    "0x639b41c4d3d399894f2a57894278e1653e7cd24c",
    "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b",
    "0x4a0cf714e2c1b785ff2d650320acf63be9eb25c6"
];

Augur.connect();

GLOBAL.c = Augur.coinbase;

GLOBAL.balance = function (account, branch) {
    account = account || Augur.coinbase;
    var balances = {
        cash: Augur.getCashBalance(account),
        reputation: Augur.getRepBalance(branch || Augur.branches.dev, account),
        ether: Augur.bignum(Augur.balance(account)).dividedBy(Augur.ETHER).toFixed()
    };
    log(chalk.cyan("Balances:"));
    log("Cash:       " + chalk.green(balances.cash));
    log("Reputation: " + chalk.green(balances.reputation));
    log("Ether:      " + chalk.green(balances.ether));
    return balances;
}

GLOBAL.balances = balance();
