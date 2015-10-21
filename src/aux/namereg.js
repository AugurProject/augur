/**
 * Bindings for the Namereg contract:
     https://github.com/ethereum/dapp-bin/blob/master/registrar/GlobalRegistrar.sol
     https://github.com/ethereum/dapp-bin/blob/master/NatSpecReg/contract.sol
     https://github.com/ethereum/dapp-bin/blob/master/registrar/registrar.sol
Example:
 primary = eth.accounts[0];
 "0x05ae1d0ca6206c6168b42efcd1fbe0ed144e821b"

 globalRegistrarAddr = admin.setGlobalRegistrar("", primary);
 I0918 16:39:27.519950    4991 xeth.go:985] Tx(0x3b732dc5d4b6f3d1fd6f04867e7791024f3f456ee716c579ab0f92b3031c5289) created: 0x5d1479943c297d93bfc6cb8525d18fdff79cbb2b
 "0x3b732dc5d4b6f3d1fd6f04867e7791024f3f456ee716c579ab0f92b3031c5289"

 hashRegAddr = admin.setHashReg("", primary);
 I0918 16:39:27.523845    4991 xeth.go:985] Tx(0xfeb91d5fb23558d30a0a96bf9a0e92b87730a9e5ac849c82a2d1b2ec93383ff9) created: 0x02de4f01f7b16db565ad7c036faaf3b7bc39abbd
 "0xfeb91d5fb23558d30a0a96bf9a0e92b87730a9e5ac849c82a2d1b2ec93383ff9"

 urlHintAddr = admin.setUrlHint("", primary);
 I0918 16:39:32.450294    4991 xeth.go:985] Tx(0x64dc95cf6c758a4b2f0af657e39132d69839a63dac594408e8082c82c961a3e5) created: 0xadd008234f45e614800c2960de5779b70bac8922
 "0x64dc95cf6c758a4b2f0af657e39132d69839a63dac594408e8082c82c961a3e5"
 */

"use strict";

var utils = require("../utilities");

module.exports = function () {

    var augur = this;

    return {

        namereg: augur.tx.namereg,

        // register name
        reserve: function (name, onSent, onSuccess, onFailed) {
            // name: string
            var tx = utils.copy(this.namereg.reserve);
            var unpacked = utils.unpack(name, utils.labels(this.reserve), arguments);
            tx.params = unpacked.params;
            return augur.transact.apply(augur, [tx].concat(unpacked.cb));
        },

        // get name owner's address
        owner: function (name, callback) {
            // name: string
            var tx = utils.copy(this.namereg.owner);
            var unpacked = utils.unpack(name, utils.labels(this.owner), arguments);
            tx.params = unpacked.params;
            return augur.rpc.fire.apply(augur.rpc, [tx].concat(unpacked.cb));
        },

        // set name to address
        setAddress: function (name, address, primary, onSent, onSuccess, onFailed) {
            // address: ethereum address
            // name: string
            var tx = utils.copy(this.namereg.setAddress);
            var unpacked = utils.unpack(name, utils.labels(this.setAddress), arguments);
            tx.params = unpacked.params;
            return augur.transact.apply(augur, [tx].concat(unpacked.cb));
        },

        // get address from name
        addr: function (name, callback) {
            // name: string
            var tx = utils.copy(this.namereg.addr);
            var unpacked = utils.unpack(name, utils.labels(this.addr), arguments);
            tx.params = unpacked.params;
            return augur.rpc.fire.apply(augur.rpc, [tx].concat(unpacked.cb));
        },

        // get name from address
        name: function (address, callback) {
            // address: ethereum address
            var tx = utils.copy(this.namereg.name);
            var unpacked = utils.unpack(address, utils.labels(this.name), arguments);
            tx.params = unpacked.params;
            return augur.rpc.fire.apply(augur.rpc, [tx].concat(unpacked.cb));
        },

        // transfer name to a new owner
        transfer: function (name, newOwner, onSent, onSuccess, onFailed) {
            // name: string
            // newOwner: ethereum address
            var tx = utils.copy(this.namereg.transfer);
            var unpacked = utils.unpack(name, utils.labels(this.transfer), arguments);
            tx.params = unpacked.params;
            return augur.transact.apply(augur, [tx].concat(unpacked.cb));            
        },

        // give up ownership of a name
        disown: function (name, onSent, onSuccess, onFailed) {
            var tx = utils.copy(this.namereg.disown);
            var unpacked = utils.unpack(name, utils.labels(this.disown), arguments);
            tx.params = unpacked.params;
            return augur.transact.apply(augur, [tx].concat(unpacked.cb));
        }

    };
};
