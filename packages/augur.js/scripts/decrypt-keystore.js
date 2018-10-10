#!/usr/bin/env node

"use strict";

var fs = require("fs");
var keythereum = require("keythereum");

var keyFilePath = process.argv[2];

process.stdout.write(keythereum.recover(process.env.ETHEREUM_PASSWORD, JSON.parse(fs.readFileSync(keyFilePath))).toString("hex"));
