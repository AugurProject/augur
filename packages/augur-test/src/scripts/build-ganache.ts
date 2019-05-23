#!/usr/bin/env ts-node

const libs = require("../libs");
const ACCOUNTS = libs.ACCOUNTS;
const deployContracts = libs.deployContracts;

const artifacts = require("@augurproject/artifacts");
const compilerOutput = artifacts.Contracts;

deployContracts(ACCOUNTS, compilerOutput).then(() => console.log("SADSONG", 0));
