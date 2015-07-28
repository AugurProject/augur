/**
 * Bindings for the Namereg contract:
 * https://github.com/ethereum/dapp-bin/blob/master/registrar/registrar.sol
 */

"use strict";

var utils = require("./utilities");

module.exports = function (augur) {

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
            return augur.fire.apply(augur, [tx].concat(unpacked.cb));
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
            return augur.fire.apply(augur, [tx].concat(unpacked.cb));
        },

        // get name from address
        name: function (address, callback) {
            // address: ethereum address
            var tx = utils.copy(this.namereg.name);
            var unpacked = utils.unpack(address, utils.labels(this.name), arguments);
            tx.params = unpacked.params;
            return augur.fire.apply(augur, [tx].concat(unpacked.cb));
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
