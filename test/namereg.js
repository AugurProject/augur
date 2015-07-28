/**
 * augur.js unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var crypto = require("crypto");
var assert = require("chai").assert;
var chalk = require("chalk");
var EthTx = require("ethereumjs-tx");
var EthUtil = require("ethereumjs-util");
var eccrypto = require("eccrypto");
var constants = require("../src/constants");
var utils = require("../src/utilities");
var Augur = utils.setup(require("../src"), process.argv.slice(2));
var log = console.log;

// create random handle and password
var handle = utils.sha256(new Date().toString()).slice(0, 24);
var password = utils.sha256(Math.random().toString(36).substring(4)).slice(0, 24);
var newAccountAddress;

describe("Namereg", function () {

    describe("namereg.reserve", function () {

        it("should reserve name 'jack' for coinbase", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.reserve("jack",
                function (r) {
                    // sent
                    assert(r.txHash);
                    assert.equal(r.callReturn, null);
                },
                function (r) {
                    // success
                    assert(r.txHash);
                    assert(r.blockHash);
                    assert(r.blockNumber);
                    assert.equal(r.from, Augur.coinbase);
                    assert.equal(r.to, Augur.contracts.namereg);
                    assert.equal(r.callReturn, null);
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            )
        });

        it("should reserve name 'zombiejack' for coinbase", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.reserve("zombiejack",
                function (r) {
                    // sent
                    assert(r.txHash);
                    assert.equal(r.callReturn, null);
                },
                function (r) {
                    // success
                    assert(r.txHash);
                    assert(r.blockHash);
                    assert(r.blockNumber);
                    assert.equal(r.from, Augur.coinbase);
                    assert.equal(r.to, Augur.contracts.namereg);
                    assert.equal(r.callReturn, null);
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            )
        });

        it("create and fund web account", function (done) {
            var amount = 64;
            this.timeout(constants.TIMEOUT);
            Augur.web.register(handle, password, function (toAccount) {
                assert.equal(toAccount.handle, handle);
                newAccountAddress = toAccount.address;
                Augur.sendEther(
                    toAccount.address,
                    amount,
                    Augur.coinbase,
                    function (r) {
                        // sent
                    },
                    function (r) {
                        done();
                    },
                    function (r) {
                        done(r);
                    }
                );
            });
        });

        it("reserve 'tinybike' for web account", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.login(handle, password, function (account) {
                assert.equal(account.handle, handle);
                Augur.namereg.reserve("tinybike",
                    function (r) {
                        // sent
                        assert(r.txHash);
                        assert.equal(r.callReturn, null);
                    },
                    function (r) {
                        // success
                        assert(r.txHash);
                        assert(r.blockHash);
                        assert(r.blockNumber);
                        assert.equal(r.from, account.address);
                        assert.equal(r.to, Augur.contracts.namereg);
                        assert.equal(r.callReturn, null);
                        Augur.web.logout();
                        done();
                    },
                    function (r) {
                        // failed
                        done(r);
                    }
                )
            });
        });

    });

    describe("namereg.owner", function () {

        it("should report that coinbase owns 'jack'", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.owner("jack", function (address) {
                log(address);
                assert.equal(address, Augur.coinbase);
                done();
            });
        });

        it("should report that the web account owns 'tinybike'", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.owner("tinybike", function (address) {
                log(address);
                assert.equal(address, newAccountAddress);
                done();
            });
        });

    });

    describe("namereg.setAddress", function () {

        it("should set address for 'jack' to coinbase", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.setAddress("jack", Augur.coinbase, true,
                function (r) {
                    // sent
                    assert(r.txHash);
                    assert.equal(r.callReturn, null);
                },
                function (r) {
                    // success
                    assert(r.txHash);
                    assert(r.blockHash);
                    assert(r.blockNumber);
                    assert.equal(r.from, Augur.coinbase);
                    assert.equal(r.to, Augur.contracts.namereg);
                    assert.equal(r.callReturn, null);
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            );
        });

        it("should set address for 'tinybike' to web account", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.web.login(handle, password, function (account) {
                Augur.namereg.setAddress("tinybike", account.address, true,
                    function (r) {
                        // sent
                        assert(r.txHash);
                        assert.equal(r.callReturn, null);
                    },
                    function (r) {
                        // success
                        assert(r.txHash);
                        assert(r.blockHash);
                        assert(r.blockNumber);
                        assert.equal(r.from, account.address);
                        assert.equal(r.to, Augur.contracts.namereg);
                        assert.equal(r.callReturn, null);
                        done();
                    },
                    function (r) {
                        // failed
                        done(r);
                    }
                );
            });
        });

    });

    describe("namereg.addr", function () {

        it("should get coinbase from name 'jack'", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.addr("jack", function (address) {
                log(address);
                done();
            });
        });

    });

    describe("namereg.name", function () {

        it("should get 'jack' from coinbase address", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.name(Augur.coinbase, function (name) {
                log(name);
                done();
            });
        });

    });

    describe("namereg.transfer", function () {

        it("should transfer 'jack' from coinbase to web account", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.transfer("jack", newAccountAddress,
                function (r) {
                    // sent
                    assert(r.txHash);
                    assert.equal(r.callReturn, null);
                },
                function (r) {
                    // success
                    assert(r.txHash);
                    assert(r.blockHash);
                    assert(r.blockNumber);
                    assert.equal(r.from, Augur.coinbase);
                    assert.equal(r.to, Augur.contracts.namereg);
                    assert.equal(r.callReturn, null);
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            );
        });

    });

    describe("namereg.disown", function () {

        it("should remove ownership of 'zombiejack' from coinbase", function (done) {
            this.timeout(constants.TIMEOUT);
            Augur.namereg.disown("zombiejack",
                function (r) {
                    // sent
                    assert(r.txHash);
                    assert.equal(r.callReturn, null);
                },
                function (r) {
                    // success
                    assert(r.txHash);
                    assert(r.blockHash);
                    assert(r.blockNumber);
                    assert.equal(r.from, Augur.coinbase);
                    assert.equal(r.to, Augur.contracts.namereg);
                    assert.equal(r.callReturn, null);
                    done();
                },
                function (r) {
                    // failed
                    done(r);
                }
            );
        });

    });

});
