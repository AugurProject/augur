/**
 * Augur JavaScript API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var clone = require("clone");
var abi = require("augur-abi");
var constants = require("../constants");
var utils = require("../utilities");

module.exports = {

    parseLastTime: function (logs) {
        return new Date(parseInt(logs[logs.length - 1].data, 16) * 1000);
    },

    getRegisterTime: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                topics: [
                    this.api.events.session.signature,
                    abi.format_int256(account),
                    constants.SESSION_CODES.register
                ],
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) {
                var logs = this.rpc.getLogs(filter);
                if (!logs || !logs.length || (logs && logs.error)) return null;
                return this.parseLastTime(logs);
            }
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, null);
                if (logs && logs.error) return callback(logs, null);
                callback(null, self.parseLastTime(logs));
            });
        }
    },

    getLatestUserTime: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (!utils.is_function(callback)) {
            var logoutTime = this.getLastLogoutTime(account, options);
            var loginTime = this.getLastLoginTime(account, options);
            if (logoutTime && loginTime) {
                return new Date(Math.max(logoutTime, loginTime));
            }
            if (logoutTime) return logoutTime;
            if (loginTime) return loginTime;
            return this.getRegisterTime(account, options);
        }
        this.getLastLogoutTime(account, options, function (err, logoutTime) {
            if (err) return callback(err);
            self.getLastLoginTime(account, options, function (err, loginTime) {
                if (err) return callback(err);
                if (logoutTime && loginTime) {
                    return callback(null, new Date(Math.max(logoutTime, loginTime)));
                }
                if (logoutTime) return callback(null, logoutTime);
                if (loginTime) return callback(null, loginTime);
                self.getRegisterTime(account, options, callback);
            });
        });
    },

    getLastLoginTime: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (!utils.is_function(callback)) {
            var logs = this.getLoginLogs(account, options);
            if (!logs || !logs.length) return null;
            return this.parseLastTime(logs);
        }
        this.getLoginLogs(account, options, function (err, logs) {
            if (err) return callback(err);
            if (!logs || !logs.length) return callback(null, null);
            callback(null, self.parseLastTime(logs));
        });
    },

    getLastLogoutTime: function (account, options, callback) {
        var self = this;
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (!utils.is_function(callback)) {
            var logs = this.getLogoutLogs(account, options);
            if (!logs || !logs.length) return null;
            return this.parseLastTime(logs);
        }
        this.getLogoutLogs(account, options, function (err, logs) {
            if (err) return callback(err);
            if (!logs || !logs.length) return callback(null, null);
            callback(null, self.parseLastTime(logs));
        });
    },

    getRegisterLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                topics: [
                    this.api.events.session.signature,
                    abi.format_int256(account),
                    constants.SESSION_CODES.register
                ],
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    },

    getLoginLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                topics: [
                    this.api.events.session.signature,
                    abi.format_int256(account),
                    constants.SESSION_CODES.login
                ],
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    },

    getLogoutLogs: function (account, options, callback) {
        if (!callback && utils.is_function(options)) {
            callback = options;
            options = null;
        }
        options = options || {};
        if (account !== undefined && account !== null) {
            var filter = {
                fromBlock: options.fromBlock || "0x1",
                toBlock: options.toBlock || "latest",
                topics: [
                    this.api.events.session.signature,
                    abi.format_int256(account),
                    constants.SESSION_CODES.logout
                ],
                timeout: constants.GET_LOGS_TIMEOUT
            };
            if (!utils.is_function(callback)) return this.rpc.getLogs(filter);
            this.rpc.getLogs(filter, function (logs) {
                if (!logs || !logs.length) return callback(null, []);
                if (logs && logs.error) return callback(logs, null);
                callback(null, logs);
            });
        }
    }
};
