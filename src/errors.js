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

    NOT_LOGGED_IN: {
        error: 401, // unauthorized
        message: "not logged in"
    },

    BAD_CREDENTIALS: {
        error: 403, // forbidden
        message: "incorrect handle or password"
    },

    TRANSACTION_INVALID: {
        error: 412,
        message: "transaction validation failed"
    },

    HANDLE_TAKEN: {
        error: 422, // unprocessable entity
        message: "handle already taken"
    },

    TRANSACTION_FAILED: {
        error: 500,
        message: "transaction failed"
    }

};

errors.getSimulatedSell = errors.getSimulatedBuy;
errors.sellShares = errors.buyShares;

module.exports = errors;
