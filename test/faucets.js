#!/usr/bin/env node

"use strict";

var Augur = require("../augur");

Augur.connect();

var log = console.log;
var branch = Augur.branches.dev;

Augur.reputationFaucet(branch);
Augur.cashFaucet();
