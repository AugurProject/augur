/**
 * Bindings for the Namereg contract:
 * https://github.com/ethereum/dapp-bin/blob/master/registrar/registrar.sol
 */

"use strict";

var utils = require("../utilities");
// var web3 = require("web3");

module.exports = function (augur) {

    // web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
    // web3.eth.defaultAccount = augur.coinbase;

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
            // return web3.eth.namereg.owner(name, callback);
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
            // return web3.eth.namereg.addr(name, callback);
            var tx = utils.copy(this.namereg.addr);
            var unpacked = utils.unpack(name, utils.labels(this.addr), arguments);
            tx.params = unpacked.params;
            return augur.rpc.fire.apply(augur.rpc, [tx].concat(unpacked.cb));
        },

        // get name from address
        name: function (address, callback) {
            // address: ethereum address
            // return web3.eth.namereg.name(address, callback);
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
