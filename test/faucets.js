#!/usr/bin/env node

"use strict";

var Augur = require("../augur");

Augur.connect();

Augur.reputationFaucet(Augur.branches.dev);
Augur.cashFaucet();
