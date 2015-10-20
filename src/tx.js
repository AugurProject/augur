/**
 * Augur transaction objects
 */

"use strict";

module.exports = function (contracts) {

    return {

        // IPFS/IPNS
        ipfs: {

            setMarketsDirectoryHash: {
                to: contracts.ipfs,
                method: "setMarketsDirectoryHash",
                signature: "ii",
                send: true,
                returns: "number"
            },

            getMarketsDirectoryHash: {
                to: contracts.ipfs,
                method: "getMarketsDirectoryHash",
                signature: "i",
                send: false,
                returns: "hash"
            }

        },

        // namereg
        namereg: {

            // register name
            reserve: {
                to: contracts.namereg,
                method: "reserve",
                signature: "b32",
                send: true,
                returns: "null"
            },

            // address that owns a name
            owner: {
                to: contracts.namereg,
                method: "owner",
                signature: "b32",
                send: false,
                returns: "address"
            },

            // set name to address
            setAddress: {
                to: contracts.namereg,
                method: "setAddress",
                signature: "b32ii",
                send: true,
                returns: "null"
            },

            // get address from name
            addr: {
                to: contracts.namereg,
                method: "addr",
                signature: "b32",
                send: false,
                returns: "address"
            },

            // get name from address
            name: {
                to: contracts.namereg,
                method: "name",
                signature: "i",
                send: false,
                returns: "string"
            },

            // transfer name to a new owner
            transfer: {
                to: contracts.namereg,
                method: "transfer",
                signature: "b32i",
                send: true,
                returns: "null"
            },

            // give up ownership of a name
            disown: {
                to: contracts.namereg,
                method: "disown",
                signature: "b32",
                send: true,
                returns: "null"
            }

        },

        // faucets.se
        cashFaucet: {
            to: contracts.faucets,
            method: "cashFaucet",
            returns: "number",
            send: true
        },
        reputationFaucet: {
            to: contracts.faucets,
            method: "reputationFaucet",
            signature: "i",
            returns: "number",
            send: true
        },

        // cash.se
        getCashBalance: {
            to: contracts.cash,
            method: "balance",
            signature: "i",
            returns: "unfix"
        },
        balance: {
            to: contracts.cash,
            method: "balance",
            signature: "i",
            returns: "unfix"
        },
        sendCash: {
            to: contracts.cash,
            method: "send",
            send: true,
            signature: "ii",
            returns: "unfix"
        },
        sendCashFrom: {
            to: contracts.cash,
            method: "sendFrom",
            send: true,
            signature: "iii",
            returns: "unfix"
        },

        // info.se
        getCreator: {
            to: contracts.info,
            method: "getCreator",
            signature: "i",
            returns: "address"
        },
        getCreationFee: {
            to: contracts.info,
            method: "getCreationFee",
            signature: "i",
            returns: "unfix"
        },
        getDescription: {
            to: contracts.info,
            method: "getDescription",
            signature: "i",
            returns: "string"
        },
        setInfo: {
            to: contracts.info,
            method: "setInfo",
            signature: "isii",
            returns: "number",
            send: true
        },

        // redeem_interpolate.se
        redeem_interpolate: {
            to: contracts.redeem_interpolate,
            method: "interpolate",
            signature: "iiiii"
        },
        read_ballots: {
            to: contracts.redeem_interpolate,
            method: "read_ballots",
            signature: "iiiii"
        },

        // center.se
        center: {
            to: contracts.center,
            method: "center",
            signature: "aaaaaii"
        },

        // redeem_center.se
        redeem_center: {
            to: contracts.redeem_center,
            method: "center",
            signature: "iiiii",
            returns: "number"
        },
        redeem_covariance: {
            to: contracts.redeem_center,
            method: "covariance",
            signature: "iiiii"
        },

        // redeem_score.se
        redeem_blank: {
            to: contracts.redeem_score,
            method: "blank",
            signature: "iiiii"
        },
        redeem_loadings: {
            to: contracts.redeem_score,
            method: "loadings",
            signature: "iiiii",
            returns: "number"
        },

        // score.se
        blank: {
            to: contracts.score,
            method: "blank",
            signature: "iii",
            returns: "number[]"
        },
        loadings: {
            to: contracts.score,
            method: "loadings",
            signature: "aaaii",
            returns: "number[]"
        },

        // resolve.se
        resolve: {
            to: contracts.resolve,
            method: "resolve",
            signature: "aaaaaii",
            returns: "number[]"
        },

        // redeem_resolve.se
        redeem_resolve: {
            to: contracts.redeem_resolve,
            method: "resolve",
            signature: "iiiii",
            returns: "number"
        },

        // branches.se
        getBranches: {
            to: contracts.branches,
            method: "getBranches",
            returns: "hash[]"
        },
        getMarkets: {
            to: contracts.branches,
            method: "getMarkets",
            signature: "i",
            returns: "hash[]"
        },
        getPeriodLength: {
            to: contracts.branches,
            method: "getPeriodLength",
            signature: "i",
            returns: "number"
        },
        getVotePeriod: {
            to: contracts.branches,
            method: "getVotePeriod",
            signature: "i",
            returns: "number"
        },
        getStep: {
            to: contracts.branches,
            method: "getStep",
            signature: "i",
            returns: "number"
        },
        setStep: {
            to: contracts.branches,
            method: "setStep",
            signature: "ii",
            send: true
        },
        getSubstep: {
            to: contracts.branches,
            method: "getSubstep",
            signature: "i",
            returns: "number"
        },
        setSubstep: {
            to: contracts.branches,
            method: "setSubstep",
            signature: "ii",
            send: true
        },
        incrementSubstep: {
            to: contracts.branches,
            method: "incrementSubstep",
            signature: "i",
            send: true
        },
        getNumMarkets: {
            to: contracts.branches,
            method: "getNumMarkets",
            signature: "i",
            returns: "number"
        },
        getMinTradingFee: {
            to: contracts.branches,
            method: "getMinTradingFee",
            signature: "i",
            returns: "unfix"
        },
        getNumBranches: {
            to: contracts.branches,
            method: "getNumBranches",
            returns: "number"
        },
        getBranch: {
            to: contracts.branches,
            method: "getBranch",
            signature: "i",
            returns: "hash"
        },
        incrementPeriod: {
            to: contracts.branches,
            method: "incrementPeriod",
            signature: "i",
            send: true
        },
        addMarket: {
            to: contracts.branches,
            method: "addMarket",
            signature: "ii",
            returns: "number",
            send: true
        },

        // events.se
        getEventInfo: {
            to: contracts.events,
            method: "getEventInfo",
            signature: "i",
            returns: "hash[]"
        },
        getEventBranch: {
            to: contracts.events,
            method: "getEventBranch",
            signature: "i",
            returns: "hash"
        },
        getExpiration: {
            to: contracts.events,
            method: "getExpiration",
            signature: "i",
            returns: "number"
        },
        getOutcome: {
            to: contracts.events,
            method: "getOutcome",
            signature: "i",
            returns: "unfix"
        },
        getMinValue: {
            to: contracts.events,
            method: "getMinValue",
            signature: "i",
            returns: "number"
        },
        getMaxValue: {
            to: contracts.events,
            method: "getMaxValue",
            signature: "i",
            returns: "number"
        },
        getNumOutcomes: {
            to: contracts.events,
            method: "getNumOutcomes",
            signature: "i",
            returns: "number"
        },

        // expiringEvents.se
        getEvents: {
            to: contracts.expiringEvents,
            method: "getEvents",
            signature: "ii",
            returns: "hash[]"
        },
        getNumberEvents: {
            to: contracts.expiringEvents,
            method: "getNumberEvents",
            signature: "ii",
            returns: "number"
        },
        getEvent: {
            to: contracts.expiringEvents,
            method: "getEvent",
            signature: "iii",
            returns: "hash"
        },
        getTotalRepReported: {
            to: contracts.expiringEvents,
            method: "getTotalRepReported",
            signature: "ii",
            returns: "number"
        },
        getReporterBallot: {
            to: contracts.expiringEvents,
            method: "getReporterBallot",
            signature: "iii",
            returns: "unfix[]"
        },
        getReport: {
            to: contracts.expiringEvents,
            method: "getReport",
            signature: "iiii",
            returns: "unfix"
        },
        getReportHash: {
            to: contracts.expiringEvents,
            method: "getReportHash",
            signature: "iii",
            returns: "hash"
        },
        getVSize: {
            to: contracts.expiringEvents,
            method: "getVSize",
            signature: "ii",
            returns: "number"
        },
        getReportsFilled: {
            to: contracts.expiringEvents,
            method: "getReportsFilled",
            signature: "ii",
            returns: "unfix[]"
        },
        getReportsMask: {
            to: contracts.expiringEvents,
            method: "getReportsMask",
            signature: "ii",
            returns: "number[]"
        },
        getWeightedCenteredData: {
            to: contracts.expiringEvents,
            method: "getWeightedCenteredData",
            signature: "ii",
            returns: "unfix[]"
        },
        getCovarianceMatrixRow: {
            to: contracts.expiringEvents,
            method: "getCovarianceMatrixRow",
            signature: "ii",
            returns: "unfix[]"
        },
        getDeflated: {
            to: contracts.expiringEvents,
            method: "getDeflated",
            signature: "ii",
            returns: "unfix[]"
        },
        getLoadingVector: {
            to: contracts.expiringEvents,
            method: "getLoadingVector",
            signature: "ii",
            returns: "unfix[]"
        },
        getLatent: {
            to: contracts.expiringEvents,
            method: "getLatent",
            signature: "ii",
            returns: "unfix"
        },
        getScores: {
            to: contracts.expiringEvents,
            method: "getScores",
            signature: "ii",
            returns: "unfix[]"
        },
        getSetOne: {
            to: contracts.expiringEvents,
            method: "getSetOne",
            signature: "ii",
            returns: "unfix[]"
        },
        getSetTwo: {
            to: contracts.expiringEvents,
            method: "getSetTwo",
            signature: "ii",
            returns: "unfix[]"
        },
        returnOld: {
            to: contracts.expiringEvents,
            method: "returnOld",
            signature: "ii",
            returns: "unfix[]"
        },
        getNewOne: {
            to: contracts.expiringEvents,
            method: "getNewOne",
            signature: "ii",
            returns: "unfix[]"
        },
        getNewTwo: {
            to: contracts.expiringEvents,
            method: "getNewTwo",
            signature: "ii",
            returns: "unfix[]"
        },
        getAdjPrinComp: {
            to: contracts.expiringEvents,
            method: "getAdjPrinComp",
            signature: "ii",
            returns: "unfix[]"
        },
        getSmoothRep: {
            to: contracts.expiringEvents,
            method: "getSmoothRep",
            signature: "ii",
            returns: "unfix[]"
        },
        getOutcomesFinal: {
            to: contracts.expiringEvents,
            method: "getOutcomesFinal",
            signature: "ii",
            returns: "unfix[]"
        },
        getReporterPayouts: {
            to: contracts.expiringEvents,
            method: "getReporterPayouts",
            signature: "ii",
            returns: "unfix[]"
        },
        moveEventsToCurrentPeriod: {
            to: contracts.expiringEvents,
            method: "moveEventsToCurrentPeriod",
            signature: "iii",
            send: true
        },
        addEvent: {
            to: contracts.expiringEvents,
            method: "addEvent",
            signature: "iii",
            send: true
        },
        setTotalRepReported: {
            to: contracts.expiringEvents,
            method: "setTotalRepReported",
            signature: "iii",
            send: true
        },
        setReporterBallot: {
            to: contracts.expiringEvents,
            method: "setReporterBallot",
            signature: "iiiai",
            send: true,
            returns: "number"
        },
        setVSize: {
            to: contracts.expiringEvents,
            method: "setVSize",
            signature: "iii",
            send: true
        },
        setReportsFilled: {
            to: contracts.expiringEvents,
            method: "setReportsFilled",
            signature: "iia",
            send: true
        },
        setReportsMask: {
            to: contracts.expiringEvents,
            method: "setReportsMask",
            signature: "iia",
            send: true
        },
        setWeightedCenteredData: {
            to: contracts.expiringEvents,
            method: "setWeightedCenteredData",
            signature: "iia",
            send: true
        },
        setCovarianceMatrixRow: {
            to: contracts.expiringEvents,
            method: "setCovarianceMatrixRow",
            signature: "iia",
            send: true
        },
        setDeflated: {
            to: contracts.expiringEvents,
            method: "setDeflated",
            signature: "iia",
            send: true
        },
        setLoadingVector: {
            to: contracts.expiringEvents,
            method: "setLoadingVector",
            signature: "iia",
            send: true
        },
        setScores: {
            to: contracts.expiringEvents,
            method: "setScores",
            signature: "iia",
            send: true
        },
        setSetOne: {
            to: contracts.expiringEvents,
            method: "setSetOne",
            signature: "iia",
            send: true
        },
        setSetTwo: {
            to: contracts.expiringEvents,
            method: "setSetTwo",
            signature: "iia",
            send: true
        },
        setOld: {
            to: contracts.expiringEvents,
            method: "setOld",
            signature: "iia",
            send: true
        },
        setNewOne: {
            to: contracts.expiringEvents,
            method: "setNewOne",
            signature: "iia",
            send: true
        },
        setNewTwo: {
            to: contracts.expiringEvents,
            method: "setNewTwo",
            signature: "iia",
            send: true
        },
        setAdjPrinComp: {
            to: contracts.expiringEvents,
            method: "setAdjPrinComp",
            signature: "iia",
            send: true
        },
        setSmoothRep: {
            to: contracts.expiringEvents,
            method: "setSmoothRep",
            signature: "iia",
            send: true
        },
        setOutcomesFinal: {
            to: contracts.expiringEvents,
            method: "setOutcomesFinal",
            signature: "iia",
            send: true
        },
        setReportHash: {
            to: contracts.expiringEvents,
            method: "setReportHash",
            signature: "iii",
            send: true
        },
        getTotalReputation: {
            to: contracts.expiringEvents,
            method: "getTotalReputation",
            signature: "ii",
            returns: "unfix"
        },
        setTotalReputation: {
            to: contracts.expiringEvents,
            method: "setTotalReputation",
            signature: "iii",
            returns: "number"
        },
        makeBallot: {
            to: contracts.expiringEvents,
            method: "makeBallot",
            signature: "ii",
            returns: "hash[]"
        },

        // markets.se
        getSimulatedBuy: {
            to: contracts.markets,
            method: "getSimulatedBuy",
            signature: "iii",
            returns: "unfix[]"
        },
        getSimulatedSell: {
            to: contracts.markets,
            method: "getSimulatedSell",
            signature: "iii",
            returns: "unfix[]"
        },
        lsLmsr: {
            to: contracts.markets,
            method: "lsLmsr",
            signature: "i",
            returns: "unfix"
        },
        getMarketOutcomeInfo: {
            to: contracts.markets,
            method: "getMarketOutcomeInfo",
            signature: "ii",
            returns: "hash[]"
        },
        getFullMarketInfo: {
            to: contracts.markets,
            method: "getFullMarketInfo",
            signature: "i",
            returns: "hash[]"
            // returns: "string"
        },
        getMarketInfo: {
            to: contracts.markets,
            method: "getMarketInfo",
            signature: "i",
            returns: "hash[]"
        },
        getMarketEvents: {
            to: contracts.markets,
            method: "getMarketEvents",
            signature: "i",
            returns: "hash[]"
        },
        getNumEvents: {
            to: contracts.markets,
            method: "getNumEvents",
            signature: "i",
            returns: "number"
        },
        getBranchID: {
            to: contracts.markets,
            method: "getBranchID",
            signature: "i",
            returns: "hash"
        },
        getCurrentParticipantNumber: {
            to: contracts.markets,
            method: "getCurrentParticipantNumber",
            signature: "i",
            returns: "number"
        },
        getMarketNumOutcomes: {
            to: contracts.markets,
            method: "getMarketNumOutcomes",
            signature: "i",
            returns: "number"
        },
        getParticipantSharesPurchased: {
            to: contracts.markets,
            method: "getParticipantSharesPurchased",
            signature: "iii",
            returns: "unfix"
        },
        getSharesPurchased: {
            to: contracts.markets,
            method: "getSharesPurchased",
            signature: "ii",
            returns: "unfix"
        },
        getWinningOutcomes: {
            to: contracts.markets,
            method: "getWinningOutcomes",
            signature: "i",
            returns: "number[]"
        },
        price: {
            to: contracts.markets,
            method: "price",
            signature: "ii",
            returns: "unfix"
        },
        getParticipantNumber: {
            to: contracts.markets,
            method: "getParticipantNumber",
            signature: "ii",
            returns: "number"
        },
        getParticipantID: {
            to: contracts.markets,
            method: "getParticipantID",
            signature: "ii",
            returns: "address"
        },
        getAlpha: {
            to: contracts.markets,
            method: "getAlpha",
            signature: "i",
            returns: "unfix"
        },
        getCumScale: {
            to: contracts.markets,
            method: "getCumScale",
            signature: "i",
            returns: "unfix"
        },
        getTradingPeriod: {
            to: contracts.markets,
            method: "getTradingPeriod",
            signature: "i",
            returns: "number"
        },
        getTradingFee: {
            to: contracts.markets,
            method: "getTradingFee",
            signature: "i",
            returns: "unfix"
        },
        initialLiquiditySetup: {
            to: contracts.markets,
            method: "initialLiquiditySetup",
            signature: "iiii",
            returns: "number",
            send: true
        },
        modifyShares: {
            to: contracts.markets,
            method: "modifyShares",
            signature: "iii",
            returns: "number",
            send: true
        },
        initializeMarket: {
            to: contracts.markets,
            method: "initializeMarket",
            signature: "iaiii",
            returns: "number",
            send: true
        },

        // reporting.se
        getRepBalance: {
            to: contracts.reporting,
            method: "getRepBalance",
            signature: "ii",
            returns: "unfix"
        },
        getRepByIndex: {
            to: contracts.reporting,
            method: "getRepByIndex",
            signature: "ii",
            returns: "unfix"
        },
        getReporterID: {
            to: contracts.reporting,
            method: "getReporterID",
            signature: "ii",
            returns: "address"
        },
        getReputation: {
            to: contracts.reporting,
            method: "getReputation",
            signature: "i",
            returns: "number[]"
        },
        getNumberReporters: {
            to: contracts.reporting,
            method: "getNumberReporters",
            signature: "i",
            returns: "number"
        },
        repIDToIndex: {
            to: contracts.reporting,
            method: "repIDToIndex",
            signature: "ii",
            returns: "number"
        },
        getTotalRep: {
            to: contracts.reporting,
            method: "getTotalRep",
            signature: "i",
            returns: "unfix"
        },
        hashReport: {
            to: contracts.reporting,
            method: "hashReport",
            signature: "ai"
        },

        // checkQuorum.se
        checkQuorum: {
            to: contracts.checkQuorum,
            method: "checkQuorum",
            signature: "i",
            returns: "number"
        },

        // buy&sellShares.se
        getNonce: {
            to: contracts.buyAndSellShares,
            method: "getNonce",
            signature: "i",
            returns: "number"
        },
        buyShares: {
            to: contracts.buyAndSellShares,
            method: "buyShares",
            signature: "iiiiii",
            returns: "unfix",
            send: true
        },
        sellShares: {
            to: contracts.buyAndSellShares,
            method: "sellShares",
            signature: "iiiiii",
            returns: "unfix",
            send: true
        },

        // createBranch.se
        createSubbranch: {
            to: contracts.createBranch,
            method: "createSubbranch",
            signature: "siii",
            send: true
        },

        // sendReputation.se
        sendReputation: {
            to: contracts.sendReputation,
            method: "sendReputation",
            signature: "iii",
            send: true,
            returns: "unfix"
        },

        // makeReports.se
        report: {
            to: contracts.makeReports,
            method: "report",
            signature: "iaii",
            returns: "number",
            send: true
        },
        submitReportHash: {
            to: contracts.makeReports,
            method: "submitReportHash",
            signature: "iii",
            returns: "number",
            send: true
        },
        checkReportValidity: {
            to: contracts.makeReports,
            method: "checkReportValidity",
            signature: "iai",
            returns: "number"
        },
        slashRep: {
            to: contracts.makeReports,
            method: "slashRep",
            signature: "iiiai",
            returns: "number",
            send: true
        },

        // createEvent.se
        createEvent: {
            to: contracts.createEvent,
            method: "createEvent",
            signature: "isiiii",
            send: true
        },

        // createMarket.se
        createMarket: {
            to: contracts.createMarket,
            method: "createMarket",
            signature: "isiiia",
            send: true
        },

        // closeMarket.se
        closeMarket: {
            to: contracts.closeMarket,
            method: "closeMarket",
            signature: "ii",
            returns: "number",
            send: true
        },

        // dispatch.se
        dispatch: {
            to: contracts.dispatch,
            method: "dispatch",
            signature: "i",
            returns: "number"
        }
    };

};
