export const AccountLoaderAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "cash",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
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
                "internalType": "address",
                "name": "_firstToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_secondToken",
                "type": "address"
            }
        ],
        "name": "getExchangeRate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getInitialized",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "contract Augur",
                "name": "_augur",
                "type": "address"
            },
            {
                "internalType": "contract IAugurTrading",
                "name": "_augurTrading",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "legacyReputationToken",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
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
                "internalType": "address",
                "name": "_account",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "_reputationToken",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "_USDC",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "_USDT",
                "type": "address"
            }
        ],
        "name": "loadAccountData",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "signerETH",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "signerDAI",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "signerREP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "signerLegacyREP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoDAIperREP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoDAIperETH",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoDAIperUSDC",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoDAIperUSDT",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoETHperREP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoETHperUSDC",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoETHperUSDT",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoREPperUSDC",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoREPperUSDT",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "attoUSDCperUSDT",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "signerUSDC",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "signerUSDT",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct AccountLoader.AccountData",
                "name": "_data",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "uniswapFactory",
        "outputs": [
            {
                "internalType": "contract IUniswapV2Factory",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "weth",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];