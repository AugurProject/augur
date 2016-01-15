/**
 * augur unit tests
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var test = require("tape");
var augur = require("augur.js");
var constants = require("../app/libs/constants");
var flux = require("./mock");

augur.connect();

// test("ConfigActions.connect", function (t) {
//     flux.actions.config.connect();
//     t.end();
// });

// test("ConfigActions.connectHosted", function (t) {
//     var cb = t.end;
//     flux.actions.config.connectHosted(cb);
// });

// test("ConfigActions.setIsHosted", function (t) {
//     var isHosted;
//     flux.actions.config.setIsHosted(isHosted);
//     t.end();
// });

// test("ConfigActions.setHost", function (t) {
//     var host = "https://eth3.augur.net";
//     flux.actions.config.setHost(host);
//     t.end();
// });

// test("ConfigActions.updatePercentLoaded", function (t) {
//     var percent = 100;
//     flux.actions.config.updatePercentLoaded(percent);
//     t.end();
// });

// test("ConfigActions.initializeData", function (t) {
//     flux.actions.config.initializeData();
//     t.end();
// });

// test("ConfigActions.updateAccount", function (t) {
//     flux.actions.config.updateAccount();
//     t.end();
// });

// test("ConfigActions.signOut", function (t) {
//     flux.actions.config.signOut();
//     t.end();
// });
