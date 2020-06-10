export const HotLoadingAbi = [
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "contract IAugur",
                "name": "_augur",
                "type": "address"
            },
            {
                "internalType": "contract IUniverse",
                "name": "_universe",
                "type": "address"
            }
        ],
        "name": "getCurrentDisputeWindowData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "disputeWindow",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "purchased",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fees",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct HotLoading.DisputeWindowData",
                "name": "_disputeWindowData",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "contract IMarket",
                "name": "_market",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_numOutcomes",
                "type": "uint256"
            },
            {
                "internalType": "contract IOrders",
                "name": "_orders",
                "type": "address"
            }
        ],
        "name": "getLastTradedPrices",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "_lastTradedPrices",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "contract IAugur",
                "name": "_augur",
                "type": "address"
            },
            {
                "internalType": "contract IMarket",
                "name": "_market",
                "type": "address"
            },
            {
                "internalType": "contract IFillOrder",
                "name": "_fillOrder",
                "type": "address"
            },
            {
                "internalType": "contract IOrders",
                "name": "_orders",
                "type": "address"
            }
        ],
        "name": "getMarketData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "extraInfo",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "marketCreator",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32[]",
                        "name": "outcomes",
                        "type": "bytes32[]"
                    },
                    {
                        "internalType": "enum IMarket.MarketType",
                        "name": "marketType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "int256[]",
                        "name": "displayPrices",
                        "type": "int256[]"
                    },
                    {
                        "internalType": "address",
                        "name": "designatedReporter",
                        "type": "address"
                    },
                    {
                        "internalType": "enum HotLoading.ReportingState",
                        "name": "reportingState",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint256",
                        "name": "disputeRound",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "winningPayout",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "volume",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "openInterest",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "lastTradedPrices",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "address",
                        "name": "universe",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "numTicks",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "feeDivisor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "affiliateFeeDivisor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "numOutcomes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "validityBond",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reportingFeeDivisor",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "outcomeVolumes",
                        "type": "uint256[]"
                    }
                ],
                "internalType": "struct HotLoading.MarketData",
                "name": "_marketData",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "contract IAugur",
                "name": "_augur",
                "type": "address"
            },
            {
                "internalType": "contract IMarket",
                "name": "_market",
                "type": "address"
            }
        ],
        "name": "getReportingState",
        "outputs": [
            {
                "internalType": "enum HotLoading.ReportingState",
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "contract IMarket[]",
                "name": "_markets",
                "type": "address[]"
            }
        ],
        "name": "getTotalValidityBonds",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_totalValidityBonds",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]