export const AMMFactoryAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_proxyToClone",
        "type": "address"
      },
      {
        "internalType": "contract BFactory",
        "name": "_bFactory",
        "type": "address"
      },
      {
        "internalType": "contract WrappedShareTokenFactory",
        "name": "_wrappedShareTokenFactory",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "contract IAMMExchange",
        "name": "amm",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "contract IMarket",
        "name": "market",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "contract IParaShareToken",
        "name": "shareToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "contract BPool",
        "name": "bPool",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string[]",
        "name": "_symbols",
        "type": "string[]"
      }
    ],
    "name": "AMMCreated",
    "type": "event"
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_cash",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_ratioFactor",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_keepLong",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "string[]",
        "name": "_symbols",
        "type": "string[]"
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_cash",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_cashToInvalidPool",
        "type": "uint256"
      },
      {
        "internalType": "string[]",
        "name": "_symbols",
        "type": "string[]"
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "balancerPools",
    "outputs": [
      {
        "internalType": "address",
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "calculateAMMAddress",
    "outputs": [
      {
        "internalType": "address",
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
        "internalType": "contract IMarket[]",
        "name": "_markets",
        "type": "address[]"
      },
      {
        "internalType": "contract IParaShareToken[]",
        "name": "_shareTokens",
        "type": "address[]"
      },
      {
        "internalType": "address payable",
        "name": "_shareHolder",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "_fingerprint",
        "type": "bytes32"
      }
    ],
    "name": "claimMarketsProceeds",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "salt",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "clone2Address",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "exchanges",
    "outputs": [
      {
        "internalType": "address",
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
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
        "internalType": "address",
        "name": "",
        "type": "address"
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "getBPool",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
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
        "internalType": "string[]",
        "name": "_symbols",
        "type": "string[]"
      }
    ],
    "name": "removeLiquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "_shortShare",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_longShare",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "salt",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "pure",
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_invalidAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_noAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_yesAmount",
        "type": "uint256"
      }
    ],
    "name": "shareTransfer",
    "outputs": [],
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
        "internalType": "contract IParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_quantity",
        "type": "uint256"
      }
    ],
    "name": "transferCash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
