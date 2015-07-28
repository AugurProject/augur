#!/usr/bin/env node
/**
 * Automated tests for augur.js
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var util = require("util");
var async = require("async");
var assert = require("chai").assert;
var _ = require("lodash");
var rm = require("rimraf");
var chalk = require("chalk");
var Mocha = require("mocha");
var longjohn = require("longjohn");
var mod_getopt = require('posix-getopt');
var Augur = require("../src");
var constants = require("../src/constants");
var utilities = require("../src/utilities");
var numeric = require("../src/numeric");
var log = console.log;

longjohn.async_trace_limit = 25;
longjohn.empty_frame = "";

var options = {
    DEBUG: false,
    NETWORK_ID: "10101",
    PEER_PORT: 30303,
    RPC_PORT: 8545,
    MINIMUM_ETHER: 32,
    AUGUR_CORE: path.join(process.env.HOME, "src", "augur-core"),
    FAUCETS: path.join(__dirname, "faucets.js"),
    GOSPEL: "gospel.json",
    CUSTOM_GOSPEL: false,
    TESTPATH: path.join(__dirname, "..", "test"),
    LOG: "geth.log",
    GETH: "geth",
    SPAWN_GETH: true,
    SUITE: []
};

var verified_accounts = false;
var init;

function runtests(geth, tests) {
    var index = 0;
    async.forEachSeries(tests, function (test, next) {
        var mocha = new Mocha();
        mocha.addFile(path.join(options.TESTPATH, test + ".js"));
        log(path.join(options.TESTPATH, test + ".js"));
        mocha.run(function (failures) {
            if (failures) log(chalk.red("Failed tests:"), chalk.red.bold(failures));
            if (index++ === tests.length - 1) {
                process.exit(failures);
            }
            next();
        });
    }, function (err) {
        if (err) log(chalk.red.bold(err));
    });
}

var tests = {

    connection: function (geth) {
        log(chalk.red.bold("\nConnection tests"));
        runtests(geth, [
            "connect",
            "contracts"
        ]);
    },

    core: function (geth) {
        log(chalk.red.bold("\nCore tests"));
        runtests(geth, [
            "numeric",
            "abi",
            "ethrpc",
            "invoke",
            "batch",
            "faucets",
            "reporting",
            "createMarket",
            "branches",
            "info",
            "markets",
            "events",
            "payments"
        ]);
    },

    consensus: function (geth) {
        log(chalk.red.bold("\nConsensus workflow tests"));
        runtests(geth, [
            "createEvent",
            "expiring",
            "addEvent",
            "buyAndSellShares",
            "ballot",
            "makeReports",
            "checkQuorum",
            "interpolate",
            "dispatch",
            "score",
            "resolve",
            "closeMarket"
        ]);
    },

    auxiliary: function (geth) {
        log(chalk.red.bold("\nAuxiliary tests"));
        runtests(geth, [
            "web",
            "multicast"
            // "comments",
            // "priceLog"
        ]);
    }

};

function kill_geth(geth) {
    log(chalk.gray("Shut down ") + chalk.magenta("geth") + chalk.gray("..."));
    geth.kill();
}

function spawn_geth(flags) {
    log("Spawn " + chalk.magenta(options.GETH) + " on network " +
        chalk.yellow.bold(options.NETWORK_ID) + " (genesis nonce " +
        chalk.yellow(options.GENESIS_NONCE) + ")...");
    var geth = cp.spawn(options.GETH, flags);
    log(chalk.magenta("geth"), "listening on ports:");
    log(chalk.gray(" - Peer:"), chalk.cyan(options.PEER_PORT));
    log(chalk.gray(" - RPC: "), chalk.cyan(options.RPC_PORT));
    geth.stdout.on("data", function (data) {
        if (options.DEBUG) {
            process.stdout.write(chalk.cyan(data.toString()));
        }
        geth_log.write("stdout: " + util.format(data.toString()) + "\n");
    });
    geth.stderr.on("data", function (data) {
        if (options.DEBUG) {
            process.stdout.write(chalk.yellow(data.toString()));
        }
        geth_log.write(util.format(data.toString()) + "\n");
    });
    geth.on("close", function (code) {
        if (code !== 2 && code !== 0) {
            log(chalk.red.bold("geth closed with code " + code));
            kill_geth(geth);
            if (code === 1) {
                utilities.wait(5);
                log("Restarting", chalk.magenta("geth") + "...");
                return spawn_geth(flags);
            }
        }
    });
    return geth;
}

function mine_minimum_ether(geth, account, next) {
    var balance = numeric.bignum(Augur.balance(account)).dividedBy(constants.ETHER).toNumber();
    if (balance < options.MINIMUM_ETHER) {
        if (balance > 0) {
            log(chalk.green(balance) + chalk.gray(" ETH, waiting for ") +
                chalk.green(options.MINIMUM_ETHER) + chalk.gray("..."));
        }
        setTimeout(function () {
            mine_minimum_ether(geth, account, next);
        }, 5000);
    } else {
        if (next) next(geth);
    }
}

function display_outputs(geth) {
    var branch, period, num_reports, num_events, flatsize, reporters, ballots,
        reporterID, ballot, i, j, wcd, reports_filled, outcomes, smooth_rep,
        reporter_payouts, reputation, total_rep;
    branch = Augur.branches.dev;
    period = parseInt(Augur.getVotePeriod(branch)) - 1;
    num_reports = Augur.getNumberReporters(branch);
    num_events = Augur.getNumberEvents(branch, period);
    flatsize = num_events * num_reports;
    reporters = accounts;
    ballots = new Array(flatsize);
    for (i = 0; i < num_reports; ++i) {
        reporterID = Augur.getReporterID(branch, i);
        ballot = Augur.getReporterBallot(branch, period, reporterID);
        if (ballot[0] !== 0) {
            for (j = 0; j < num_events; ++j) {
                ballots[i*num_events + j] = ballot[j];
            }
        } else {
            for (j = 0; j < num_events; ++j) {
                ballots[i*num_events + j] = '0';
            }
        }
    }
    log("Ballots:");
    log(utilities.fold(ballots, num_events));

    log("\nCentered:");
    wcd = utilities.fold(Augur.getWeightedCenteredData(branch, period).slice(0, flatsize), num_events);
    log(wcd);

    log("\nInterpolated:");
    reports_filled = utilities.fold(Augur.getReportsFilled(branch, period).slice(0, flatsize), num_events);
    log(reports_filled);

    outcomes = Augur.getOutcomesFinal(branch, period).slice(0, num_events);
    log("\nOutcomes:");
    log(outcomes);

    smooth_rep = Augur.getSmoothRep(branch, period).slice(0, num_reports);
    log("\nSmoothed reputation fraction:");
    log(smooth_rep);

    reporter_payouts = Augur.getReporterPayouts(branch, period).slice(0, num_reports);
    log("\nReporter payouts:");
    log(reporter_payouts);

    reputation = [];
    total_rep = 0;
    for (i = 0; i < reporters.length; ++i) {
        reputation.push(Augur.getRepBalance(branch, reporters[i]));
        total_rep += Number(Augur.getRepBalance(branch, reporters[i]));
    }
    log("\nUpdated reputation:");
    log(reputation);

    log("\nTotal reputation (" + (47*reporters.length).toString() + " expected): " + total_rep.toString());
    assert.equal(total_rep, reporters.length * 47);

    kill_geth(geth);
}

function faucets(geth) {
    var next_test;
    require(options.FAUCETS);
    delete require.cache[require.resolve(options.FAUCETS)];
    setTimeout(function () {
        var cash_balance = Augur.getCashBalance(Augur.coinbase);
        var rep_balance = Augur.getRepBalance(Augur.branches.dev, Augur.coinbase);
        var ether_balance = numeric.bignum(Augur.balance(Augur.coinbase)).dividedBy(constants.ETHER).toFixed();
        log(chalk.cyan("\nBalances:"));
        log("Cash:       " + chalk.green(cash_balance));
        log("Reputation: " + chalk.green(rep_balance));
        log("Ether:      " + chalk.green(ether_balance));
        if (geth) kill_geth(geth);
        for (var i = 0, len = accounts.length; i < len; ++i) {
            log("account:", i);
            if (options.GETH_FLAGS[1] === accounts[i]) break;
        }
        if (i < accounts.length - 1) {
            log(chalk.blue.bold("\nAccount " + (i+1) + ": ") + chalk.cyan(accounts[i+1]));
            options.GETH_FLAGS[1] = accounts[i+1];
            options.GETH_FLAGS[3] = accounts[i+1];
            setTimeout(function () {
                init(
                    spawn_geth(options.GETH_FLAGS),
                    accounts[i+1],
                    mine_minimum_ether,
                    faucets
                );
            }, 5000);
        } else {
            log(chalk.blue.bold("\nAccount 0: ") + chalk.cyan(accounts[0]));
            options.GETH_FLAGS[1] = accounts[0];
            options.GETH_FLAGS[3] = accounts[0];
            if (geth) kill_geth(geth);
            geth = spawn_geth(options.GETH_FLAGS);
            setTimeout(function () {
                init(geth, accounts[0], mine_minimum_ether, function () {
                    if (options.SUITE.length) {
                        init_test_suite(accounts[0], options, geth);
                    }
                });
            }, 5000);
        }
    }, 10000);
}

function upload_contracts(geth) {
    log(chalk.red.bold("Upload contracts to network ") +
        chalk.yellow.bold(options.NETWORK_ID));
    var uploader = cp.spawn(options.UPLOADER, [
        "--BLOCKTIME=1.75",
        "--port=" + options.RPC_PORT
    ]);
    uploader.stdout.on("data", function (data) {
        process.stdout.write(chalk.cyan(data.toString()));
    });
    uploader.stderr.on("data", function (data) {
        process.stdout.write(chalk.red(data.toString()));
    });
    uploader.on("close", function (code) {
        if (code !== 0) {
            log(chalk.red.bold("Uploader closed with code " + code));
        } else {
            var gospelcmd = path.join(options.AUGUR_CORE, "generate_gospel.py -j");
            cp.exec(gospelcmd, function (err, stdout) {
                if (err) throw err;
                log("Write contract addresses to " + chalk.green(options.GOSPEL_JSON) + "...");
                fs.writeFileSync(options.GOSPEL_JSON, stdout.toString());
                options.CUSTOM_GOSPEL = true;
                log("Send " + options.MINIMUM_ETHER + " ETH to other addresses:");
                for (var i = 1, len = accounts.length; i < len; ++i) {
                    log(chalk.green("  ✓ ") + chalk.gray(accounts[i]));
                    Augur.pay(accounts[i], options.MINIMUM_ETHER);
                }
                setTimeout(function () {
                    kill_geth(geth);
                    log(chalk.blue.bold("\nAccount 1: ") + chalk.cyan(accounts[1]));
                    options.GETH_FLAGS[1] = accounts[1];
                    options.GETH_FLAGS[3] = accounts[1];
                    setTimeout(function () {
                        init(
                            spawn_geth(options.GETH_FLAGS),
                            accounts[1],
                            mine_minimum_ether,
                            faucets
                        );
                    }, 10000);
                }, 12000);
            });
        }
    });
}

function setup_mocha_tests(tests) {
    var mocha = new Mocha();
    for (var i = 0, len = tests.length; i < len; ++i) {
        mocha.addFile(path.join(options.TESTPATH, tests[i] + ".js"));
    }
    return mocha;
}

function preupload_tests(geth) {
    setup_mocha_tests([
        "numeric",
        "abi"
    ]).run(function (failures) {
        process.on("exit", function () { process.exit(failures); });
        upload_contracts(geth);
    });
}

function init(geth, account, callback, next, count) {
    function retry() {
        init(geth, account, callback, next, ++count);
    }
    count = count || 0;
    if (options.CUSTOM_GOSPEL) {
        Augur = utilities.setup(
            Augur,
            ["--gospel"],
            { protocol: "http", host: "127.0.0.1", port: options.RPC_PORT }
        );
    } else {
        Augur = utilities.setup(
            Augur,
            null,
            { protocol: "http", host: "127.0.0.1", port: options.RPC_PORT }
        );
    }
    if (Augur.connected()) {
        accounts = utilities.get_test_accounts(Augur, constants.MAX_TEST_ACCOUNTS);
        verified_accounts = true;
        if (!verified_accounts && account !== accounts[0]) {
            kill_geth(geth);
            account = accounts[0];
            log(chalk.blue.bold("\nAccount 0: ") + chalk.cyan(account));
            options.GETH_FLAGS[1] = account;
            options.GETH_FLAGS[3] = account;
            setTimeout(function () {
                init(spawn_geth(options.GETH_FLAGS), account, callback, next, ++count);
            }, 5000);
        } else {
            var balance = Augur.balance(account);
            if (balance && !balance.error) {
                balance = numeric.bignum(balance).dividedBy(constants.ETHER).toFixed();
                log("Connected on account", chalk.cyan(account));
                log(chalk.green(Augur.blockNumber()), chalk.gray("blocks"));
                log(chalk.green(balance), chalk.gray("ETH"));
                callback(geth, account, next);
            } else {
                setTimeout(retry, 5000);
            }
        }
    } else {
        if (count < 10) {
            setTimeout(retry, 5000);
        } else {
            kill_geth(geth);
            utilities.wait(2.5);
            geth = spawn_geth(options.GETH_FLAGS);
            setTimeout(retry, 2500);
        }
    }
}

var old_spawn = cp.spawn;

cp.spawn = function () {
    if (options.DEBUG) log(arguments);
    var result = old_spawn.apply(this, arguments);
    return result;
};

function reset_datadir() {
    log("Reset " + chalk.magenta("augur") + " data directory: " +
        chalk.green(options.DATADIR));
    var directories = [ "blockchain", "extra", "nodes", "state" ];
    for (var i = 0, len = directories.length; i < len; ++i) {
        rm.sync(path.join(options.DATADIR, directories[i]));
    }
}

function init_test_suite(account, options, geth) {
    var test_suite;
    if (options.SPAWN_GETH) {
        test_suite = function (test) {
            init(geth || spawn_geth(options.GETH_FLAGS), account, tests[test]);
        };
    } else {
        test_suite = function (test) { tests[test](null); };
    }
    async.forEachSeries(options.SUITE, test_suite);
}

function main(account, options) {
    if (options.RESET) {
        reset_datadir();
        init(
            spawn_geth(options.GETH_FLAGS),
            account,
            mine_minimum_ether,
            preupload_tests
        );
    } else if (options.SUITE.length) {
        init_test_suite(account, options);
    }
}

options.GOSPEL_JSON = path.join(options.TESTPATH, options.GOSPEL);
options.UPLOADER = path.join(options.AUGUR_CORE, "load_contracts.py");

var enodes;
if (options.NETWORK_ID !== "0") {
    enodes = [
        "enode://035b7845dfa0c0980112abdfdf4dc11087f56b77e10d2831f186ca12bc00f5b9327c427d03d9cd8106db01488905fb2200b5706f9e41c5d75885057691d9997c@[::]:30303",
        "enode://4014c7fa323dafbb1ada241b74ce16099efde03f994728a55b9ff09a9a80664920045993978de85cb7f6c2ac7e9218694554433f586c1290a8b8faa186ce072c@[::]:30303",
        "enode://12bcaeb91de58d9c48a0383cc77f7c01decf30c7da6967408f31dc793e08b14e2b470536ebe501a4f527e98e84c7f5431755eae5e0f4ba2556539ab9faa77318@[::]:30303",
        "enode://587aa127c580e61a26a74ab101bb15d03e121a720401f77647d41045eae88709b01136e30aba56d1feddff757d4a333f68b9a749acd6852f20ba16ef6e19855a@[::]:30303",
        "enode://f5fc10dafe8c44702748c7ead4f30d7b3fe35450d2e66158231a9bf9b1838f93d06b25908b8447c85b2429bdaeff45709f17e67083791053e0bac6e282c969fe@[::]:30303"
    ].join(' ');
} else {
    enodes = "";
}

// Test network (networkid 10101, genesisnonce 10101)
if (options.NETWORK_ID === "10101") {
    options.DATADIR = path.join(process.env.HOME, ".augur-test");
    options.GENESIS_NONCE = "42";
}

// Private alpha network (networkid 1010101, genesisnonce 1010101)
else if (options.NETWORK_ID === "1010101") {
    options.DATADIR = path.join(process.env.HOME, ".augur");
    options.GENESIS_NONCE = "1010101";
}

// Public Ethereum testnet (networkid 0, genesisnonce 42)
else if (options.NETWORK_ID === "0") {
    options.DATADIR = path.join(process.env.HOME, ".ethereum");
    options.GENESIS_NONCE = "42";
}

var accounts = utilities.get_test_accounts(options.DATADIR, constants.MAX_TEST_ACCOUNTS);

options.GETH_FLAGS = [
    "--etherbase", accounts[0],
    "--unlock", accounts[0],
    "--mine",
    "--port", options.PEER_PORT,
    "--rpc",
    "--rpcport", options.RPC_PORT,
    "--rpccorsdomain", "http://localhost:8080",
    "--rpcapi", "shh,db,eth,net,web3,miner",
    "--ipcapi", "admin,db,eth,debug,miner,net,shh,txpool,personal,web3",
    "--shh",
    "--maxpeers", "64",
    "--networkid", options.NETWORK_ID,
    "--genesisnonce", options.GENESIS_NONCE,
    "--datadir", options.DATADIR,
    "--bootnodes", enodes,
    "--password", path.join(options.DATADIR, ".password")
];

log("Create", chalk.magenta("geth"), "log file:",
    chalk.green(path.join(__dirname, options.LOG)));
var geth_log = fs.createWriteStream(
    path.join(__dirname, options.LOG),
    {flags : 'w'}
);

if (module.parent && !process.argv.slice(2).length) {

    options.RESET = false;
    options.SPAWN_GETH = true;
    options.SUITE = ["connection", "core", "auxiliary"];

    log("Load contracts from file: " + chalk.green(options.GOSPEL_JSON));
    Augur.contracts = JSON.parse(fs.readFileSync(options.GOSPEL_JSON));
    options.CUSTOM_GOSPEL = true;

    module.exports = function (callback) {
        if (callback) {
            callback(main(accounts[0], options));
        } else {
            main(accounts[0], options);
        }
    };

} else {

    var option, optstring, parser, done;
    optstring = "r(reset)g(geth)a(aux)c(core)s(consensus)n(connection)o(gospel)A(all)u:(augur)";
    parser = new mod_getopt.BasicParser(optstring, process.argv);

    while ((option = parser.getopt()) !== undefined) {
        switch (option.option) {
            case 'r':
                options.RESET = true;
                options.SPAWN_GETH = true;
                break;
            case 'g':
                options.SPAWN_GETH = false;
                break;
            case 'a':
                options.SUITE.push("auxiliary");
                break;
            case 'c':
                options.SUITE.push("core");
                break;
            case 's':
                options.SUITE.push("consensus");
                break;
            case 'n':
                options.SUITE.push("connection");
                break;
            case 'A':
                options.SUITE = ["connection", "core", "auxiliary", "consensus"];
                break;
            case 'o':
                log("Load contracts from file: " + chalk.green(options.GOSPEL_JSON));
                Augur.contracts = JSON.parse(fs.readFileSync(options.GOSPEL_JSON));
                options.CUSTOM_GOSPEL = true;
                break;
            case 'u':
                options.AUGUR_CORE = option.optarg;
                break;
            default:
                assert.equal('?', option.option);
                done = true;
                break;
        }
        if (done) break;
    }

    main(accounts[0], options);
}
