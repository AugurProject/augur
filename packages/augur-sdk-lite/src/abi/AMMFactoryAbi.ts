export const AMMFactoryAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_proxyToClone",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
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
        "internalType": "contract ParaShareToken",
        "name": "_para",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_fee",
        "type": "uint256"
      }
    ],
    "name": "addAMM",
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
        "internalType": "contract ParaShareToken",
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
        "internalType": "contract ParaShareToken",
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
    "constant": true,
    "inputs": [
      {
        "internalType": "contract IMarket",
        "name": "_market",
        "type": "address"
      },
      {
        "internalType": "contract ParaShareToken",
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
        "internalType": "contract ParaShareToken",
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
        "internalType": "contract ParaShareToken",
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
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "quantity",
        "type": "uint256"
      }
    ],
    "name": "transferCash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
