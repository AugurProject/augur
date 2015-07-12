/**
 * JavaScript bindings for the Augur API
 * @author Jack Peterson (jack@tinybike.net)
 */

"use strict";

var NODE_JS = (typeof module !== "undefined") && process && !process.browser;

var crypto;
if (NODE_JS) {
    crypto = require("crypto");
    var request = require("sync-request");
    var XHR2 = require("xhr2");
} else {
    crypto = require("crypto-browserify");
}
var BN = require("bignumber.js");
var moment = require("moment");
var chalk = require("chalk");
var keccak_256 = require("js-sha3").keccak_256;
var EthUtil = require("ethereumjs-util");
var EthTx = require("ethereumjs-tx");
var elliptic = require("eccrypto");
var utilities = require("./utilities");
var log = console.log;

BN.config({ MODULO_MODE: BN.EUCLID });

function Augur() {

    // default RPC settings
    this.default_protocol = (typeof window !== "undefined") ?
                            window.location.protocol.slice(0,-1) : "http";
    this.RPC = {
        protocol: this.default_protocol,
        host: "127.0.0.1",
        port: 8545
    };

    // default gas: 3.135M
    this.default_gas = "0x2fd618";

    // if set to true, all numerical results (including hashes)
    // are returned as BigNumber objects
    this.BigNumberOnly = false;

    // max number of tx verification attempts
    this.TX_POLL_MAX = 12;

    // comment polling interval (in milliseconds)
    this.COMMENT_POLL_INTERVAL = 10000;

    // eth filter polling interval (in milliseconds)
    this.ETH_POLL_INTERVAL = 10000;

    // transaction polling interval
    this.TX_POLL_INTERVAL = 6000;

    // constants
    this.BAD = ((new BN(2)).toPower(63)).mul(new BN(3));
    this.ETHER = (new BN(10)).toPower(18);
    this.AGAINST = this.NO = 1; // against: "won't happen"
    this.ON = this.YES = 2;     // on: "will happen"
    this.SECONDS_PER_BLOCK = 12;

    this.id = 1;
    this.data = {};

    // whisper filters
    this.filters = {}; // key: marketId => {filterId: hexstring, polling: bool}

    // send_call_confirm notifications
    this.notifications = {};

    // price log filters
    this.price_filters = {
        updatePrice: null,
        pricePaid: null,
        priceSold: null
    };

    // contract error codes
    this.ERRORS = {
        "0x": "no response or bad input",
        cash: {
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
        comments: {
            WHISPER_POST_FAILED: {
                error: 65,
                message: "could not post message to whisper"
            }
        },
        web: {
            BAD_CREDENTIALS: {
                error: 403, // forbidden
                message: "incorrect handle or password"
            },
            HANDLE_TAKEN: {
                error: 422, // unprocessable entity
                message: "handle already taken"
            },
            TRANSACTION_INVALID: {
                error: 412,
                message: "transaction validation failed"
            },
            TRANSACTION_FAILED: {
                error: 500,
                message: "transaction failed"
            },
            DB_WRITE_FAILED: {
                error: 98,
                message: "database write failed"
            },
            DB_READ_FAILED: {
                error: 99,
                message: "database read failed"
            }
        }
    };
    this.ERRORS.getSimulatedSell = this.ERRORS.getSimulatedBuy;
    this.ERRORS.sellShares = this.ERRORS.buyShares;

    /**********************
     * Contract addresses *
     **********************/

    /* Ethereum testnet addresses */
    this.testnet_contracts = {
        checkQuorum: "0xe26c5a52d23d259f452eba1855123cf08e388095",
        buyAndSellShares: "0x4382ef4d06f089ced6ed376be3a501c8c7cea30a",
        createBranch: "0x6b35d1d114beae2202c4c7deae2de9ed5d6c4fc0",
        p2pWagers: "0xe7bee8880b86992b7f1ba2ab1cfb8d10329c7972",
        sendReputation: "0xe20508a8f048459e388721476df5c1bc40ce07c2",
        transferShares: "0x9b0e6fa99216b2eb12801f28bd5224ed26902656",
        makeReports: "0x7ee80df8ce2ec9246eb410f4a021d6ba663277f6",
        createEvent: "0xb5283caadc58fc34eab71fcfbb5fdcf29e2b89a7",
        createMarket: "0xff526357314ada4fa3679524e1deaeb155950eaa",
        closeMarket: "0x4c9a2a4dcf1675b9b577672dbb0aff8c03227c8a",
        closeMarketOne: "0x587bdb9bc80cd4b103ba1b3ae2a0d92273fd720f",
        closeMarketTwo: "0x374939e37ae6398b5eba2f3476826b3b861be6c4",
        closeMarketFour: "0x5ba7567a28d2f78ec1b04de490459dec228b8807",
        closeMarketEight: "0xa81ea581fd5257579acb9bb9b75a19f245032dec",
        dispatch: "0xd523d9dadbf00c985d058f7844fabd3f7f10cf98",
        faucets: "0xe68e5920c263d7ae396ba216ec11eaeeb8d64954",
        cash: "0x0cc139a358642026c5ae6ade3ed28460f691db4d",
        info: "0x21607adae6f054274a5b7a3970692a31d4bfb896",
        branches: "0x552454582fe259c644c191448c66e4fce4306437",
        events: "0xb48e92dfcae19d6962c6dd000f67a7a26ee7e8e6",
        expiringEvents: "0x915f35711d96b400908737bb82129580991f6021",
        fxpFunctions: "0x3db6079d2f73f840ca4764c87d16dcca7ddaf1de",
        markets: "0xdb3a35ffe17cf86ffab60857cfe851e6abb7a9ec",
        reporting: "0xc0b05fa75a4b4fbb8e7a2b9e8b08d0b8fbb39f49",
        statistics: "0xc9e4983d90f2cd9a83391c19e01f1a37551a4ae8",
        center: "0x483fafce5e476792f726428b76a80abbb46522b9",
        score: "0xbbd95558ff1dd01ba9e2f014da65c9394ef0ddea",
        adjust: "0xa70f5e35b9d4891a36bdb13f1de37a3ecefd4feb",
        resolve: "0xbdb19659d24194af3b6cdf4737bf65bd60e0b69a",
        payout: "0x0d80452ef8f2a4322d0971447cdf6971b803a5b8",
        redeem_interpolate: "0x8e09f414de02d9ab01fda7cbb564fa6b2de0634b",
        redeem_center: "0x5506d5132292c68fd0fda809b59e40c41075c923",
        redeem_score: "0x08a144646622cdd8b3a4fae3503ebb1ddf481318",
        redeem_adjust: "0x45aa6c182ca9b87d4d5e60029b460f3dfb3b72a6",
        redeem_resolve: "0x88ba7d757f80eb1edfd0eb11dca3b1c835fb040a",
        redeem_payout: "0xcded3f69a0e82c3be134159b20c4596660755236"
    };

    /* Augur private chain (networkid 1010101) addresses */
    this.privatechain_contracts =  {
        checkQuorum: "0xd59846f812fad1eec973b93607836bbab70ec011",
        buyAndSellShares: "0xb083f6ea69afeadfa128bd11c5ac4a1b2d532647",
        createBranch: "0xc5fd2b72a8a555e1308e7a6856638d3c33d971da",
        p2pWagers: "0xdce9d41a27994289a3aeb02a11f34c47173564bf",
        sendReputation: "0x88f8fcd54f0c9058882b5c932bb1a7307aaec5cd",
        transferShares: "0x44df0f279b2e3a9b8120c04fce4fb861acdd0e25",
        makeReports: "0x0a8ff9e0b5a3fc602f1092e66792a34289d09799",
        createEvent: "0x4576bb6805b8ad894bde6f5ef35ce2fd96318c45",
        createMarket: "0x3975c18d35261361e4824af21ab7864754202c5c",
        closeMarket: "0xe485e23a03bc7d54e1163ce2bf795720aee657a8",
        closeMarketOne: "0x3de8a38b7820bdb5770c0ac8969900aaf046186a",
        closeMarketTwo: "0xcc2c62360920de89c9a261421e3d1609ced05fad",
        closeMarketFour: "0x99bd55a0ecb6bd12733841c9aa88bc1073b797ed",
        closeMarketEight: "0x9909d9340effe931c7d5baf9356f035617505938",
        dispatch: "0xe1d8887d7e54742b958d4456c8b7a94ed92e984e",
        faucets: "0x89a428fd820d35253c65ad1c31820a753c33f5ae",
        cash: "0x36886188cdc4617d27d66b79f8df29c13c2f6211",
        info: "0xaaedfa2e3efe271e1892996a3293c109f52fb52d",
        branches: "0x266162e4a9556513bd59c349a56026e6373abbfe",
        events: "0x5da6f084f5349c77bc629c065cbd125d8767edf7",
        expiringEvents: "0xdb77a2b1b81ac56f5b0f8117187879c7ea03dd12",
        fxpFunctions: "0x041b6fb535dcb08e32d2e117009f20eb959d7b68",
        markets: "0xf57cbab860d2a751433b47e3e7a2e4a4431f2fdf",
        reporting: "0x4b24af7db8a8f91d52f73e585bea6b3336fce32d",
        statistics: "0x2cc888c7838814bd50d3af330f0b81696f6586ea",
        center: "0x370607483c7687ec96e12e8470fd4c59dac4545d",
        score: "0x07f66129a55757288f6054b058f76c9cae3b8fa6",
        adjust: "0xfa1c4de24cb1ec6c1c23d993104e7b29c1bec801",
        resolve: "0xdd0d21e3df09908766aa9d2e675281ec68666a86",
        payout: "0xb65059068054116a87ced1144e4a504b895a1d04",
        redeem_interpolate: "0x833b9ecc2e9c2f279367995ea8be3a8e6d4b4021",
        redeem_center: "0x77195e078b94b5ad1ef97be328c483db51b750f1",
        redeem_score: "0x51dda546510bd7fdd67173bd7d9e9421aced2cad",
        redeem_adjust: "0x053a3cc8534407272df836898022fb35eed4b07e",
        redeem_resolve: "0x851eaf083563960cfc600a950dcdcc941c4f11e9",
        redeem_payout: "0x8a8b104e5bdf62ebec8c29010527ff124a9fa993"
    };

    /* Testing private chain (networkid 10101) addresses */
    this.testchain_contracts = {
        checkQuorum: "0x4a61f3db785f1e2a23ffefeafaceeef2df551667",
        buyAndSellShares: "0x3f3276849a878a176b2f02dd48a483e8182a49e4",
        createBranch: "0x60cb05deb51f92ee25ce99f67181ecaeb0b743ea",
        p2pWagers: "0x2e5a882aa53805f1a9da3cf18f73673bca98fa0f",
        sendReputation: "0x7d4b581a0868204b7481c316b430a97fd292a2fb",
        transferShares: "0x8c19616de17acdfbc933b99d9f529a689d22098f",
        makeReports: "0xabe47f122a496a732d6c4b38b3ca376d597d75dd",
        createEvent: "0x448c01a2e1fd6c2ef133402c403d2f48c99993e7",
        createMarket: "0x9308cf21b5a11f182f9707ca284bbb71bb84f893",
        closeMarket: "0xd2e9f7c2fd4635199b8cc9e8128fc4d27c693945",
        closeMarketOne: "0x8caf2c0ce7cdc2e81b58f74322cefdef440b3f8d",
        closeMarketTwo: "0xcd6c7bc634257f82903b182142aae7156d72a200",
        closeMarketFour: "0xc1c4e2f32e4b84a60b8b7983b6356af4269aab79",
        closeMarketEight: "0x52ccb0490bc81a2ae363fccbb2b367bca546cec7",
        dispatch: "0xcece47d6c0a6a1c90521f38ec5bf7550df983804",
        faucets: "0x81a7621e9a286d061b3dea040888a51c96693b1c",
        cash: "0x482c57abdce592b39434e3f619ffc3db62ab6d01",
        info: "0xa34c9f6fc047cea795f69b34a063d32e6cb6288c",
        branches: "0x8f2c2267687cb0f047b28a1b6f945da6e101a0d7",
        events: "0x9fe69262bbaa47f013b7dbd6ca5f01e17446c645",
        expiringEvents: "0xe4714fcbdcdba49629bc408183ef40d120700b8d",
        fxpFunctions: "0x77c424f86a1b80f1e303d1c2651acd6aba653cb6",
        markets: "0xd15a6cfc462ae76b9ec590cab8b34bfa8e1302d7",
        reporting: "0xbd19195b9e8a2d8ed14fc3a2823856b5c16f7f55",
        statistics: "0x708fdfe18bf28afe861a69e95419d183ace003eb",
        center: "0x5f67ab9ff79be97b27ac8f26ef9f4b429b82e2df",
        score: "0x0fbddb6bfb81c8d0965a894567cf4061446072c2",
        adjust: "0x5069d883e31429c6dd1325d961f443007747c7a2",
        resolve: "0x6c4c9fa11d6d8ed2c7a08ddcf4d4654c85194f68",
        payout: "0x8a4e2993a9972ee035453bb5674816fc3a698718",
        redeem_interpolate: "0x35152caa07026203a1add680771afb690d872d7d",
        redeem_center: "0x031d9d02520cc708ea3c865278508c9cdb92bd51",
        redeem_score: "0xc21cfa6688dbfd2eca2548d894aa55fd0bbf1c7e",
        redeem_adjust: "0xe5b327630cfa7f4b2324f9066c897dceecfd88a3",
        redeem_resolve: "0xd70c6e1f3857d23bd96c3e4d2ec346fa7c3931f3",
        redeem_payout: "0x70a893eb9569041e97a3787f0c76a1eb6378d8b2"
    };

    this.contracts = utilities.copy(this.testnet_contracts);
    this.init_contracts = utilities.copy(this.contracts);

    // Network ID
    this.network_id = "0";

    // Branch IDs
    this.branches = {
        demo: '0x00000000000000000000000000000000000000000000000000000000000f69b5',
        alpha: '0x00000000000000000000000000000000000000000000000000000000000f69b5',
        dev: '0x00000000000000000000000000000000000000000000000000000000000f69b5'
    };

    // Demo account (demo.augur.net)
    this.demo = "0xaff9cb4dcb19d13b84761c040c91d21dc6c991ec";

    // Augur transaction object
    this.tx = {

        // faucets.se
        cashFaucet: {
            to: this.contracts.faucets,
            method: "cashFaucet",
            returns: "number",
            send: true
        },
        reputationFaucet: {
            to: this.contracts.faucets,
            method: "reputationFaucet",
            signature: "i",
            returns: "number",
            send: true
        },

        // cash.se
        getCashBalance: {
            to: this.contracts.cash,
            method: "balance",
            signature: "i",
            returns: "unfix"
        },
        sendCash: {
            to: this.contracts.cash,
            method: "send",
            send: true,
            signature: "ii"
        },
        // info.se
        getCreator: {
            to: this.contracts.info,
            method: "getCreator",
            signature: "i"
        },
        getCreationFee: {
            to: this.contracts.info,
            method: "getCreationFee",
            signature: "i",
            returns: "unfix"
        },
        getDescription: {
            to: this.contracts.info,
            method: "getDescription",
            signature: "i",
            returns: "string"
        },

        // redeem_interpolate.se
        redeem_interpolate: {
            to: this.contracts.redeem_interpolate,
            method: "interpolate",
            signature: "iiiii"
        },
        read_ballots: {
            to: this.contracts.redeem_interpolate,
            method: "read_ballots",
            signature: "iiiii"
        },

        // center.se
        center: {
            to: this.contracts.center,
            method: "center",
            signature: "aaaaaii"
        },

        // redeem_center.se
        redeem_center: {
            to: this.contracts.redeem_center,
            method: "center",
            signature: "iiiii",
            returns: "number"
        },
        redeem_covariance: {
            to: this.contracts.redeem_center,
            method: "covariance",
            signature: "iiiii"
        },

        // redeem_score.se
        redeem_blank: {
            to: this.contracts.redeem_score,
            method: "blank",
            signature: "iiiii"
        },
        redeem_loadings: {
            to: this.contracts.redeem_score,
            method: "loadings",
            signature: "iiiii",
            returns: "number"
        },

        // score.se
        blank: {
            to: this.contracts.score,
            method: "blank",
            signature: "iii",
            returns: "number[]"
        },
        loadings: {
            to: this.contracts.score,
            method: "loadings",
            signature: "aaaii",
            returns: "number[]"
        },

        // resolve.se
        resolve: {
            to: this.contracts.resolve,
            method: "resolve",
            signature: "aaaaaii",
            returns: "number[]"
        },

        // redeem_resolve.se
        redeem_resolve: {
            to: this.contracts.redeem_resolve,
            method: "resolve",
            signature: "iiiii",
            returns: "number"
        },

        // branches.se
        getBranches: {
            to: this.contracts.branches,
            method: "getBranches",
            returns: "hash[]"
        },
        getMarkets: {
            to: this.contracts.branches,
            method: "getMarkets",
            signature: "i",
            returns: "hash[]"
        },
        getPeriodLength: {
            to: this.contracts.branches,
            method: "getPeriodLength",
            signature: "i",
            returns: "number"
        },
        getVotePeriod: {
            to: this.contracts.branches,
            method: "getVotePeriod",
            signature: "i",
            returns: "number"
        },
        getStep: {
            to: this.contracts.branches,
            method: "getStep",
            signature: "i",
            returns: "number"
        },
        setStep: {
            to: this.contracts.branches,
            method: "setStep",
            signature: "ii",
            send: true
        },
        getSubstep: {
            to: this.contracts.branches,
            method: "getSubstep",
            signature: "i",
            returns: "number"
        },
        setSubstep: {
            to: this.contracts.branches,
            method: "setSubstep",
            signature: "ii",
            send: true
        },
        incrementSubstep: {
            to: this.contracts.branches,
            method: "incrementSubstep",
            signature: "i",
            send: true
        },
        getNumMarkets: {
            to: this.contracts.branches,
            method: "getNumMarkets",
            signature: "i",
            returns: "number"
        },
        getMinTradingFee: {
            to: this.contracts.branches,
            method: "getMinTradingFee",
            signature: "i",
            returns: "unfix"
        },
        getNumBranches: {
            to: this.contracts.branches,
            method: "getNumBranches",
            returns: "number"
        },
        getBranch: {
            to: this.contracts.branches,
            method: "getBranch",
            signature: "i",
            returns: "hash"
        },
        incrementPeriod: {
            to: this.contracts.branches,
            method: "incrementPeriod",
            signature: "i",
            send: true
        },

        // events.se
        getEventInfo: {
            to: this.contracts.events,
            method: "getEventInfo",
            signature: "i",
            returns: "mixed[]"
        },
        getEventBranch: {
            to: this.contracts.events,
            method: "getEventBranch",
            signature: "i",
            returns: "hash"
        },
        getExpiration: {
            to: this.contracts.events,
            method: "getExpiration",
            signature: "i",
            returns: "number"
        },
        getOutcome: {
            to: this.contracts.events,
            method: "getOutcome",
            signature: "i",
            returns: "unfix"
        },
        getMinValue: {
            to: this.contracts.events,
            method: "getMinValue",
            signature: "i",
            returns: "number"
        },
        getMaxValue: {
            to: this.contracts.events,
            method: "getMaxValue",
            signature: "i",
            returns: "number"
        },
        getNumOutcomes: {
            to: this.contracts.events,
            method: "getNumOutcomes",
            signature: "i",
            returns: "number"
        },

        // expiringEvents.se
        getEvents: {
            to: this.contracts.expiringEvents,
            method: "getEvents",
            signature: "ii",
            returns: "hash[]"
        },
        getNumberEvents: {
            to: this.contracts.expiringEvents,
            method: "getNumberEvents",
            signature: "ii",
            returns: "number"
        },
        getEvent: {
            to: this.contracts.expiringEvents,
            method: "getEvent",
            signature: "iii"
        },
        getTotalRepReported: {
            to: this.contracts.expiringEvents,
            method: "getTotalRepReported",
            signature: "ii",
            returns: "number"
        },
        getReporterBallot: {
            to: this.contracts.expiringEvents,
            method: "getReporterBallot",
            signature: "iii",
            returns: "unfix[]"
        },
        getReport: {
            to: this.contracts.expiringEvents,
            method: "getReport",
            signature: "iiii",
            returns: "unfix"
        },
        getReportHash: {
            to: this.contracts.expiringEvents,
            method: "getReportHash",
            signature: "iii"
        },
        getVSize: {
            to: this.contracts.expiringEvents,
            method: "getVSize",
            signature: "ii",
            returns: "number"
        },
        getReportsFilled: {
            to: this.contracts.expiringEvents,
            method: "getReportsFilled",
            signature: "ii",
            returns: "unfix[]"
        },
        getReportsMask: {
            to: this.contracts.expiringEvents,
            method: "getReportsMask",
            signature: "ii",
            returns: "number[]"
        },
        getWeightedCenteredData: {
            to: this.contracts.expiringEvents,
            method: "getWeightedCenteredData",
            signature: "ii",
            returns: "unfix[]"
        },
        getCovarianceMatrixRow: {
            to: this.contracts.expiringEvents,
            method: "getCovarianceMatrixRow",
            signature: "ii",
            returns: "unfix[]"
        },
        getDeflated: {
            to: this.contracts.expiringEvents,
            method: "getDeflated",
            signature: "ii",
            returns: "unfix[]"
        },
        getLoadingVector: {
            to: this.contracts.expiringEvents,
            method: "getLoadingVector",
            signature: "ii",
            returns: "unfix[]"
        },
        getLatent: {
            to: this.contracts.expiringEvents,
            method: "getLatent",
            signature: "ii",
            returns: "unfix"
        },
        getScores: {
            to: this.contracts.expiringEvents,
            method: "getScores",
            signature: "ii",
            returns: "unfix[]"
        },
        getSetOne: {
            to: this.contracts.expiringEvents,
            method: "getSetOne",
            signature: "ii",
            returns: "unfix[]"
        },
        getSetTwo: {
            to: this.contracts.expiringEvents,
            method: "getSetTwo",
            signature: "ii",
            returns: "unfix[]"
        },
        returnOld: {
            to: this.contracts.expiringEvents,
            method: "returnOld",
            signature: "ii",
            returns: "unfix[]"
        },
        getNewOne: {
            to: this.contracts.expiringEvents,
            method: "getNewOne",
            signature: "ii",
            returns: "unfix[]"
        },
        getNewTwo: {
            to: this.contracts.expiringEvents,
            method: "getNewTwo",
            signature: "ii",
            returns: "unfix[]"
        },
        getAdjPrinComp: {
            to: this.contracts.expiringEvents,
            method: "getAdjPrinComp",
            signature: "ii",
            returns: "unfix[]"
        },
        getSmoothRep: {
            to: this.contracts.expiringEvents,
            method: "getSmoothRep",
            signature: "ii",
            returns: "unfix[]"
        },
        getOutcomesFinal: {
            to: this.contracts.expiringEvents,
            method: "getOutcomesFinal",
            signature: "ii",
            returns: "unfix[]"
        },
        getReporterPayouts: {
            to: this.contracts.expiringEvents,
            method: "getReporterPayouts",
            signature: "ii",
            returns: "unfix[]"
        },
        moveEventsToCurrentPeriod: {
            to: this.contracts.expiringEvents,
            method: "moveEventsToCurrentPeriod",
            signature: "iii",
            send: true
        },
        addEvent: {
            to: this.contracts.expiringEvents,
            method: "addEvent",
            signature: "iii",
            send: true
        },
        setTotalRepReported: {
            to: this.contracts.expiringEvents,
            method: "setTotalRepReported",
            signature: "iii",
            send: true
        },
        setReporterBallot: {
            to: this.contracts.expiringEvents,
            method: "setReporterBallot",
            signature: "iiiai",
            send: true
        },
        setVSize: {
            to: this.contracts.expiringEvents,
            method: "setVSize",
            signature: "iii",
            send: true
        },
        setReportsFilled: {
            to: this.contracts.expiringEvents,
            method: "setReportsFilled",
            signature: "iia",
            send: true
        },
        setReportsMask: {
            to: this.contracts.expiringEvents,
            method: "setReportsMask",
            signature: "iia",
            send: true
        },
        setWeightedCenteredData: {
            to: this.contracts.expiringEvents,
            method: "setWeightedCenteredData",
            signature: "iia",
            send: true
        },
        setCovarianceMatrixRow: {
            to: this.contracts.expiringEvents,
            method: "setCovarianceMatrixRow",
            signature: "iia",
            send: true
        },
        setDeflated: {
            to: this.contracts.expiringEvents,
            method: "setDeflated",
            signature: "iia",
            send: true
        },
        setLoadingVector: {
            to: this.contracts.expiringEvents,
            method: "setLoadingVector",
            signature: "iia",
            send: true
        },
        setScores: {
            to: this.contracts.expiringEvents,
            method: "setScores",
            signature: "iia",
            send: true
        },
        setSetOne: {
            to: this.contracts.expiringEvents,
            method: "setSetOne",
            signature: "iia",
            send: true
        },
        setSetTwo: {
            to: this.contracts.expiringEvents,
            method: "setSetTwo",
            signature: "iia",
            send: true
        },
        setOld: {
            to: this.contracts.expiringEvents,
            method: "setOld",
            signature: "iia",
            send: true
        },
        setNewOne: {
            to: this.contracts.expiringEvents,
            method: "setNewOne",
            signature: "iia",
            send: true
        },
        setNewTwo: {
            to: this.contracts.expiringEvents,
            method: "setNewTwo",
            signature: "iia",
            send: true
        },
        setAdjPrinComp: {
            to: this.contracts.expiringEvents,
            method: "setAdjPrinComp",
            signature: "iia",
            send: true
        },
        setSmoothRep: {
            to: this.contracts.expiringEvents,
            method: "setSmoothRep",
            signature: "iia",
            send: true
        },
        setOutcomesFinal: {
            to: this.contracts.expiringEvents,
            method: "setOutcomesFinal",
            signature: "iia",
            send: true
        },
        setReportHash: {
            to: this.contracts.expiringEvents,
            method: "setReportHash",
            signature: "iii",
            send: true
        },
        getTotalReputation: {
            to: this.contracts.expiringEvents,
            method: "getTotalReputation",
            signature: "ii",
            returns: "unfix"
        },
        setTotalReputation: {
            to: this.contracts.expiringEvents,
            method: "setTotalReputation",
            signature: "iii",
            returns: "number"
        },
        makeBallot: {
            to: this.contracts.expiringEvents,
            method: "makeBallot",
            signature: "ii",
            returns: "hash[]"
        },

        // markets.se
        getSimulatedBuy: {
            to: this.contracts.markets,
            method: "getSimulatedBuy",
            signature: "iii",
            returns: "unfix[]"
        },
        getSimulatedSell: {
            to: this.contracts.markets,
            method: "getSimulatedSell",
            signature: "iii",
            returns: "unfix[]"
        },
        lsLmsr: {
            to: this.contracts.markets,
            method: "lsLmsr",
            signature: "i",
            returns: "unfix"
        },
        getMarketOutcomeInfo: {
            to: this.contracts.markets,
            method: "getMarketOutcomeInfo",
            signature: "ii",
            returns: "hash[]"
        },
        getMarketInfo: {
            to: this.contracts.markets,
            method: "getMarketInfo",
            signature: "i",
            returns: "hash[]"
        },
        getMarketEvents: {
            to: this.contracts.markets,
            method: "getMarketEvents",
            signature: "i",
            returns: "hash[]"
        },
        getNumEvents: {
            to: this.contracts.markets,
            method: "getNumEvents",
            signature: "i",
            returns: "number"
        },
        getBranchID: {
            to: this.contracts.markets,
            method: "getBranchID",
            signature: "i"
        },
        getCurrentParticipantNumber: {
            to: this.contracts.markets,
            method: "getCurrentParticipantNumber",
            signature: "i",
            returns: "number"
        },
        getMarketNumOutcomes: {
            to: this.contracts.markets,
            method: "getMarketNumOutcomes",
            signature: "i",
            returns: "number"
        },
        getParticipantSharesPurchased: {
            to: this.contracts.markets,
            method: "getParticipantSharesPurchased",
            signature: "iii",
            returns: "unfix"
        },
        getSharesPurchased: {
            to: this.contracts.markets,
            method: "getSharesPurchased",
            signature: "ii",
            returns: "unfix"
        },
        getWinningOutcomes: {
            to: this.contracts.markets,
            method: "getWinningOutcomes",
            signature: "i",
            returns: "number[]"
        },
        price: {
            to: this.contracts.markets,
            method: "price",
            signature: "ii",
            returns: "unfix"
        },
        getParticipantNumber: {
            to: this.contracts.markets,
            method: "getParticipantNumber",
            signature: "ii",
            returns: "number"
        },
        getParticipantID: {
            to: this.contracts.markets,
            method: "getParticipantID",
            signature: "ii"
        },
        getAlpha: {
            to: this.contracts.markets,
            method: "getAlpha",
            signature: "i",
            returns: "unfix"
        },
        getCumScale: {
            to: this.contracts.markets,
            method: "getCumScale",
            signature: "i",
            returns: "unfix"
        },
        getTradingPeriod: {
            to: this.contracts.markets,
            method: "getTradingPeriod",
            signature: "i",
            returns: "number"
        },
        getTradingFee: {
            to: this.contracts.markets,
            method: "getTradingFee",
            signature: "i",
            returns: "unfix"
        },

        // reporting.se
        getRepBalance: {
            to: this.contracts.reporting,
            method: "getRepBalance",
            signature: "ii",
            returns: "unfix"
        },
        getRepByIndex: {
            to: this.contracts.reporting,
            method: "getRepByIndex",
            signature: "ii",
            returns: "unfix"
        },
        getReporterID: {
            to: this.contracts.reporting,
            method: "getReporterID",
            signature: "ii"
        },
        getReputation: {
            to: this.contracts.reporting,
            method: "getReputation",
            signature: "i",
            returns: "number[]"
        },
        getNumberReporters: {
            to: this.contracts.reporting,
            method: "getNumberReporters",
            signature: "i",
            returns: "number"
        },
        repIDToIndex: {
            to: this.contracts.reporting,
            method: "repIDToIndex",
            signature: "ii",
            returns: "number"
        },
        getTotalRep: {
            to: this.contracts.reporting,
            method: "getTotalRep",
            signature: "i",
            returns: "unfix"
        },
        hashReport: {
            to: this.contracts.reporting,
            method: "hashReport",
            signature: "ai"
        },

        // checkQuorum.se
        checkQuorum: {
            to: this.contracts.checkQuorum,
            method: "checkQuorum",
            signature: "i",
            returns: "number"
        },

        // buy&sellShares.se
        getNonce: {
            to: this.contracts.buyAndSellShares,
            method: "getNonce",
            signature: "i",
            returns: "number"
        },
        buyShares: {
            to: this.contracts.buyAndSellShares,
            method: "buyShares",
            signature: "iiiiii",
            send: true
        },
        sellShares: {
            to: this.contracts.buyAndSellShares,
            method: "sellShares",
            signature: "iiiiii",
            send: true
        },

        // createBranch.se
        createSubbranch: {
            to: this.contracts.createBranch,
            method: "createSubbranch",
            signature: "siii",
            send: true
        },

        // sendReputation.se
        sendReputation: {
            to: this.contracts.sendReputation,
            method: "sendReputation",
            signature: "iii",
            send: true
        },

        // makeReports.se
        report: {
            to: this.contracts.makeReports,
            method: "report",
            signature: "iaii",
            returns: "number",
            send: true
        },
        submitReportHash: {
            to: this.contracts.makeReports,
            method: "submitReportHash",
            signature: "iii",
            returns: "number",
            send: true
        },
        checkReportValidity: {
            to: this.contracts.makeReports,
            method: "checkReportValidity",
            signature: "iai",
            returns: "number"
        },
        slashRep: {
            to: this.contracts.makeReports,
            method: "slashRep",
            signature: "iiiai",
            returns: "number",
            send: true
        },

        // createEvent.se
        createEvent: {
            to: this.contracts.createEvent,
            method: "createEvent",
            signature: "isiiiii",
            send: true
        },

        // createMarket.se
        createMarket: {
            to: this.contracts.createMarket,
            method: "createMarket",
            signature: "isiiiai",
            send: true
        },

        // closeMarket.se
        closeMarket: {
            to: this.contracts.closeMarket,
            method: "closeMarket",
            signature: "ii",
            returns: "number",
            send: true
        },

        // dispatch.se
        dispatch: {
            to: this.contracts.dispatch,
            method: "dispatch",
            signature: "i",
            returns: "number"
        }
    };
}

var augur = new Augur();

/*********************
 * Utility functions *
 *********************/

Augur.prototype.has_value = function (o, v) {
    for (var p in o) {
        if (o.hasOwnProperty(p)) {
            if (o[p] === v) return p;
        }
    }
};

// calculate date from block number
Augur.prototype.block_to_date = function (block) {
    var current_block = this.blockNumber();
    var seconds = (block - current_block) * this.SECONDS_PER_BLOCK;
    var date = moment().add(seconds, 'seconds');
    return date;
};

Augur.prototype.date_to_block = function (date) {
    date = moment(new Date(date));
    var current_block = this.blockNumber();
    var now = moment();
    var seconds_delta = date.diff(now, 'seconds');
    var block_delta = parseInt(seconds_delta / this.SECONDS_PER_BLOCK);
    return current_block + block_delta;
};

/***********************************
 * Contract ABI data serialization *
 ***********************************/

Augur.prototype.abi = {

    ONE: (new BN(2)).toPower(64),

    MAXBITS: (new BN(2)).toPower(256),

    MAXNUM: (new BN(2)).toPower(255),

    prefix_hex: function (n) {
        if (n.constructor === Number || n.constructor === BN) {
            n = n.toString(16);
        }
        if (n.slice(0,2) !== "0x" && n.slice(0,3) !== "-0x") {
            if (n.slice(0,1) === '-') {
                n = "-0x" + n.slice(1);
            } else {
                n = "0x" + n;
            }
        }
        return n;
    },

    bignum: function (n, encoding, compact) {
        var bn, len;
        if (n !== null && n !== undefined && n !== "0x") {
            if (n.constructor === Number) {
                if (Math.floor(Math.log(n) / Math.log(10) + 1) <= 15) {
                    bn = new BN(n);
                } else {
                    n = n.toString();
                    try {
                        bn = new BN(n);
                    } catch (exc) {
                        if (n.slice(0,1) === '-') {
                            bn = new BN("-0x" + n.slice(1));
                        }
                        bn = new BN("0x" + n);
                    }
                }
            } else if (n.constructor === String) {
                try {
                    bn = new BN(n);
                } catch (exc) {
                    if (n.slice(0,1) === '-') {
                        bn = new BN("-0x" + n.slice(1));
                    }
                    bn = new BN("0x" + n);
                }
            } else if (n.constructor === BN) {
                bn = n;
            } else if (n.constructor === Array ) {
                len = n.length;
                bn = new Array(len);
                for (var i = 0; i < len; ++i) {
                    bn[i] = this.bignum(n[i]);
                }
            }
            if (bn && bn.constructor !== Array && bn.gt(this.MAXNUM)) {
                bn = bn.sub(this.MAXBITS);
            }
            if (compact && bn.constructor !== Array) {
                var cbn = bn.sub(this.MAXBITS);
                if (bn.toString(16).length > cbn.toString(16).length) {
                    bn = cbn;
                }
            }
            if (bn && encoding) {
                if (encoding === "number") {
                    bn = bn.toNumber();
                } else if (encoding === "string") {
                    bn = bn.toFixed();
                } else if (encoding === "hex") {
                    bn = bn.toString(16);
                }
            }
            return bn;
        } else {
            return n;
        }
    },

    /**************************
     * Fixed-point conversion *
     **************************/

    fix: function (n, encode) {
        var fixed;
        if (n && n !== "0x") {
            if (encode) encode = encode.toLowerCase();
            if (n.constructor === Array) {
                var len = n.length;
                fixed = new Array(len);
                for (var i = 0; i < len; ++i) {
                    fixed[i] = this.fix(n[i], encode);
                }
            } else {
                if (n.constructor === BN) {
                    fixed = n.mul(this.ONE).round();
                } else {
                    fixed = this.bignum(n).mul(this.ONE).round();
                }
                if (fixed && fixed.gt(this.MAXNUM)) {
                    fixed = fixed.sub(this.MAXBITS);
                }
                if (encode) {
                    if (encode === "string") {
                        fixed = fixed.toFixed();
                    } else if (encode === "hex") {
                        fixed = this.prefix_hex(fixed);
                    }
                }
            }
            return fixed;
        } else {
            return n;
        }
    },

    unfix: function (n, encode) {
        var unfixed;
        if (n && n !== "0x") {
            if (encode) encode = encode.toLowerCase();
            if (n.constructor === Array) {
                var len = n.length;
                unfixed = new Array(len);
                for (var i = 0; i < len; ++i) {
                    unfixed[i] = this.unfix(n[i], encode);
                }
            } else {
                if (n.constructor === BN) {
                    unfixed = n.dividedBy(this.ONE);
                } else {
                    unfixed = this.bignum(n).dividedBy(this.ONE);
                }
                if (encode) {
                    if (encode === "hex") {
                        unfixed = this.prefix_hex(unfixed);
                    } else if (encode === "string") {
                        unfixed = unfixed.toFixed();
                    } else if (encode === "number") {
                        unfixed = unfixed.toNumber();
                    }
                }
            }
            return unfixed;
        } else {
            return n;
        }
    },

    encode_int: function (value) {
        var cs = [];
        var x = new BN(value);
        while (x.gt(new BN(0))) {
            cs.push(String.fromCharCode(x.mod(new BN(256))));
            x = x.dividedBy(new BN(256)).floor();
        }
        return (cs.reverse()).join('');
    },

    remove_leading_zeros: function (h) {
        var hex = h.toString();
        if (hex.slice(0, 2) === "0x") {
            hex = hex.slice(2);
        }
        if (!/^0+$/.test(hex)) {
            while (hex.slice(0, 2) === "00") {
                hex = hex.slice(2);
            }
        }
        return hex;
    },

    remove_trailing_zeros: function (h) {
        var hex = h.toString();
        while (hex.slice(-2) === "00") {
            hex = hex.slice(0,-2);
        }
        return hex;
    },

    encode_hex: function (str) {
        var hexbyte, hex = '';
        for (var i = 0, len = str.length; i < len; ++i) {
            hexbyte = str.charCodeAt(i).toString(16);
            if (hexbyte.length === 1) hexbyte = "0" + hexbyte;
            hex += hexbyte;
        }
        return hex;
    },

    decode_hex: function (h, strip) {
        var hex = h.toString();
        var str = '';
        // first 32 bytes = new ABI offset
        // second 32 bytes = string length
        if (strip) {
            if (hex.slice(0,2) === "0x") hex = hex.slice(2);
            hex = hex.slice(128);
            hex = this.remove_trailing_zeros(hex);
        }
        for (var i = 0, l = hex.length; i < l; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    },

    pad_right: function (s) {
        var output = s;
        while (output.length < 64) {
            output += '0';
        }
        return output;
    },

    pad_left: function (r, ishex) {
        var output = r;
        if (!ishex) output = this.encode_hex(output);
        while (output.length < 64) {
            output = '0' + output;
        }
        return output;
    },

    get_prefix: function (funcname, signature) {
        signature = signature || "";
        var summary = funcname + "(";
        for (var i = 0, len = signature.length; i < len; ++i) {
            switch (signature[i]) {
                case 's':
                    summary += "bytes";
                    break;
                case 'i':
                    summary += "int256";
                    break;
                case 'a':
                    summary += "int256[]";
                    break;
                default:
                    summary += "weird";
            }
            if (i !== len - 1) summary += ",";
        }
        var prefix = keccak_256(summary + ")").slice(0, 8);
        while (prefix.slice(0, 1) === '0') {
            prefix = prefix.slice(1);
        }
        return "0x" + prefix;
    },

    // hex-encode a function's ABI data and return it
    encode: function (itx) {
        var tx = utilities.copy(itx);
        tx.signature = tx.signature || "";
        var stat, statics = '';
        var dynamic, dynamics = '';
        var num_params = tx.signature.length;
        var data_abi = this.get_prefix(tx.method, tx.signature);
        var types = [];
        for (var i = 0, len = tx.signature.length; i < len; ++i) {
            if (tx.signature[i] === 's') {
                types.push("bytes");
            } else if (tx.signature[i] === 'a') {
                types.push("int256[]");
            } else {
                types.push("int256");
            }
        }
        if (tx.params !== undefined && tx.params !== null && tx.params !== [] && tx.params !== "") {
            if (tx.params.constructor === String) {
                if (tx.params.slice(0,1) === "[" && tx.params.slice(-1) === "]") {
                    tx.params = JSON.parse(tx.params);
                }
                if (tx.params.constructor === String) {
                    tx.params = [tx.params];
                }
            } else if (tx.params.constructor === Number) {
                tx.params = [tx.params];
            }
        } else {
            tx.params = [];
        }
        if (num_params === tx.params.length) {
            for (i = 0, len = types.length; i < len; ++i) {
                if (types[i] === "int256") {
                    if (tx.params[i] !== undefined && tx.params[i] !== null && tx.params[i] !== [] && tx.params[i] !== "") {
                        if (tx.params[i].constructor === Number) {
                            stat = this.bignum(tx.params[i]);
                            if (stat !== 0) {
                                stat = stat.mod(this.MAXBITS).toFixed();
                            } else {
                                stat = stat.toFixed();
                            }
                            statics += this.pad_left(this.encode_int(stat));
                        } else if (tx.params[i].constructor === String) {
                            if (tx.params[i].slice(0,1) === '-') {
                                stat = this.bignum(tx.params[i]).mod(this.MAXBITS).toFixed();
                                statics += this.pad_left(this.encode_int(stat));
                            } else if (tx.params[i].slice(0,2) === "0x") {
                                statics += this.pad_left(tx.params[i].slice(2), true);
                            } else {
                                stat = this.bignum(tx.params[i]).mod(this.MAXBITS);
                                statics += this.pad_left(this.encode_int(stat));
                            }
                        }
                    }
                } else if (types[i] === "bytes" || types[i] === "string") {
                    // offset (in 32-byte chunks)
                    stat = 32*num_params + 0.5*dynamics.length;
                    stat = this.bignum(stat).mod(this.MAXBITS).toFixed();
                    statics += this.pad_left(this.encode_int(stat));
                    dynamics += this.pad_left(this.encode_int(tx.params[i].length));
                    dynamics += this.pad_right(this.encode_hex(tx.params[i]));
                } else if (types[i] === "int256[]") {
                    stat = 32*num_params + 0.5*dynamics.length;
                    stat = this.bignum(stat).mod(this.MAXBITS).toFixed();
                    statics += this.pad_left(this.encode_int(stat));
                    var arraylen = tx.params[i].length;
                    dynamics += this.pad_left(this.encode_int(arraylen));
                    for (var j = 0; j < arraylen; ++j) {
                        if (tx.params[i][j] !== undefined) {
                            if (tx.params[i][j].constructor === Number) {
                                dynamic = this.bignum(tx.params[i][j]).mod(this.MAXBITS).toFixed();
                                dynamics += this.pad_left(this.encode_int(dynamic));
                            } else if (tx.params[i][j].constructor === String) {
                                if (tx.params[i][j].slice(0,1) === '-') {
                                    dynamic = this.bignum(tx.params[i][j]).mod(this.MAXBITS).toFixed();
                                    dynamics += this.pad_left(this.encode_int(dynamic));
                                } else if (tx.params[i][j].slice(0,2) === "0x") {
                                    dynamics += this.pad_left(tx.params[i][j].slice(2), true);
                                } else {
                                    dynamic = this.bignum(tx.params[i][j]).mod(this.MAXBITS);
                                    dynamics += this.pad_left(this.encode_int(dynamic));
                                }
                            }
                        }
                    }
                }
            }
            return data_abi + statics + dynamics;
        } else {
            return new Error("wrong number of parameters");
        }
    }
};

/********************************
 * Parse Ethereum response JSON *
 ********************************/

Augur.prototype.parse_array = function (string, returns, stride, init) {
    var elements, array, position;
    if (string.length >= 66) {
        stride = stride || 64;
        elements = Math.ceil((string.length - 2) / stride);
        array = new Array(elements);
        position = init || 2;
        for (var i = 0; i < elements; ++i) {
            array[i] = this.abi.prefix_hex(string.slice(position, position + stride));
            position += stride;
        }
        if (array.length) {
            if (parseInt(array[0]) === array.length - 1) {
                array.splice(0, 1);
            } else if (parseInt(array[1]) === array.length - 2 ||
                parseInt(array[1]) / 32 === array.length - 2) {
                array.splice(0, 2);
            }
        }
        for (i = 0; i < array.length; ++i) {
            if (returns === "hash[]" && this.BigNumberOnly) {
                array[i] = this.abi.bignum(array[i]);
            } else {
                if (returns === "number[]") {
                    array[i] = this.abi.bignum(array[i]).toFixed();
                } else if (returns === "unfix[]") {
                    if (this.BigNumberOnly) {
                        array[i] = this.abi.unfix(array[i]);
                    } else {
                        array[i] = this.abi.unfix(array[i], "string");
                    }
                }
            }
        }
        return array;
    } else {
        return string;
    }
};

Augur.prototype.format_result = function (returns, result) {
    returns = returns.toLowerCase();
    if (result && result !== "0x") {
        if (returns && returns.slice(-2) === "[]") {
            result = this.parse_array(result, returns);
        } else if (returns === "string") {
            result = this.abi.decode_hex(result, true);
        } else {
            if (this.BigNumberOnly) {
                if (returns === "unfix") {
                    result = this.abi.unfix(result);
                }
                if (result.constructor !== BN) {
                    result = this.abi.bignum(result);
                }
            } else {
                if (returns === "number") {
                    result = this.abi.bignum(result).toFixed();
                } else if (returns === "bignumber") {
                    result = this.abi.bignum(result);
                } else if (returns === "unfix") {
                    result = this.abi.unfix(result, "string");
                }
            }
        }
    }
    return result;
};

Augur.prototype.parse = function (response, returns, callback) {
    var results, len;
    try {
        if (response !== undefined) {
            response = JSON.parse(response);
            if (response.error) {
                response = {
                    error: response.error.code,
                    message: response.error.message
                };
                if (callback) {
                    callback(response);
                } else {
                    return response;
                }
            } else if (response.result !== undefined) {
                if (returns) {
                    response.result = this.format_result(returns, response.result);
                } else {
                    if (response.result && response.result.length > 2 && response.result.slice(0,2) === "0x") {
                        response.result = this.abi.remove_leading_zeros(response.result);
                        response.result = this.abi.prefix_hex(response.result);
                    }
                }
                if (callback) {
                    callback(response.result);
                } else {
                    return response.result;
                }
            } else if (response.constructor === Array && response.length) {
                len = response.length;
                results = new Array(len);
                for (var i = 0; i < len; ++i) {
                    results[i] = response[i].result;
                    if (response.error) {
                        console.error(
                            "[" + response.error.code + "]",
                            response.error.message
                        );
                    } else if (response[i].result !== undefined) {
                        if (returns[i]) {
                            results[i] = this.format_result(returns[i], response[i].result);
                        } else {
                            results[i] = this.abi.remove_leading_zeros(results[i]);
                            results[i] = this.abi.prefix_hex(results[i]);
                        }
                    }
                }
                if (callback) {
                    callback(results);
                } else {
                    return results;
                }
            // no result or error field
            } else {
                if (callback) {
                    callback(response);
                } else {
                    return response;
                }
            }
        }
    } catch (e) {
        if (callback) {
            callback(e);
        } else {
            return e;
        }
    }
};

/********************************************
 * Post JSON-RPC command to Ethereum client *
 ********************************************/

Augur.prototype.strip_returns = function (tx) {
    var returns;
    if (tx.params !== undefined && tx.params.length && tx.params[0] && tx.params[0].returns) {
        returns = tx.params[0].returns;
        delete tx.params[0].returns;
    }
    return returns;
};

Augur.prototype.json_rpc = function (command, callback) {
    var self, protocol, host, port, rpc_url, num_commands, returns, req;
    self = this;
    req = null;
    protocol = this.RPC.protocol || "http";
    host = this.RPC.host || "127.0.0.1";
    port = this.RPC.port || "8545";
    rpc_url = protocol + "://" + host + ":" + port;
    if (command.constructor === Array) {
        num_commands = command.length;
        returns = new Array(num_commands);
        for (var i = 0; i < num_commands; ++i) {
            returns[i] = this.strip_returns(command[i]);
        }
    } else {
        returns = this.strip_returns(command);
    }
    if (NODE_JS) {
        // asynchronous if callback exists
        if (callback && callback.constructor === Function) {
            req = new XHR2();
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    self.parse(req.responseText, returns, callback);
                }
            };
            req.open("POST", rpc_url, true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(command));
        } else {
            return this.parse(request('POST', rpc_url, {
                json: command
            }).getBody().toString(), returns);
        }
    } else {
        command = JSON.stringify(command);
        if (window.XMLHttpRequest) {
            req = new window.XMLHttpRequest();
        } else {
            req = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        // asynchronous if callback exists
        if (callback && callback.constructor === Function) {
            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    self.parse(req.responseText, returns, callback);
                }
            };
            req.open("POST", rpc_url, true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(command);
        } else {
            req.open("POST", rpc_url, false);
            req.setRequestHeader("Content-type", "application/json");
            req.send(command);
            return this.parse(req.responseText, returns);
        }
    }
};

Augur.prototype.postdata = function (command, params, prefix) {
    this.data = {
        id: this.id++,
        jsonrpc: "2.0"
    };
    if (prefix === "null") {
        this.data.method = command.toString();
    } else {
        this.data.method = (prefix || "eth_") + command.toString();
    }
    if (params !== undefined && params !== null) {
        if (params.constructor === Array) {
            this.data.params = params;
        } else {
            this.data.params = [params];
        }
    } else {
        this.data.params = [];
    }
    return this.data;
};

/******************************
 * Ethereum JSON-RPC bindings *
 ******************************/

Augur.prototype.raw = function (command, params, f) {
    return this.json_rpc(this.postdata(command, params, "null"), f);
};

Augur.prototype.eth = function (command, params, f) {
    return this.json_rpc(this.postdata(command, params), f);
};

Augur.prototype.net = function (command, params, f) {
    return this.json_rpc(this.postdata(command, params, "net_"), f);
};

Augur.prototype.web3 = function (command, params, f) {
    return this.json_rpc(this.postdata(command, params, "web3_"), f);
};

Augur.prototype.db = function (command, params, f) {
    return this.json_rpc(this.postdata(command, params, "db_"), f);
};

Augur.prototype.shh = function (command, params, f) {
    return this.json_rpc(this.postdata(command, params, "shh_"), f);
};

Augur.prototype.hash = Augur.prototype.sha3 = function (data, f) {
    return this.json_rpc(this.postdata("sha3", data.toString(), "web3_"), f);
};

Augur.prototype.gasPrice = function (f) {
    return this.json_rpc(this.postdata("gasPrice"), f);
};

Augur.prototype.blockNumber = function (f) {
    if (f) {
        this.json_rpc(this.postdata("blockNumber"), f);
    } else {
        return parseInt(this.json_rpc(this.postdata("blockNumber")));
    }
};

Augur.prototype.getBalance = Augur.prototype.balance = function (address, block, f) {
    return this.json_rpc(this.postdata("getBalance", [address || this.coinbase, block || "latest"]), f);
};

Augur.prototype.getTransactionCount = Augur.prototype.txCount = function (address, f) {
    return this.json_rpc(this.postdata("getTransactionCount", address || this.coinbase), f);
};

Augur.prototype.sendEther = Augur.prototype.pay = function (to, value, from, onSent, onSuccess, onFailed) {
    var self = this;
    from = from || this.json_rpc(this.postdata("coinbase"));
    if (from !== this.demo) {
        var tx, txhash;
        if (to && to.value) {
            value = to.value;
            if (to.from) from = to.from || this.coinbase;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        tx = {
            from: from,
            to: to,
            value: this.abi.bignum(value).mul(this.ETHER).toFixed()
        };
        if (onSent) {
            this.sendTx(tx, function (txhash) {
                if (txhash) {
                    onSent(txhash);
                    if (onSuccess) self.tx_notify(0, value, tx, txhash, null, onSent, onSuccess, onFailed);
                }
            });
        } else {
            txhash = this.sendTx(tx);
            if (txhash) {
                if (onSuccess) this.tx_notify(0, value, tx, txhash, null, onSent, onSuccess, onFailed);
                return txhash;
            }
        }
    }
};

Augur.prototype.sign = function (address, data, f) {
    return this.json_rpc(this.postdata("sign", [address, data]), f);
};

Augur.prototype.getTransaction = Augur.prototype.getTx = function (hash, f) {
    return this.json_rpc(this.postdata("getTransactionByHash", hash), f);
};

Augur.prototype.peerCount = function (f) {
    if (f) {
        this.json_rpc(this.postdata("peerCount", [], "net_"), f);
    } else {
        return parseInt(this.json_rpc(this.postdata("peerCount", [], "net_")));
    }
};

Augur.prototype.accounts = function (f) {
    return this.json_rpc(this.postdata("accounts"), f);
};

Augur.prototype.mining = function (f) {
    return this.json_rpc(this.postdata("mining"), f);
};

Augur.prototype.hashrate = function (f) {
    if (f) {
        this.json_rpc(this.postdata("hashrate"), f);
    } else {
        return parseInt(this.json_rpc(this.postdata("hashrate")));
    }
};

Augur.prototype.getBlockByHash = function (hash, full, f) {
    return this.json_rpc(this.postdata("getBlockByHash", [hash, full || false]), f);
};

Augur.prototype.getBlockByNumber = function (number, full, f) {
    return this.json_rpc(this.postdata("getBlockByNumber", [number, full || false]), f);
};

Augur.prototype.netVersion = Augur.prototype.version = function (f) {
    return this.json_rpc(this.postdata("version", [], "net_"), f);
};

// estimate a transaction's gas cost
Augur.prototype.estimateGas = function (tx, f) {
    tx.to = tx.to || "";
    return this.json_rpc(this.postdata("estimateGas", tx), f);
};

// execute functions on contracts on the blockchain
Augur.prototype.call = function (tx, f) {
    tx.to = tx.to || "";
    tx.gas = (tx.gas) ? this.abi.prefix_hex(tx.gas.toString(16)) : this.default_gas;
    return this.json_rpc(this.postdata("call", tx), f);
};

Augur.prototype.sendTransaction = Augur.prototype.sendTx = function (tx, f) {
    tx.to = tx.to || "";
    tx.gas = (tx.gas) ? this.abi.prefix_hex(tx.gas.toString(16)) : this.default_gas;
    return this.json_rpc(this.postdata("sendTransaction", tx), f);
};

// IN: RLP(tx.signed(privateKey))
// OUT: txhash
Augur.prototype.sendRawTransaction = Augur.prototype.sendRawTx = function (rawTx, f) {
    return this.json_rpc(this.postdata("sendRawTransaction", rawTx), f);
};

Augur.prototype.getTransactionReceipt = Augur.prototype.receipt = function (txhash, f) {
    return this.json_rpc(this.postdata("getTransactionReceipt", txhash), f);
};

// publish a new contract to the blockchain (from the coinbase account)
Augur.prototype.publish = function (compiled, f) {
    return this.sendTx({ from: this.coinbase, data: compiled }, f);
};

// Read the code in a contract on the blockchain
Augur.prototype.getCode = Augur.prototype.read = function (address, block, f) {
    return this.json_rpc(this.postdata("getCode", [address, block || "latest"]), f);
};

/*******************************
 * Ethereum network connection *
 *******************************/

Augur.prototype.connect = function (rpcinfo, chain) {

    var default_rpc = function () {
        this.RPC = {
            protocol: this.default_protocol,
            host: "127.0.0.1",
            port: 8545
        };
        return false;
    }.bind(this);

    var rpc, key;
    if (rpcinfo) {
        if (rpcinfo.constructor === Object) {
            if (rpcinfo.protocol) this.RPC.protocol = rpcinfo.protocol;
            if (rpcinfo.host) this.RPC.host = rpcinfo.host;
            if (rpcinfo.port) {
                this.RPC.port = rpcinfo.port;
            } else {
                if (rpcinfo.host) {
                    rpc = rpcinfo.host.split(":");
                    if (rpc.length === 2) {
                        this.RPC.host = rpc[0];
                        this.RPC.port = rpc[1];
                    }
                }
            }
            if (rpcinfo.chain) chain = rpcinfo.chain;
        } else if (rpcinfo.constructor === String) {
            try {
                rpc = rpcinfo.split("://");
                console.assert(rpc.length === 2);
                this.RPC.protocol = rpc[0];
                rpc = rpc[1].split(':');
                if (rpc.length === 2) {
                    this.RPC.host = rpc[0];
                    this.RPC.port = rpc[1];
                } else {
                    this.RPC.host = rpc;
                }
            } catch (e) {
                try {
                    rpc = rpcinfo.split(':');
                    if (rpc.length === 2) {
                        this.RPC.host = rpc[0];
                        this.RPC.port = rpc[1];
                    } else {
                        this.RPC.host = rpc;
                    }
                } catch (exc) {
                    return default_rpc();
                }
            }
        }
    } else {
        default_rpc();
    }
    try {
        if (JSON.stringify(this.contracts) === JSON.stringify(this.init_contracts)) {
            if (chain) {
                if (chain === "1010101" || chain === 1010101) {
                    this.contracts = utilities.copy(this.privatechain_contracts);
                } else if (chain === "10101" || chain === 10101) {
                    this.contracts = utilities.copy(this.testchain_contracts);
                }
            } else {
                chain = this.json_rpc(this.postdata("version", [], "net_"));
                if (chain === "1010101" || chain === 1010101) {
                    this.contracts = utilities.copy(this.privatechain_contracts);
                } else if (chain === "10101" || chain === 10101) {
                    this.contracts = utilities.copy(this.testchain_contracts);
                } else {
                    this.contracts = utilities.copy(this.testnet_contracts);
                }
            }
            this.network_id = chain || "0";
        }
        this.coinbase = this.json_rpc(this.postdata("coinbase"));
        if (!this.coinbase) {
            var accounts = this.accounts();
            var num_accounts = accounts.length;
            if (num_accounts === 1) {
                this.coinbase = accounts[0];
            } else {
                for (var i = 0; i < num_accounts; ++i) {
                    if (!this.sign(accounts[i], "1010101").error) {
                        this.coinbase = accounts[i];
                        break;
                    }
                }
            }
        }
        if (this.coinbase && this.coinbase !== "0x") {
            for (var method in this.tx) {
                if (!this.tx.hasOwnProperty(method)) continue;
                this.tx[method].from = this.coinbase;
                key = this.has_value(this.init_contracts, this.tx[method].to);
                if (key) {
                    this.tx[method].to = this.contracts[key];
                }
            }
        } else {
            return default_rpc();
        }
        if (this.coinbase) this.init_contracts = utilities.copy(this.contracts);
        return true;
    } catch (exc) {
        return default_rpc();
    }
};

Augur.prototype.connected = function () {
    try {
        this.json_rpc(this.postdata("coinbase"));
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Invoke a function from a contract on the blockchain.
 *
 * Input tx format:
 * {
 *    from: <sender's address> (hexstring; optional, coinbase default)
 *    to: <contract address> (hexstring)
 *    method: <function name> (string)
 *    signature: <function signature, e.g. "iia"> (string)
 *    params: <parameters passed to the function> (optional)
 *    returns: <"number[]", "int", "BigNumber", or "string" (default)>
 *    send: <true to sendTransaction, false to call (default)>
 * }
 */
Augur.prototype.invoke = function (itx, f) {
    var tx, data_abi, packaged, invocation, invoked;
    if (itx) {
        tx = utilities.copy(itx);
        if (tx.params !== undefined) {
            if (tx.params.constructor === Array) {
                for (var i = 0, len = tx.params.length; i < len; ++i) {
                    if (tx.params[i] !== undefined &&
                        tx.params[i].constructor === BN) {
                        tx.params[i] = tx.params[i].toFixed();
                    }
                }
            } else if (tx.params.constructor === BN) {
                tx.params = tx.params.toFixed();
            }
        }
        if (tx.to) tx.to = this.abi.prefix_hex(tx.to);
        if (tx.from) tx.from = this.abi.prefix_hex(tx.from);
        data_abi = this.abi.encode(tx);
        if (data_abi) {
            packaged = {
                from: tx.from || this.coinbase,
                to: tx.to,
                data: data_abi
            };
            if (tx.returns) packaged.returns = tx.returns;
            invocation = (tx.send) ? this.sendTx : this.call;
            invoked = true;
            return invocation.call(this, packaged, f);
        }
    }
    if (!invoked) {
        return "Error invoking " + tx.method + "@" + tx.to + "\n"+
            "Expected transaction format:" + JSON.stringify({
                from: "<sender's address> (hexstring; optional, coinbase default)",
                to: "<contract address> (hexstring)",
                method: "<function name> (string)",
                signature: '<function signature, e.g. "iia"> (string)',
                params: "<parameters passed to the function> (optional)",
                returns: '<"number[]", "int", "BigNumber", or "string" (default)>',
                send: '<true to sendTransaction, false to call (default)>'
            });
    }
};

/************************
 * Batched RPC commands *
 ************************/

Augur.prototype.batch = function (txlist, f) {
    var num_commands, rpclist, callbacks, tx, data_abi, packaged, invocation;
    if (txlist.constructor === Array) {
        num_commands = txlist.length;
        rpclist = new Array(num_commands);
        callbacks = new Array(num_commands);
        for (var i = 0; i < num_commands; ++i) {
            tx = utilities.copy(txlist[i]);
            if (tx.params !== undefined) {
                if (tx.params.constructor === Array) {
                    for (var j = 0, len = tx.params.length; j < len; ++j) {
                        if (tx.params[j].constructor === BN) {
                            tx.params[j] = tx.params[j].toFixed();
                        }
                    }
                } else if (tx.params.constructor === BN) {
                    tx.params = tx.params.toFixed();
                }
            }
            if (tx.from) tx.from = this.abi.prefix_hex(tx.from);
            tx.to = this.abi.prefix_hex(tx.to);
            data_abi = this.abi.encode(tx);
            if (data_abi) {
                if (tx.callback && tx.callback.constructor === Function) {
                    callbacks[i] = tx.callback;
                    delete tx.callback;
                }
                packaged = {
                    from: tx.from || this.coinbase,
                    to: tx.to,
                    data: data_abi
                };
                if (tx.returns) packaged.returns = tx.returns;
                invocation = (tx.send) ? "sendTransaction" : "call";
                rpclist[i] = this.postdata(invocation, packaged);
            } else {
                log("unable to package commands for batch RPC");
                return rpclist;
            }
        }
        if (f) {
            if (f.constructor === Function) { // callback on whole array
                this.json_rpc(rpclist, f);
            } else if (f === true) {
                this.json_rpc(rpclist, function (res) {
                    if (res) {
                        if (res.constructor === Array && res.length) {
                            for (j = 0; j < num_commands; ++j) {
                                if (res[j] && callbacks[j]) {
                                    callbacks[j](res[j]);
                                }
                            }
                        } else {
                            if (callbacks.length && callbacks[0]) {
                                callbacks[0](res);
                            }
                        }
                    }
                });
            }
        } else {
            return this.json_rpc(rpclist, f);
        }
    } else {
        log("expected array for batch RPC, invoking instead");
        return this.invoke(txlist, f);
    }
};

/**
 * User-friendly batch interface:
 *
 * var b = Augur.createBatch();
 * b.add("getCashBalance", [Augur.coinbase], callback);
 * b.add("getRepBalance", [Augur.branches.dev, Augur.coinbase], callback);
 * b.execute();
 */
var Batch = function () {
    this.txlist = [];
};
Batch.prototype.add = function (method, params, callback) {
    if (method) {
        var tx = utilities.copy(augur.tx[method]);
        if (params && params.length !== 0) {
            tx.params = params;
        }
        if (callback) tx.callback = callback;
        this.txlist.push(tx);
    }
};
Batch.prototype.execute = function () {
    augur.batch(this.txlist, true);
};
Augur.prototype.createBatch = function createBatch () {
    return new Batch();
};

Augur.prototype.clear_notifications = function (id) {
    for (var i = 0, len = this.notifications.length; i < len; ++i) {
        clearTimeout(this.notifications[id][i]);
        this.notifications[id] = [];
    }
};

Augur.prototype.error_codes = function (tx, response) {
    if (response && response.constructor === Array) {
        for (var i = 0, len = response.length; i < len; ++i) {
            response[i] = this.error_codes(tx.method, response[i]);
        }
    } else {
        if (this.ERRORS[response]) {
            response = {
                error: response,
                message: this.ERRORS[response]
            };
        } else {
            if (tx.returns && tx.returns !== "string" ||
                (response.constructor === String && response.slice(0,2) === "0x")) {
                var response_number = this.abi.bignum(response);
                if (response_number) {
                    response_number = this.abi.bignum(response).toFixed();
                    if (this.ERRORS[tx.method] && this.ERRORS[tx.method][response_number]) {
                        response = {
                            error: response_number,
                            message: this.ERRORS[tx.method][response_number]
                        };
                    }
                }
            }
        }
    }
    return response;
};

Augur.prototype.strategy = function (target, callback) {
    if (callback) {
        callback(target);
    } else {
        return target;
    }
};

Augur.prototype.fire = function (itx, onSent) {
    var num_params_expected, num_params_received, tx, self = this;
    if (itx.signature && itx.signature.length) {
        if (itx.params !== undefined) {
            if (itx.params.constructor === Array) {
                num_params_received = itx.params.length;
            } else if (itx.params.constructor === Object) {
                return this.strategy({
                    error: -9,
                    message: "cannot send object parameter to contract"
                }, onSent);
            } else if (itx.params !== null) {
                num_params_received = 1;
            } 
        } else {
            num_params_received = 0;
        }
        num_params_expected = itx.signature.length;
        if (num_params_received !== num_params_expected) {
            return this.strategy({
                error: -10,
                message: "expected " + num_params_expected.toString() +
                    " parameters, got " + num_params_received.toString()
            }, onSent);
        }
    }
    tx = utilities.copy(itx);
    if (onSent) {
        this.invoke(tx, function (res) {
            res = self.error_codes(tx, res);
            if (res && self.BigNumberOnly && itx.returns && itx.returns !== "string" && itx.returns !== "hash[]") {
                res = self.abi.bignum(res);
            }
            onSent(res);
        });
    } else {
        return this.error_codes(tx, this.invoke(tx, onSent));
    }        
};

/***************************************
 * Call-send-confirm callback sequence *
 ***************************************/

Augur.prototype.check_blockhash =  function (tx, callreturn, itx, txhash, returns, count, onSent, onSuccess, onFailed) {
    var self = this;
    if (tx && tx.blockHash && this.abi.bignum(tx.blockHash).toNumber() !== 0) {
        this.clear_notifications(txhash);
        tx.callReturn = callreturn;
        tx.txHash = tx.hash;
        delete tx.hash;
        if (this.BigNumberOnly && tx.returns && tx.returns !== "string" && tx.returns !== "hash[]") {
            tx.callReturn = this.abi.bignum(tx.callReturn);
        }
        if (onSuccess) onSuccess(tx);
    } else {
        if (count !== undefined && count < this.TX_POLL_MAX) {
            if (count === 0) {
                this.notifications[txhash] = [setTimeout(function () {
                    self.tx_notify(count + 1, callreturn, itx, txhash, returns, onSent, onSuccess, onFailed);
                }, this.TX_POLL_INTERVAL)];
            } else {
                this.notifications[txhash].push(setTimeout(function () {
                    self.tx_notify(count + 1, callreturn, itx, txhash, returns, onSent, onSuccess, onFailed);
                }, this.TX_POLL_INTERVAL));
            }
        }
    }
};

Augur.prototype.tx_notify =  function (count, callreturn, itx, txhash, returns, onSent, onSuccess, onFailed) {
    var self = this;
    this.getTx(txhash, function (tx) {
        if (tx === null) {
            if (returns) itx.returns = returns;
        } else {
            self.check_blockhash(tx, callreturn, itx, txhash, returns, count, onSent, onSuccess, onFailed);
        }
    });
};

Augur.prototype.call_confirm = function (tx, txhash, returns, onSent, onSuccess, onFailed) {
    var self = this;
    if (tx && txhash) {
        this.notifications[txhash] = [];
        if (this.ERRORS[txhash]) {
            if (onFailed) onFailed({
                error: txhash,
                message: this.ERRORS[txhash]
            });
        } else {
            this.getTx(txhash, function (sent) {
                self.call({
                    from: sent.from || self.coinbase,
                    to: sent.to || tx.to,
                    data: sent.input,
                    returns: returns
                }, function (callreturn) {
                    if (callreturn) {
                        if (callreturn.constructor === Object && callreturn.error) {
                            if (onFailed) onFailed(callreturn);
                        } else if (self.ERRORS[callreturn]) {
                            if (onFailed) onFailed({
                                error: callreturn,
                                message: self.ERRORS[callreturn]
                            });
                        } else {
                            try {
                                var num = self.abi.bignum(callreturn);
                                if (num && num.constructor === BN) {
                                    num = num.toFixed();
                                }
                                if (num && self.ERRORS[tx.method] && self.ERRORS[tx.method][num]) {
                                    if (onFailed) onFailed({
                                        error: num,
                                        message: self.ERRORS[tx.method][num]
                                    });
                                } else {
                                    onSent({
                                        txHash: txhash,
                                        callReturn: callreturn
                                    });
                                    if (onSuccess) {
                                        self.tx_notify(
                                            0,
                                            callreturn,
                                            tx,
                                            txhash,
                                            returns,
                                            onSent,
                                            onSuccess,
                                            onFailed
                                        );
                                    }
                                }
                            } catch (e) {
                                if (onFailed) onFailed(e);
                            }
                        }
                    }
                });
            });
        }
    }
};

Augur.prototype.send_call_confirm = function (tx, onSent, onSuccess, onFailed) {
    var self = this;
    var returns = tx.returns;
    tx.send = true;
    delete tx.returns;
    this.invoke(tx, function (txhash) {
        self.call_confirm(tx, txhash, returns, onSent, onSuccess, onFailed);
    });
};

/************************************
 * Centralized/trustless web client *
 ************************************/

Augur.prototype.web = {

    account: {},

    db: {

        write: function (handle, data, f) {
            try {
                return this.json_rpc(this.postdata(
                    "putString",
                    ["accounts", handle, JSON.stringify(data)],
                    "db_"
                ), f);
            } catch (e) {
                return this.ERRORS.web.DB_WRITE_FAILED;
            }
        }.bind(augur),

        get: function (handle, f) {
            try {
                if (f) {
                    this.json_rpc(this.postdata(
                        "getString",
                        ["accounts", handle],
                        "db_"
                    ), function (account) {
                        if (!account.error) {
                            f(JSON.parse(account));
                        } else {
                            // account does not exist
                            f(this.ERRORS.web.BAD_CREDENTIALS);
                        }
                    }.bind(augur));
                } else {
                    var account = this.json_rpc(this.postdata(
                        "getString",
                        ["accounts", handle],
                        "db_"
                    ));
                    if (!account.error) {
                        return JSON.parse(account);
                    } else {
                        // account does not exist
                        return this.ERRORS.web.BAD_CREDENTIALS;
                    }
                }
            } catch (e) {
                return this.ERRORS.web.DB_READ_FAILED;
            }
        }.bind(augur)
    },

    hash: function (text) {
        return crypto.createHash("sha256").update(text).digest("hex");
    },

    encrypt: function (plaintext, key) {
        var cipher, ciphertext;
        cipher = crypto.createCipher("aes-256-cbc", key);
        ciphertext = cipher.update(plaintext, "hex", "base64");
        ciphertext += cipher.final("base64");
        return ciphertext;
    },

    decrypt: function (ciphertext, key) {
        var decipher, plaintext;
        decipher = crypto.createDecipher("aes-256-cbc", key);
        plaintext = decipher.update(ciphertext, "base64", "hex");
        plaintext += decipher.final("hex");
        return plaintext;
    },

    register: function (handle, password) {

        var privKey, pubKey, address, encryptedPrivKey;

        // make sure this handle isn't taken already
        if (this.db.get(handle).error) {

            // generate private key, derive public key and address
            privKey = crypto.randomBytes(32);
            pubKey = elliptic.getPublic(privKey);
            address = "0x" + EthUtil.pubToAddress(pubKey).toString("hex");

            // password hash used as secret key to aes-256 encrypt private key
            encryptedPrivKey = this.encrypt(privKey, this.hash(password));

            // store encrypted key & password hash, indexed by handle
            this.db.write(handle, {
                handle: handle,
                privateKey: encryptedPrivKey,
                address: address,
                nonce: 0
            });

            this.account = {
                handle: handle,
                privateKey: privKey,
                address: address,
                nonce: 0
            };

            return this.account;

        // account already exists
        } else {
            return augur.ERRORS.web.HANDLE_TAKEN;
        }
    },

    login: function (handle, password) {
        var storedInfo, privateKey;

        // retrieve account info from database
        storedInfo = this.db.get(handle);

        // use the hashed password to decrypt the private key
        try {

            privateKey = new Buffer(this.decrypt(
                storedInfo.privateKey,
                this.hash(password)
            ), "hex");

            this.account = {
                handle: handle,
                privateKey: privateKey,
                address: storedInfo.address,
                nonce: storedInfo.nonce
            };

            return this.account;

        // decryption failure: bad password
        } catch (e) {
            return augur.ERRORS.web.BAD_CREDENTIALS;
        }
    },

    logout: function () {
        this.account = {};
    },

    pay: {
        
        ether: function (toHandle, value, callback) {
            if (this.web.account.address) {
                var toAccount = this.web.db.get(toHandle);
                if (toAccount && toAccount.address) {
                    return this.web.invoke({
                        value: value,
                        from: this.web.account.address,
                        to: toAccount.address
                    }, callback);
                } else {
                    return this.ERRORS.web.TRANSACTION_FAILED;
                }
            }
        }.bind(augur),

        cash: function (toHandle, value, callback) {
            if (this.web.account.address) {
                var toAccount = this.web.db.get(toHandle);
                if (toAccount && toAccount.address) {
                    var tx = utilities.copy(this.tx.sendCash);
                    tx.params = [toAccount.address, this.abi.fix(value)];
                    return this.web.invoke(tx, callback);
                } else {
                    return this.ERRORS.web.TRANSACTION_FAILED;
                }
            }
        }.bind(augur),

        reputation: function (toHandle, value, callback) {
            if (this.web.account.address) {
                var toAccount = this.web.db.get(toHandle);
                if (toAccount && toAccount.address) {
                    var tx = utilities.copy(this.tx.sendReputation);
                    tx.params = [toAccount.address, this.abi.fix(value)];
                    return this.web.invoke(tx, callback);
                } else {
                    return this.ERRORS.web.TRANSACTION_FAILED;
                }
            }
        }.bind(augur)
    },

    invoke: function (itx, callback) {
        var tx, data_abi, packaged, stored;

        // client-side transactions only needed for sendTransactions
        if (itx.send) {
            if (this.web.account.privateKey && itx && itx.constructor === Object) {

                // parse and serialize transaction parameters
                tx = utilities.copy(itx);
                if (tx.params !== undefined) {
                    if (tx.params.constructor === Array) {
                        for (var i = 0, len = tx.params.length; i < len; ++i) {
                            if (tx.params[i] !== undefined &&
                                tx.params[i].constructor === BN) {
                                tx.params[i] = tx.params[i].toFixed();
                            }
                        }
                    } else if (tx.params.constructor === BN) {
                        tx.params = tx.params.toFixed();
                    }
                    data_abi = this.abi.encode(tx);
                }

                // package up the transaction and submit it to the network
                packaged = new EthTx({
                    to: tx.to,
                    gasPrice: "0xda475abf000", // 0.000015 ether
                    gasLimit: (tx.gas) ? tx.gas : this.default_gas,
                    nonce: ++this.web.account.nonce,
                    value: tx.value || "0x0",
                    data: data_abi
                });

                // write the incremented nonce to the database
                stored = this.web.db.get(this.web.account.handle);
                stored.nonce = this.web.account.nonce;
                this.web.db.write(this.web.account.handle, stored);
                
                // sign, validate, and send the transaction
                packaged.sign(this.web.account.privateKey);
                if (packaged.validate()) {
                    return this.sendRawTx(packaged.serialize().toString("hex"), callback);

                // transaction validation failed
                } else {
                    return this.ERRORS.web.TRANSACTION_INVALID;
                }
            } else {
                return this.ERRORS.web.TRANSACTION_FAILED;
            }

        // if this is just a call, use the regular invoke method
        } else {
            return this.invoke(itx, callback);
        }
    }.bind(augur)
};

/*************
 * Augur API *
 *************/

// faucets.se
Augur.prototype.cashFaucet = function (onSent, onSuccess, onFailed) {
    return this.send_call_confirm(this.tx.cashFaucet, onSent, onSuccess, onFailed);
};
Augur.prototype.reputationFaucet = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    var tx = utilities.copy(this.tx.reputationFaucet);
    tx.params = branch;
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// cash.se
Augur.prototype.getCashBalance = function (account, onSent) {
    // account: ethereum address (hexstring)
    var tx = utilities.copy(this.tx.getCashBalance);
    tx.params = account || this.coinbase;
    return this.fire(tx, onSent);
};
Augur.prototype.sendCash = function (to, value, onSent, onSuccess, onFailed) {
    // to: sha256
    // value: number -> fixed-point
    if (this.json_rpc(this.postdata("coinbase")) !== this.demo) {
        if (to && to.value) {
            value = to.value;
            if (to.onSent) onSent = to.onSent;
            if (to.onSuccess) onSuccess = to.onSuccess;
            if (to.onFailed) onFailed = to.onFailed;
            to = to.to;
        }
        var tx = utilities.copy(this.tx.sendCash);
        tx.params = [to, this.abi.fix(value)];
        return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
    }
};

// info.se
Augur.prototype.getCreator = function (id, onSent) {
    // id: sha256 hash id
    var tx = utilities.copy(this.tx.getCreator);
    tx.params = id;
    return this.fire(tx, onSent);
};
Augur.prototype.getCreationFee = function (id, onSent) {
    // id: sha256 hash id
    var tx = utilities.copy(this.tx.getCreationFee);
    tx.params = id;
    return this.fire(tx, onSent);
};
Augur.prototype.getDescription = function (item, onSent) {
    // item: sha256 hash id
    var tx = utilities.copy(this.tx.getDescription);
    tx.params = item;
    return this.fire(tx, onSent);
};
Augur.prototype.checkPeriod = function (branch) {
    var period = Number(this.getVotePeriod(branch));
    var currentPeriod = Math.floor(Augur.blockNumber() / Number(Augur.getPeriodLength(branch)));
    var periodsBehind = (currentPeriod - 1) - period;
    return periodsBehind;
};

// redeem_interpolate.se
Augur.prototype.redeem_interpolate = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_interpolate);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.read_ballots = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.read_ballots);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// center.se
Augur.prototype.center = function (reports, reputation, scaled, scaled_max, scaled_min, max_iterations, max_components, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.center);
    tx.params = [
        Augur.abi.fix(reports, "hex"),
        Augur.abi.fix(reputation, "hex"),
        scaled,
        scaled_max,
        scaled_min,
        max_iterations,
        max_components
    ];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// redeem_center.se
Augur.prototype.redeem_center = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_center);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.redeem_covariance = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_covariance);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// redeem_score.se
Augur.prototype.redeem_blank = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_blank);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.redeem_loadings = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_loadings);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// score.se
Augur.prototype.blank = function (components_remaining, max_iterations, num_events, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.blank);
    tx.params = [components_remaining, max_iterations, num_events];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.loadings = function (iv, wcd, reputation, num_reports, num_events, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.loadings);
    tx.params = [
        Augur.abi.fix(iv, "hex"),
        Augur.abi.fix(wcd, "hex"),
        Augur.abi.fix(reputation, "hex"),
        num_reports,
        num_events
    ];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// resolve.se
Augur.prototype.resolve = function (smooth_rep, reports, scaled, scaled_max, scaled_min, num_reports, num_events, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.resolve);
    tx.params = [
        Augur.abi.fix(smooth_rep, "hex"),
        Augur.abi.fix(reports, "hex"),
        scaled,
        scaled_max,
        scaled_min,
        num_reports,
        num_events
    ];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// redeem_resolve.se
Augur.prototype.redeem_resolve = function (branch, period, num_events, num_reports, flatsize, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.redeem_resolve);
    tx.params = [branch, period, num_events, num_reports, flatsize];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// branches.se
Augur.prototype.getBranches = function (onSent) {
    return this.fire(this.tx.getBranches, onSent);
};
Augur.prototype.getMarkets = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getMarkets);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getPeriodLength = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getPeriodLength);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getVotePeriod = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getVotePeriod);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getStep = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getStep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.setStep = function (branch, step, onSent) {
    var tx = utilities.copy(this.tx.setStep);
    tx.params = [branch, step];
    return this.fire(tx, onSent);
};
Augur.prototype.getSubstep = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getSubstep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.setSubstep = function (branch, substep, onSent) {
    var tx = utilities.copy(this.tx.setSubstep);
    tx.params = [branch, substep];
    return this.fire(tx, onSent);
};
Augur.prototype.incrementSubstep = function (branch, onSent) {
    var tx = utilities.copy(this.tx.incrementSubstep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumMarkets = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getNumMarkets);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getMinTradingFee = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getMinTradingFee);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumBranches = function (onSent) {
    return this.fire(this.tx.getNumBranches, onSent);
};
Augur.prototype.getBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = utilities.copy(this.tx.getBranch);
    tx.params = branchNumber;
    return this.fire(tx, onSent);
};
Augur.prototype.incrementPeriod = function (branch, onSent) {
    var tx = utilities.copy(this.tx.incrementPeriod);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.moveEventsToCurrentPeriod = function (branch, currentVotePeriod, currentPeriod, onSent) {
    var tx = utilities.copy(this.tx.moveEventsToCurrentPeriod);
    tx.params = [branch, currentVotePeriod, currentPeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getCurrentPeriod = function (branch) {
    return parseInt(this.blockNumber()) / parseInt(this.getPeriodLength(branch));
};
Augur.prototype.updatePeriod = function (branch) {
    var currentPeriod = this.getCurrentPeriod(branch);
    this.incrementPeriod(branch);
    this.setStep(branch, 0);
    this.setSubstep(branch, 0);
    this.moveEventsToCurrentPeriod(branch, this.getVotePeriod(branch), currentPeriod);
};
Augur.prototype.sprint = function (branch, length) {
    for (var i = 0, len = length || 25; i < len; ++i) {
        this.updatePeriod(branch);
    }
};

Augur.prototype.addEvent = function (branch, futurePeriod, eventID, onSent) {
    var tx = utilities.copy(this.tx.addEvent);
    tx.params = [branch, futurePeriod, eventID];
    return this.fire(tx, onSent);
};
Augur.prototype.setTotalRepReported = function (branch, expDateIndex, repReported, onSent) {
    var tx = utilities.copy(this.tx.setTotalRepReported);
    tx.params = [branch, expDateIndex, repReported];
    return this.fire(tx, onSent);
};
Augur.prototype.setReporterBallot = function (branch, expDateIndex, reporterID, report, reputation, onSent, onSuccess, onFailed) {
    var tx = utilities.copy(this.tx.setReporterBallot);
    tx.params = [branch, expDateIndex, reporterID, Augur.abi.fix(report, "hex"), reputation];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.setVSize = function (branch, expDateIndex, vSize, onSent) {
    var tx = utilities.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, vSize];
    return this.fire(tx, onSent);
};
Augur.prototype.setReportsFilled = function (branch, expDateIndex, reportsFilled, onSent) {
    var tx = utilities.copy(this.tx.setVSize);
    tx.params = [branch, expDateIndex, reportsFilled];
    return this.fire(tx, onSent);
};
Augur.prototype.setReportsMask = function (branch, expDateIndex, reportsMask, onSent) {
    var tx = utilities.copy(this.tx.setReportsMask);
    tx.params = [branch, expDateIndex, reportsMask];
    return this.fire(tx, onSent);
};
Augur.prototype.setWeightedCenteredData = function (branch, expDateIndex, weightedCenteredData, onSent) {
    var tx = utilities.copy(this.tx.setWeightedCenteredData);
    tx.params = [branch, expDateIndex, weightedCenteredData];
    return this.fire(tx, onSent);
};
Augur.prototype.setCovarianceMatrixRow = function (branch, expDateIndex, covarianceMatrixRow, onSent) {
    var tx = utilities.copy(this.tx.setCovarianceMatrixRow);
    tx.params = [branch, expDateIndex, covarianceMatrixRow];
    return this.fire(tx, onSent);
};
Augur.prototype.setDeflated = function (branch, expDateIndex, deflated, onSent) {
    var tx = utilities.copy(this.tx.setDeflated);
    tx.params = [branch, expDateIndex, deflated];
    return this.fire(tx, onSent);
};
Augur.prototype.setLoadingVector = function (branch, expDateIndex, loadingVector, onSent) {
    var tx = utilities.copy(this.tx.setLoadingVector);
    tx.params = [branch, expDateIndex, loadingVector];
    return this.fire(tx, onSent);
};
Augur.prototype.setScores = function (branch, expDateIndex, scores, onSent) {
    var tx = utilities.copy(this.tx.setScores);
    tx.params = [branch, expDateIndex, scores];
    return this.fire(tx, onSent);
};
Augur.prototype.setSetOne = function (branch, expDateIndex, setOne, onSent) {
    var tx = utilities.copy(this.tx.setOne);
    tx.params = [branch, expDateIndex, setOne];
    return this.fire(tx, onSent);
};
Augur.prototype.setSetTwo = function (branch, expDateIndex, setTwo, onSent) {
    var tx = utilities.copy(this.tx.setSetTwo);
    tx.params = [branch, expDateIndex, setTwo];
    return this.fire(tx, onSent);
};
Augur.prototype.setOld = function (branch, expDateIndex, setOld, onSent) {
    var tx = utilities.copy(this.tx.setOld);
    tx.params = [branch, expDateIndex, setOld];
    return this.fire(tx, onSent);
};
Augur.prototype.setNewOne = function (branch, expDateIndex, newOne, onSent) {
    var tx = utilities.copy(this.tx.setNewOne);
    tx.params = [branch, expDateIndex, newOne];
    return this.fire(tx, onSent);
};
Augur.prototype.setNewTwo = function (branch, expDateIndex, newTwo, onSent) {
    var tx = utilities.copy(this.tx.setNewTwo);
    tx.params = [branch, expDateIndex, newTwo];
    return this.fire(tx, onSent);
};
Augur.prototype.setAdjPrinComp = function (branch, expDateIndex, adjPrinComp, onSent) {
    var tx = utilities.copy(this.tx.setAdjPrinComp);
    tx.params = [branch, expDateIndex, adjPrinComp];
    return this.fire(tx, onSent);
};
Augur.prototype.setSmoothRep = function (branch, expDateIndex, smoothRep, onSent) {
    var tx = utilities.copy(this.tx.setSmoothRep);
    tx.params = [branch, expDateIndex, smoothRep];
    return this.fire(tx, onSent);
};
Augur.prototype.setOutcomesFinal = function (branch, expDateIndex, outcomesFinal, onSent) {
    var tx = utilities.copy(this.tx.setOutcomesFinal);
    tx.params = [branch, expDateIndex, outcomesFinal];
    return this.fire(tx, onSent);
};
Augur.prototype.setReportHash = function (branch, expDateIndex, reportHash, onSent) {
    var tx = utilities.copy(this.tx.setReportHash);
    tx.params = [branch, expDateIndex, reportHash];
    return this.fire(tx, onSent);
};

// events.se
Augur.prototype.getEventInfo = function (event_id, onSent) {
    // event_id: sha256 hash id
    var self = this;
    this.tx.getEventInfo.params = event_id;
    if (onSent) {
        this.invoke(this.tx.getEventInfo, function (eventInfo) {
            if (eventInfo && eventInfo.length) {
                if (self.BigNumberOnly) {
                    eventInfo[1] = self.abi.bignum(eventInfo[1]);
                    eventInfo[2] = self.abi.unfix(eventInfo[2]);
                    eventInfo[3] = self.abi.bignum(eventInfo[3]);
                    eventInfo[4] = self.abi.bignum(eventInfo[4]);
                    eventInfo[5] = self.abi.bignum(eventInfo[5]);
                } else {
                    eventInfo[1] = self.abi.bignum(eventInfo[1]).toFixed();
                    eventInfo[2] = self.abi.unfix(eventInfo[2], "string");
                    eventInfo[3] = self.abi.bignum(eventInfo[3]).toFixed();
                    eventInfo[4] = self.abi.bignum(eventInfo[4]).toFixed();
                    eventInfo[5] = self.abi.bignum(eventInfo[5]).toFixed();
                }
                onSent(eventInfo);
            }
        });
    } else {
        var eventInfo = this.invoke(this.tx.getEventInfo);
        if (eventInfo && eventInfo.length) {
            if (this.BigNumberOnly) {
                eventInfo[1] = this.abi.bignum(eventInfo[1]);
                eventInfo[2] = this.abi.unfix(eventInfo[2]);
                eventInfo[3] = this.abi.bignum(eventInfo[3]);
                eventInfo[4] = this.abi.bignum(eventInfo[4]);
                eventInfo[5] = this.abi.bignum(eventInfo[5]);
            } else {
                eventInfo[1] = this.abi.bignum(eventInfo[1]).toFixed();
                eventInfo[2] = this.abi.unfix(eventInfo[2], "string");
                eventInfo[3] = this.abi.bignum(eventInfo[3]).toFixed();
                eventInfo[4] = this.abi.bignum(eventInfo[4]).toFixed();
                eventInfo[5] = this.abi.bignum(eventInfo[5]).toFixed();
            }
            return eventInfo;
        }
    }
};
Augur.prototype.getEventBranch = function (branchNumber, onSent) {
    // branchNumber: integer
    var tx = utilities.copy(this.tx.getEventBranch);
    tx.params = branchNumber;
    return this.fire(tx, onSent);
};
Augur.prototype.getExpiration = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getExpiration);
    tx.params = event;
    return this.fire(tx, onSent);
};
Augur.prototype.getOutcome = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getOutcome);
    tx.params = event;
    return this.fire(tx, onSent);
};
Augur.prototype.getMinValue = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getMinValue);
    tx.params = event;
    return this.fire(tx, onSent);
};
Augur.prototype.getMaxValue = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getMaxValue);
    tx.params = event;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumOutcomes = function (event, onSent) {
    // event: sha256
    var tx = utilities.copy(this.tx.getNumOutcomes);
    tx.params = event;
    return this.fire(tx, onSent);
};
Augur.prototype.getCurrentVotePeriod = function (branch, onSent) {
    // branch: sha256
    var periodLength, blockNum;
    this.tx.getPeriodLength.params = branch;
    if (onSent) {
        this.invoke(this.tx.getPeriodLength, function (periodLength) {
            if (periodLength) {
                periodLength = this.abi.bignum(periodLength);
                this.blockNumber(function (blockNum) {
                    blockNum = this.abi.bignum(blockNum);
                    onSent(blockNum.dividedBy(periodLength).floor().sub(1));
                });
            }
        });
    } else {
        periodLength = this.invoke(this.tx.getPeriodLength);
        if (periodLength) {
            blockNum = this.abi.bignum(this.blockNumber());
            return blockNum.dividedBy(this.abi.bignum(periodLength)).floor().sub(1);
        }
    }
};

// expiringEvents.se
Augur.prototype.getEvents = function (branch, votePeriod, onSent) {
    // branch: sha256 hash id
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getEventsRange = function (branch, vpStart, vpEnd, onSent) {
    // branch: sha256
    // vpStart: integer
    // vpEnd: integer
    var vp_range, txlist;
    vp_range = vpEnd - vpStart + 1; // inclusive
    txlist = new Array(vp_range);
    for (var i = 0; i < vp_range; ++i) {
        txlist[i] = {
            from: this.coinbase,
            to: this.contracts.expiringEvents,
            method: "getEvents",
            signature: "ii",
            returns: "hash[]",
            params: [branch, i + vpStart]
        };
    }
    return this.batch(txlist, onSent);
};
Augur.prototype.getNumberEvents = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getNumberEvents);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getEvent = function (branch, votePeriod, eventIndex, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getEvent);
    tx.params = [branch, votePeriod, eventIndex];
    return this.fire(tx, onSent);
};
Augur.prototype.getTotalRepReported = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getTotalRepReported);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getReporterBallot = function (branch, votePeriod, reporterID, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReporterBallot);
    tx.params = [branch, votePeriod, reporterID];
    return this.fire(tx, onSent);
};
Augur.prototype.getReport = function (branch, votePeriod, reporter, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReports);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, onSent);
};
Augur.prototype.getReportHash = function (branch, votePeriod, reporter, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReportHash);
    tx.params = [branch, votePeriod, reporter];
    return this.fire(tx, onSent);
};
Augur.prototype.getVSize = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getVSize);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getReportsFilled = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReportsFilled);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getReportsMask = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReportsMask);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getWeightedCenteredData = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getWeightedCenteredData);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getCovarianceMatrixRow = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getCovarianceMatrixRow);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getDeflated = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getDeflated);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getLoadingVector = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getLoadingVector);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getLatent = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getLatent);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getScores = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getScores);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getSetOne = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getSetOne);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getSetTwo = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getSetTwo);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.returnOld = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.returnOld);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getNewOne = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getNewOne);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getNewTwo = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getNewTwo);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getAdjPrinComp = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getAdjPrinComp);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getSmoothRep = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getSmoothRep);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getOutcomesFinal = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getOutcomesFinal);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.getReporterPayouts = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getReporterPayouts);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};

Augur.prototype.getTotalReputation = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.getTotalReputation);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};
Augur.prototype.setTotalReputation = function (branch, votePeriod, totalReputation, onSent, onSuccess, onFailed) {
    // branch: sha256
    // votePeriod: integer
    // totalReputation: number -> fixed
    var tx = utilities.copy(this.tx.setTotalReputation);
    tx.params = [branch, votePeriod, Augur.abi.fix(totalReputation, "hex")];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.makeBallot = function (branch, votePeriod, onSent) {
    // branch: sha256
    // votePeriod: integer
    var tx = utilities.copy(this.tx.makeBallot);
    tx.params = [branch, votePeriod];
    return this.fire(tx, onSent);
};

// markets.se
Augur.prototype.getSimulatedBuy = function (market, outcome, amount, onSent) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = utilities.copy(this.tx.getSimulatedBuy);
    tx.params = [market, outcome, this.abi.fix(amount)];
    return this.fire(tx, onSent);
};
Augur.prototype.getSimulatedSell = function (market, outcome, amount, onSent) {
    // market: sha256 hash id
    // outcome: integer (1 or 2 for binary events)
    // amount: number -> fixed-point
    var tx = utilities.copy(this.tx.getSimulatedSell);
    tx.params = [market, outcome, this.abi.fix(amount)];
    return this.fire(tx, onSent);
};
Augur.prototype.lsLmsr = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.lsLmsr);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getMarketOutcomeInfo = function (market, outcome, onSent) {
    var parse_info = function (info) {
        var i, len = info.length;
        if (this.BigNumberOnly) {
            info[0] = this.abi.unfix(info[0], "BigNumber");
            info[1] = this.abi.unfix(info[1], "BigNumber");
            info[2] = this.abi.unfix(info[2], "BigNumber");
            info[3] = this.abi.bignum(info[3]);
            info[4] = this.abi.bignum(info[4]);
            for (i = 5; i < len; ++i) {
                info[i] = this.abi.bignum(info[i]);
            }
        } else {
            info[0] = this.abi.unfix(info[0], "string");
            info[1] = this.abi.unfix(info[1], "string");
            info[2] = this.abi.unfix(info[2], "string");
            info[3] = this.abi.bignum(info[3]).toFixed();
            info[4] = this.abi.bignum(info[4]).toFixed();
            for (i = 5; i < len; ++i) {
                info[i] = this.abi.bignum(info[i]).toFixed();
            }
        }
        return info;
    }.bind(this);
    var tx = utilities.copy(this.tx.getMarketOutcomeInfo);
    tx.params = [market, outcome];
    if (onSent) {
        this.fire(tx, function (info) {
            if (info) onSent(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
Augur.prototype.getMarketInfo = function (market, onSent) {
    var parse_info = function (info) {
        var i, len = info.length;
        if (this.BigNumberOnly) {
            info[0] = this.abi.bignum(info[0]);
            info[1] = this.abi.unfix(info[1], "BigNumber");
            info[2] = this.abi.bignum(info[2]);
            info[3] = this.abi.bignum(info[3]);
            info[4] = this.abi.bignum(info[4]);
            info[5] = this.abi.unfix(info[5], "BigNumber");
            for (i = 6; i < len - 8; ++i) {
                info[i] = this.abi.prefix_hex(this.abi.bignum(info[i]).toString(16));
            }
            for (i = len - 8; i < len; ++i) {
                info[i] = this.abi.bignum(info[i]);
            }
        } else {
            info[0] = this.abi.bignum(info[0]).toFixed();
            info[1] = this.abi.unfix(info[1], "string");
            info[2] = this.abi.bignum(info[2]).toFixed();
            info[3] = this.abi.bignum(info[3]).toFixed();
            info[4] = this.abi.bignum(info[4]).toFixed();
            info[5] = this.abi.unfix(info[5], "string");
            for (i = len - 8; i < len; ++i) {
                info[i] = this.abi.bignum(info[i]).toFixed();
            }
        }
        return info;
    }.bind(this);
    var tx = utilities.copy(this.tx.getMarketInfo);
    tx.params = market;
    if (onSent) {
        this.fire(tx, function (info) {
            if (info) onSent(parse_info(info));
        });
    } else {
        return parse_info(this.fire(tx));
    }
};
Augur.prototype.getMarketEvents = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getMarketEvents);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumEvents = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getNumEvents);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getBranchID = function (branch, onSent) {
    // branch: sha256 hash id
    var tx = utilities.copy(this.tx.getBranchID);
    tx.params = branch;
    return this.fire(tx, onSent);
};
// Get the current number of participants in this market
Augur.prototype.getCurrentParticipantNumber = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getCurrentParticipantNumber);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getMarketNumOutcomes = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getMarketNumOutcomes);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getParticipantSharesPurchased = function (market, participationNumber, outcome, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getParticipantSharesPurchased);
    tx.params = [market, participationNumber, outcome];
    return this.fire(tx, onSent);
};
Augur.prototype.getSharesPurchased = function (market, outcome, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getSharesPurchased);
    tx.params = [market, outcome];
    return this.fire(tx, onSent);
};
Augur.prototype.getWinningOutcomes = function (market, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.getWinningOutcomes);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.price = function (market, outcome, onSent) {
    // market: sha256 hash id
    var tx = utilities.copy(this.tx.price);
    tx.params = [market, outcome];
    return this.fire(tx, onSent);
};
// Get the participant number (the array index) for specified address
Augur.prototype.getParticipantNumber = function (market, address, onSent) {
    // market: sha256
    // address: ethereum account
    var tx = utilities.copy(this.tx.getParticipantNumber);
    tx.params = [market, address];
    return this.fire(tx, onSent);
};
// Get the address for the specified participant number (array index) 
Augur.prototype.getParticipantID = function (market, participantNumber, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getParticipantID);
    tx.params = [market, participantNumber];
    return this.fire(tx, onSent);
};
Augur.prototype.getAlpha = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getAlpha);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getCumScale = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getCumScale);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getTradingPeriod = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getTradingPeriod);
    tx.params = market;
    return this.fire(tx, onSent);
};
Augur.prototype.getTradingFee = function (market, onSent) {
    // market: sha256
    var tx = utilities.copy(this.tx.getTradingFee);
    tx.params = market;
    return this.fire(tx, onSent);
};

// reporting.se
Augur.prototype.getRepBalance = function (branch, account, onSent) {
    // branch: sha256 hash id
    // account: ethereum address (hexstring)
    var tx = utilities.copy(this.tx.getRepBalance);
    tx.params = [branch, account || this.coinbase];
    return this.fire(tx, onSent);
};
Augur.prototype.getRepByIndex = function (branch, repIndex, onSent) {
    // branch: sha256
    // repIndex: integer
    var tx = utilities.copy(this.tx.getRepByIndex);
    tx.params = [branch, repIndex];
    return this.fire(tx, onSent);
};
Augur.prototype.getReporterID = function (branch, index, onSent) {
    // branch: sha256
    // index: integer
    var tx = utilities.copy(this.tx.getReporterID);
    tx.params = [branch, index];
    return this.fire(tx, onSent);
};
// reputation of a single address over all branches
Augur.prototype.getReputation = function (address, onSent) {
    // address: ethereum account
    var tx = utilities.copy(this.tx.getReputation);
    tx.params = address;
    return this.fire(tx, onSent);
};
Augur.prototype.getNumberReporters = function (branch, onSent) {
    // branch: sha256
    var tx = utilities.copy(this.tx.getNumberReporters);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.repIDToIndex = function (branch, repID, onSent) {
    // branch: sha256
    // repID: ethereum account
    var tx = utilities.copy(this.tx.repIDToIndex);
    tx.params = [branch, repID];
    return this.fire(tx, onSent);
};
Augur.prototype.getTotalRep = function (branch, onSent) {
    var tx = utilities.copy(this.tx.getTotalRep);
    tx.params = branch;
    return this.fire(tx, onSent);
};
Augur.prototype.hashReport = function (ballot, salt, onSent) {
    // ballot: number[]
    // salt: integer
    if (ballot.constructor === Array) {
        var tx = utilities.copy(this.tx.hashReport);
        tx.params = [this.abi.fix(ballot, "hex"), salt];
        return this.fire(tx, onSent);
    }
};

// checkQuorum.se
Augur.prototype.checkQuorum = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256
    if (this.json_rpc(this.postdata("coinbase")) !== this.demo) {
        var tx = utilities.copy(this.tx.checkQuorum);
        tx.params = branch;
        return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
    }
};

// buy&sellShares.se
Augur.prototype.getNonce = function (id, onSent) {
    // id: sha256 hash id
    var tx = utilities.copy(this.tx.getNonce);
    tx.params = id;
    return this.fire(tx, onSent);
};
Augur.prototype.buyShares = function (branch, market, outcome, amount, nonce, limit, onSent, onSuccess, onFailed) {
    if (branch && branch.constructor === Object && branch.branchId) {
        market = branch.marketId; // sha256
        outcome = branch.outcome; // integer (1 or 2 for binary)
        amount = branch.amount;   // number -> fixed-point
        if (branch.nonce) {
            nonce = branch.nonce; // integer (optional)
        }
        limit = branch.limit || 0;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId; // sha256
    }
    var tx = utilities.copy(this.tx.buyShares);
    if (onSent) {
        this.getNonce(market, function (nonce) {
            tx.params = [branch, market, outcome, this.abi.fix(amount), nonce, limit || 0];
            this.send_call_confirm(tx, onSent, onSuccess, onFailed);
        }.bind(this));
    } else {
        nonce = this.getNonce(market);
        tx.params = [branch, market, outcome, this.abi.fix(amount), nonce, limit || 0];
        return this.send_call_confirm(tx);
    }
};
Augur.prototype.sellShares = function (branch, market, outcome, amount, nonce, limit, onSent, onSuccess, onFailed) {
    if (branch && branch.constructor === Object && branch.branchId) {
        market = branch.marketId; // sha256
        outcome = branch.outcome; // integer (1 or 2 for binary)
        amount = branch.amount;   // number -> fixed-point
        if (branch.nonce) {
            nonce = branch.nonce; // integer (optional)
        }
        limit = branch.limit || 0;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId; // sha256
    }
    var tx = utilities.copy(this.tx.sellShares);
    if (onSent) {
        this.getNonce(market, function (nonce) {
            tx.params = [branch, market, outcome, this.abi.fix(amount), nonce, limit || 0];
            this.send_call_confirm(tx, onSent, onSuccess, onFailed);
        });
    } else {
        nonce = this.getNonce(market);
        tx.params = [branch, market, outcome, this.abi.fix(amount), nonce, limit || 0];
        return this.send_call_confirm(tx);
    }
};

// createBranch.se
Augur.prototype.createSubbranch = function (description, periodLength, parent, tradingFee, onSent, onSuccess, onFailed) {
    if (description && description.periodLength) {
        periodLength = description.periodLength;
        parent = description.parent;
        tradingFee = description.tradingFee;
        if (description.onSent) onSent = description.onSent;
        if (description.onSuccess) onSuccess = description.onSuccess;
        if (description.onFailed) onFailed = description.onFailed;
        description = description.description;
    }
    var tx = utilities.copy(this.tx.sendReputation);
    tx.params = [description, periodLength, parent, tradingFee];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// p2pWagers.se

// sendReputation.se
Augur.prototype.sendReputation = function (branch, to, value, onSent, onSuccess, onFailed) {
    // branch: sha256
    // to: sha256
    // value: number -> fixed-point
    if (this.json_rpc(this.postdata("coinbase")) !== this.demo) {
        if (branch && branch.branchId && branch.to && branch.value) {
            to = branch.to;
            value = branch.value;
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branchId;
        }
        var tx = utilities.copy(this.tx.sendReputation);
        tx.params = [branch, to, this.abi.fix(value)];
        return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
    }
};

// transferShares.se

// makeReports.se
Augur.prototype.report = function (branch, report, votePeriod, salt, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        report = branch.report;
        votePeriod = branch.votePeriod;
        salt = branch.salt;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = utilities.copy(this.tx.report);
    tx.params = [branch, Augur.abi.fix(report, "hex"), votePeriod, salt];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.submitReportHash = function (branch, reportHash, votePeriod, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        reportHash = branch.reportHash;
        votePeriod = branch.votePeriod;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = utilities.copy(this.tx.submitReportHash);
    tx.params = [branch, reportHash, votePeriod];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.checkReportValidity = function (branch, report, votePeriod, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        report = branch.report;
        votePeriod = branch.votePeriod;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = utilities.copy(this.tx.checkReportValidity);
    tx.params = [branch, Augur.abi.fix(report, "hex"), votePeriod];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};
Augur.prototype.slashRep = function (branch, votePeriod, salt, report, reporter, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        votePeriod = branch.votePeriod;
        salt = branch.salt;
        report = branch.report;
        reporter = branch.reporter;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = utilities.copy(this.tx.slashRep);
    tx.params = [branch, votePeriod, salt, Augur.abi.fix(report, "hex"), reporter];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// createEvent.se
Augur.prototype.createEvent = function (branch, description, expDate, minValue, maxValue, numOutcomes, onSent, onSuccess, onFailed) {
    // first parameter can optionally be a transaction object
    if (branch.constructor === Object && branch.branchId) {
        description = branch.description; // string
        minValue = branch.minValue;       // integer (1 for binary)
        maxValue = branch.maxValue;       // integer (2 for binary)
        numOutcomes = branch.numOutcomes; // integer (2 for binary)
        expDate = branch.expDate;         // integer
        if (branch.onSent) onSent = branch.onSent;           // function({id, txhash})
        if (branch.onSuccess) onSuccess = branch.onSuccess;  // function({id, txhash})
        if (branch.onFailed) onFailed = branch.onFailed;     // function({id, txhash})
        branch = branch.branchId;         // sha256 hash
    }
    var tx = this.tx.createEvent;
    tx.params = [
        branch,
        description,
        expDate,
        minValue,
        maxValue,
        numOutcomes,
        this.blockNumber()
    ];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// createMarket.se
Augur.prototype.createMarket = function (branch, description, alpha, liquidity, tradingFee, events, onSent, onSuccess, onFailed) {
    // first parameter can optionally be a transaction object
    if (branch.constructor === Object && branch.branchId) {
        alpha = branch.alpha;                // number -> fixed-point
        description = branch.description;    // string
        liquidity = branch.initialLiquidity; // number -> fixed-point
        tradingFee = branch.tradingFee;      // number -> fixed-point
        events = branch.events;              // array [sha256, ...]
        onSent = branch.onSent;              // function({id, txhash})
        onSuccess = branch.onSuccess;        // function({id, txhash})
        onFailed = branch.onFailed;          // function({id, txhash})
        branch = branch.branchId;            // sha256 hash
    }
    var tx = this.tx.createMarket;
    tx.params = [
        branch,
        description,
        this.abi.fix(alpha, "hex"),
        this.abi.fix(liquidity, "hex"),
        this.abi.fix(tradingFee, "hex"),
        events,
        this.blockNumber()
    ];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// closeMarket.se
Augur.prototype.closeMarket = function (branch, market, onSent, onSuccess, onFailed) {
    if (branch.constructor === Object && branch.branchId) {
        market = branch.marketId;
        if (branch.onSent) onSent = branch.onSent;
        if (branch.onSuccess) onSuccess = branch.onSuccess;
        if (branch.onFailed) onFailed = branch.onFailed;
        branch = branch.branchId;
    }
    var tx = utilities.copy(this.tx.closeMarket);
    tx.params = [branch, market];
    return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
};

// dispatch.se
Augur.prototype.dispatch = function (branch, onSent, onSuccess, onFailed) {
    // branch: sha256 or transaction object
    if (this.json_rpc(this.postdata("coinbase")) !== this.demo) {
        if (branch.constructor === Object && branch.branchId) {
            if (branch.onSent) onSent = branch.onSent;
            if (branch.onSuccess) onSuccess = branch.onSuccess;
            if (branch.onFailed) onFailed = branch.onFailed;
            branch = branch.branchId;
        }
        var tx = utilities.copy(this.tx.dispatch);
        tx.params = branch;
        return this.send_call_confirm(tx, onSent, onSuccess, onFailed);
    }
};

/***********************
 * Manual database I/O *
 **********************/

Augur.prototype.putString =  function (key, string, f) {
    return this.json_rpc(this.postdata("putString", ["augur", key, string], "db_"), f);
};

Augur.prototype.getString =  function (key, f) {
    return this.json_rpc(this.postdata("getString", ["augur", key], "db_"), f);
};

/***************************
 * Whisper comments system *
 ***************************/

Augur.prototype.getMessages =  function (filter, f) {
    return this.json_rpc(this.postdata("getMessages", filter, "shh_"), f);
};

Augur.prototype.getFilterChanges =  function (filter, f) {
    return this.json_rpc(this.postdata("getFilterChanges", filter, "shh_"), f);
};

Augur.prototype.newIdentity =  function (f) {
    return this.json_rpc(this.postdata("newIdentity", null, "shh_"), f);
};

Augur.prototype.post =  function (params, f) {
    return this.json_rpc(this.postdata("post", params, "shh_"), f);
};

Augur.prototype.whisperFilter =  function (params, f) {
    return this.json_rpc(this.postdata("newFilter", params, "shh_"), f);
};

Augur.prototype.commentFilter =  function (market, f) {
    return this.whisperFilter({ topics: [ market ]}, f);
};

Augur.prototype.uninstallFilter =  function (filter, f) {
    return this.json_rpc(this.postdata("uninstallFilter", filter, "shh_"), f);
};

/**
 * Incoming comment filter:
 *  - compare comment string length, write the longest to leveldb
 *  - 10 second ethereum network polling interval
 */
Augur.prototype.pollFilter = function (market_id, filter_id) {
    var self = this;
    var incoming_comments, stored_comments, num_messages, incoming_parsed, stored_parsed;
    this.getFilterChanges(filter_id, function (message) {
        if (message) {
            num_messages = message.length;
            if (num_messages) {
                for (var i = 0; i < num_messages; ++i) {
                    // log("\n\nPOLLFILTER: reading incoming message " + i.toString());
                    incoming_comments = self.abi.decode_hex(message[i].payload);
                    if (incoming_comments) {
                        incoming_parsed = JSON.parse(incoming_comments);
                        // log(incoming_parsed);
            
                        // get existing comment(s) stored locally
                        stored_comments = self.getString(market_id);

                        // check if incoming comments length > stored
                        if (stored_comments && stored_comments.length) {
                            stored_parsed = JSON.parse(stored_comments);
                            if (incoming_parsed.length > stored_parsed.length ) {
                                // log(incoming_parsed.length.toString() + " incoming comments");
                                // log("[" + filter_id + "] overwriting comments for market: " + market_id);
                                if (self.putString(market_id, incoming_comments)) {
                                    // log("[" + filter_id + "] overwrote comments for market: " + market_id);
                                }
                            } else {
                                // log(stored_parsed.length.toString() + " stored comments");
                                // log("[" + filter_id + "] retaining comments for market: " + market_id);
                            }
                        } else {
                            // log(incoming_parsed.length.toString() + " incoming comments");
                            // log("[" + filter_id + "] inserting first comments for market: " + market_id);
                            if (self.putString(market_id, incoming_comments)) {
                                // log("[" + filter_id + "] overwrote comments for market: " + market_id);
                            }
                        }
                    }
                }
            }
        }
        // wait a few seconds, then poll the filter for new messages
        setTimeout(function () {
            self.pollFilter(market_id, filter_id);
        }, self.COMMENT_POLL_INTERVAL);
    });
};

Augur.prototype.initComments = function (market) {
    var filter, comments, whisper_id;

    // make sure there's only one shh filter per market
    if (this.filters[market] && this.filters[market].filterId) {
        // log("existing filter found");
        this.pollFilter(market, this.filters[market].filterId);
        return this.filters[market].filterId;

    // create a new shh filter for this market
    } else {
        filter = this.commentFilter(market);
        if (filter && filter !== "0x") {
            // log("creating new filter");
            this.filters[market] = {
                filterId: filter,
                polling: true
            };

            // broadcast all comments in local leveldb
            comments = this.getString(market);
            if (comments) {
                whisper_id = this.newIdentity();
                if (whisper_id) {
                    var transmission = {
                        from: whisper_id,
                        topics: [market],
                        payload: this.abi.prefix_hex(this.abi.encode_hex(comments)),
                        priority: "0x64",
                        ttl: "0x500" // time-to-live (until expiration) in seconds
                    };
                    if (!this.post(transmission)) {
                        return this.errors.WHISPER_POST_FAILED;
                    }
                }
            }
            this.pollFilter(market, filter);
            return filter;
        }
    }
};

Augur.prototype.resetComments = function (market) {
    return this.putString(market, "");
};

Augur.prototype.getMarketComments = function (market) {
    var comments = this.getString(market);
    if (comments) {
        return JSON.parse(comments);
    } else {
        return null;
    }
};

Augur.prototype.addMarketComment = function (pkg) {
    var market, comment_text, author, updated, transmission, whisper_id, comments;
    market = pkg.marketId;
    comment_text = pkg.message;
    author = pkg.author || this.coinbase;

    whisper_id = this.newIdentity();
    if (whisper_id && !whisper_id.error) {
        updated = JSON.stringify([{
            whisperId: whisper_id,
            from: author, // ethereum account
            comment: comment_text,
            time: Math.floor((new Date()).getTime() / 1000)
        }]);

        // get existing comment(s) stored locally
        // (note: build with DFATDB=1 if DBUNDLE=minimal)
        comments = this.getString(market);
        if (comments) {
            updated = updated.slice(0,-1) + "," + comments.slice(1);
        }
        if (this.putString(market, updated)) {
            transmission = {
                from: whisper_id,
                topics: [market],
                payload: this.abi.prefix_hex(this.abi.encode_hex(updated)),
                priority: "0x64",
                ttl: "0x600" // 10 minutes
            };
            if (this.post(transmission)) {
                var decoded = this.abi.decode_hex(transmission.payload);
                // TODO figure out why slice(1) is needed here...
                return JSON.parse(decoded.slice(1));
            } else {
                return this.errors.WHISPER_POST_FAILED;
            }
        } else {
            return this.ERRORS.web.DB_WRITE_FAILED;
        }
    } else {
        return whisper_id;
    }
};

/********************
 * Ethereum filters *
 ********************/

Augur.prototype.eth_newFilter = function (params, f) {
    return this.json_rpc(this.postdata("newFilter", params), f);
};

Augur.prototype.create_price_filter = function (label, f) {
    return this.eth_newFilter({ topics: [ label ]}, f);
};

Augur.prototype.eth_getFilterChanges = function (filter, f) {
    return this.json_rpc(this.postdata("getFilterChanges", filter), f);
};

Augur.prototype.eth_getFilterLogs = function (filter, f) {
    return this.json_rpc(this.postdata("getFilterLogs", filter), f);
};

Augur.prototype.eth_getLogs = function (filter, f) {
    return this.json_rpc(this.postdata("getLogs", filter), f);
};

Augur.prototype.eth_uninstallFilter = function (filter, f) {
    return this.json_rpc(this.postdata("uninstallFilter", filter), f);
};

Augur.prototype.search_price_logs = function (logs, market_id, outcome_id) {
    // array response: user, market, outcome, price
    var parsed, unfix_type, price_logs;
    if (logs) {
        unfix_type = (this.BigNumberOnly) ? "BigNumber" : "string";
        price_logs = [];
        for (var i = 0, len = logs.length; i < len; ++i) {
            parsed = this.parse_array(logs[i].data);
            if (this.abi.bignum(parsed[1]).eq(this.abi.bignum(market_id)) && this.abi.bignum(parsed[2]).eq(this.abi.bignum(outcome_id))) {
                if (this.BigNumberOnly) {
                    price_logs.push({
                        price: this.abi.unfix(parsed[3], unfix_type),
                        blockNumber: this.abi.bignum(logs[i].blockNumber)
                    });
                } else {
                    price_logs.push({
                        price: this.abi.unfix(parsed[3], unfix_type),
                        blockNumber: logs[i].blockNumber
                    });
                }
            }
        }
        return price_logs;
    }
};

Augur.prototype.getCreationBlock = function (market_id, callback) {
    if (market_id) {
        var filter = {
            fromBlock: "0x1",
            toBlock: this.blockNumber(),
            topics: ["creationBlock"]
        };
        if (callback) {
            this.filters.eth_getLogs(filter, function (logs) {
                callback(logs);
            });
        } else {
            return this.filters.eth_getFilterLogs(filter);
        }
    }
};

Augur.prototype.getMarketPriceHistory = function (market_id, outcome_id, callback) {
    if (market_id && outcome_id) {
        var filter = {
            fromBlock: "0x1",
            toBlock: this.blockNumber(),
            topics: ["updatePrice"]
        };
        if (callback) {
            this.filters.eth_getLogs(filter, function (logs) {
                callback(this.filters.search_price_logs(logs, market_id, outcome_id));
            });
        } else {
            return this.filters.search_price_logs(this.filters.eth_getLogs(filter), market_id, outcome_id);
        }
    }
};

Augur.prototype.poll_eth_listener = function (filter_name, onMessage) {
    var filterId = this.price_filters[filter_name].filterId;
    this.filters.eth_getFilterChanges(filterId, function (message) {
        if (message) {
            var num_messages = message.length;
            log(message);
            if (num_messages) {
                for (var i = 0; i < num_messages; ++i) {
                    var data_array = this.parse_array(message[i].data);
                    var unfix_type = (this.BigNumberOnly) ? "BigNumber" : "string";
                    onMessage({
                        origin: data_array[0],
                        marketId: data_array[1],
                        outcome: this.abi.bignum(data_array[2], unfix_type),
                        price: this.abi.unfix(data_array[3], unfix_type)
                    });
                }
            }
        }
    });
};

Augur.prototype.start_eth_listener = function (filter_name, callback) {
    var filter_id;
    if (this.price_filters[filter_name] &&
        this.price_filters[filter_name].filterId) {
        filter_id = this.price_filters[filter_name].filterId;
        log(filter_name + " filter found:", chalk.green(filter_id));
    } else {
        filter_id = this.filters.create_price_filter(filter_name);
        if (filter_id && filter_id !== "0x") {
            log("Create " + filter_name + " filter:", chalk.green(filter_id));
            this.price_filters[filter_name] = {
                filterId: filter_id,
                polling: false
            };
            if (callback) callback(filter_id);
        } else {
            log("Couldn't create " + filter_name + " filter:",
                chalk.green(filter_id));
        }
    }
};

module.exports = augur;
