export const WethWrapperForAMMExchangeAbi = [
  {
    "inputs": [
      {
        "internalType": "contract IAMMFactory",
        "name": "_factory",
        "type": "address"
      },
      {
        "internalType": "contract ParaShareToken",
        "name": "_shareToken",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": true,
    "stateMutability": "payable",
    "type": "fallback"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_ratioFactor",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_keepYes",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "addAMMWithLiquidity",
    "outputs": [
      {
        "internalType": "address",
        "name": "_ammAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_lpTokens",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_ratioFactor",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_keepYes",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "addInitialLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      }
    ],
    "name": "addLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_buyYes",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "_minShares",
        "type": "uint256"
      }
    ],
    "name": "enterPosition",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minCashPayout",
        "type": "uint256"
      }
    ],
    "name": "exitAll",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_invalidShares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_noShares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_yesShares",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minCashPayout",
        "type": "uint256"
      }
    ],
    "name": "exitPosition",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "factory",
    "outputs": [
      {
        "internalType": "contract IAMMFactory",
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
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "getAMM",
    "outputs": [
      {
        "internalType": "contract IAMMExchange",
        "name": "",
        "type": "address"
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
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_poolTokensToSell",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_minSetsSold",
        "type": "uint256"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_invalidShare",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_noShare",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_yesShare",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_cashShare",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "shareToken",
    "outputs": [
      {
        "internalType": "contract ParaShareToken",
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
        "internalType": "contract WETH9",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
