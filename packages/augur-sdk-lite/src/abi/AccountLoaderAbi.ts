export const AccountLoaderAbi = [
    {
        "constant": true,
        "inputs": [],
        "name": "augurWalletFactory",
        "outputs": [
            {
                "internalType": "contract IAugurWalletFactory",
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
        "inputs": [],
        "name": "ethExchange",
        "outputs": [
            {
                "internalType": "contract IUniswapV2Pair",
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
                        "name": "walletETH",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "walletDAI",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "walletREP",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "walletLegacyREP",
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
        "name": "token0IsCashInETHExchange",
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