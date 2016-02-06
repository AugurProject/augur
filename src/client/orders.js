/******************************
 * Locally stored order book. *
 ******************************/

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var numeric = require("numeric");
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require("node-localstorage").LocalStorage;
    localStorage = new LocalStorage("./scratch");
}
var errors = require("augur-contracts").errors;
var constants = require("../constants");
var utils = require("../utilities");

module.exports = {

    limit: {

        // Find roots of f using Newton-Raphson.
        // http://www.turb0js.com/a/Newton%E2%80%93Raphson_method
        sharesToTrade: function (x0, q, i, a, cap) {
            var next_x0;
            for (var i = 0; i < constants.MAX_ITER; ++i) {
                var denominator = this.fprime(x0, q, i, a, cap);
                if (Math.abs(denominator) < constants.EPSILON) return null;
                next_x0 = x0 - this.f(x0, q, i, a, cap) / denominator;
                if (Math.abs(next_x0 - x0) < constants.TOLERANCE) {
                    return next_x0;
                }
                x0 = next_x0;
            }
        },

        // LS-LMSR objective function (optimize n)
        f: function (n, q, i, a, cap) {
            var qj = numeric.clone(q);
            qj.splice(i, 1);
            var q_plus_n = n + numeric.sum(q);
            var b = a * q_plus_n;
            var exp_qi = Math.exp((q[i] + n) / b);
            var exp_qj = numeric.exp(numeric.div(qj, b));
            var sum_exp_qj = numeric.sum(exp_qj);
            return a*Math.log(Math.exp((q[i] + n)/b) + sum_exp_qj) +
                (exp_qi*numeric.sum(qj) - numeric.sum(numeric.mul(qj, exp_qj))) /
                (q_plus_n*(exp_qi + sum_exp_qj)) - cap;
        },

        // First derivative of f
        fprime: function (n, q, i, a, cap) {
            return (this.f(n + 0.000001, q, i, a, cap) -
                this.f(n - 0.000001, q, i, a, cap)) / 0.000002;
        }

    },

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
