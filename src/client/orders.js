/******************************
 * Locally stored order book. *
 ******************************/

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var errors = require("augur-contracts").errors;
var utils = require("../utilities");

module.exports = {

    get: function (account, cb) {
        cb = cb || utils.pass;
        if (!account) return cb(errors.DB_READ_FAILED);
        try {
            return JSON.parse(localStorage.getItem(account));
        } catch (ex) {
            return cb(ex);
        }
    },

    // TODO add a "sync my orders" button that sends to IPFS
    // order: {account, market, outcome, price, amount, expiration, cap}
    create: function (order, cb) {
        cb = cb || utils.pass;
        if (order && order.account && order.market && order.outcome &&
            order.price !== null && order.price !== undefined &&
            order.amount !== null && order.amount !== undefined) {
            var orders = this.get(order.account);
            if (!orders) orders = {};
            if (!orders[order.market]) orders[order.market] = {};
            if (!orders[order.market][order.outcome]) {
                orders[order.market][order.outcome] = [];
            }
            var details = {
                price: order.price,
                amount: order.amount,
                expiration: order.expiration,
                cap: order.cap,
                timestamp: new Date().getTime()
            };
            details.id = utils.sha256([
                details.price.toString(),
                details.expiration.toString(),
                details.cap.toString(),
                details.timestamp.toString()
            ]);
            orders[order.market][order.outcome].push(details);
            localStorage.setItem(order.account, JSON.stringify(orders));
            return cb(orders);
        }
        return cb(errors.DB_WRITE_FAILED);
    },

    cancel: function (account, market, outcome, orderId, cb) {
        cb = cb || utils.pass;
        if (!orderId) return cb(errors.DB_DELETE_FAILED);
        var orders = this.get(account);
        if (!orders || !orders[market] || !orders[market][outcome]) {
            return cb(errors.DB_DELETE_FAILED);
        }
        for (var i = orders[market][outcome].length - 1; i >= 0; i--) {
            if (orders[market][outcome][i].id === orderId) {
                orders[market][outcome].splice(i, 1);
                localStorage.setItem(account, JSON.stringify(orders));
                return cb(orders);
            }
        }
        return cb(errors.DB_DELETE_FAILED);
    },

    reset: function (account, cb) {
        cb = cb || utils.pass;
        if (account !== null && account !== undefined && account !== "") {
            localStorage.removeItem(account);
            return cb(true);
        }
        return cb(errors.DB_DELETE_FAILED);
    },

};
