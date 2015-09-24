/************************
 * augur.js error codes *
 ************************/

"use strict";

var errors = {

    "0x": "no response or bad input",

    cashFaucet: {
        "-1": "Hey, you're not broke!"
    },

    getSimulatedBuy: {
        "-2": "cost updating error (did you enter a valid quantity?)"
    },

    closeMarket: {
        "-1": "market has no cash",
        "-2": "0 outcome",
        "-3": "outcome indeterminable"
    },

    report: {
        "0": "could not set reporter ballot",
        "-1": "report length does not match number of expiring events",
        "-2": "voting period expired",
        "-3": "incorrect hash"
    },

    submitReportHash: {
        "0": "could not set report hash",
        "-1": "reporter doesn't exist, voting period is over, or voting "+
            "period hasn't started yet",
        "-2": "not in hash submitting timeframe"
    },

    checkReportValidity: {
        "-1": "report isn't long enough",
        "-2": "reporter doesn't exist, voting period is over, or voting "+
            "period hasn't started yet"
    },

    slashRep: {
        "0": "incorrect hash",
        "-2": "incorrect reporter ID"
    },

    createEvent: {
        "0": "not enough money to pay fees or event already exists",
        "-1": "we're either already past that date, branch doesn't "+
            "exist, or description is bad"
    },

    createMarket: {
        "-1": "bad input or parent doesn't exist",
        "-2": "too many events",
        "-3": "too many outcomes",
        "-4": "not enough money or market already exists"
    },

    sendReputation: {
        "0": "not enough reputation",
        "-1": "Your reputation account was just created! Earn some "+
            "reputation before you can send to others",
        "-2": "Receiving address doesn't exist"
    },

    buyShares: {
        "-1": "invalid outcome or trading closed",
        "-2": "entered a negative number of shares",
        "-3": "not enough money",
        "-4": "bad nonce/hash"
    },

    WHISPER_POST_FAILED: {
        error: 65,
        message: "could not post message to whisper"
    },

    DB_WRITE_FAILED: {
        error: 98,
        message: "database write failed"
    },

    DB_READ_FAILED: {
        error: 99,
        message: "database read failed"
    },

    INVALID_CONTRACT_PARAMETER: {
        error: 400, // bad request
        message: "cannot send object parameter to contract"
    },

    NOT_LOGGED_IN: {
        error: 401, // unauthorized
        message: "not logged in"
    },

    PARAMETER_NUMBER_ERROR: function (params) {
        return {
            error: 402,
            message: "expected " + params.expected.toString() +
                " parameters, got " + params.received.toString()
        };
    },

    BAD_CREDENTIALS: {
        error: 403, // forbidden
        message: "incorrect handle or password"
    },

    TRANSACTION_NOT_FOUND: {
        error: 404,
        message: "transaction not found"
    },

    PASSWORD_TOO_SHORT: {
        error: 405,
        message: "password must be at least 6 characters long"
    },

    NULL_CALL_RETURN: {
        error: 406,
        message: "expected contract call to return value, received null"
    },

    NULL_RESPONSE: {
        error: 407,
        message: "expected transaction hash from Ethereum node, received null"
    },

    NO_RESPONSE: {
        error: 408,
        message: "no response"
    },

    INVALID_RESPONSE: {
        error: 409,
        message: "could not parse response from Ethereum node"
    },

    LOCAL_NODE_FAILURE: {
        error: 410,
        message: "RPC request to local Ethereum node failed"
    },
    HOSTED_NODE_FAILURE: {
        error: 411,
        message: "RPC request to hosted nodes failed"
    },

    TRANSACTION_INVALID: {
        error: 412,
        message: "transaction validation failed"
    },

    HANDLE_TAKEN: {
        error: 422, // unprocessable entity
        message: "handle already taken"
    },

    FILTER_NOT_CREATED: {
        error: 450,
        message: "filter could not be created"
    },

    TRANSACTION_FAILED: {
        error: 500,
        message: "transaction failed"
    },

    TRANSACTION_NOT_CONFIRMED: {
        error: 501,
        message: "polled network but could not confirm transaction"
    },

    DUPLICATE_TRANSACTION: {
        error: 502,
        message: "duplicate transaction"
    },

    ETHEREUM_NOT_FOUND: {
        error: 651,
        message: "no active ethereum node(s) found"
    }

};

errors.getSimulatedSell = errors.getSimulatedBuy;
errors.sellShares = errors.buyShares;

module.exports = errors;
