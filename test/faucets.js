"use strict";

var assert = require("assert");
var Augur = require("../augur");

Augur.connect();

Augur.reputationFaucet(Augur.branches.dev);
Augur.cashFaucet();
