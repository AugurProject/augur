export const AMMFactoryAbi = [
  {
    'inputs': [
      {
        'internalType': 'address',
        'name': '_proxyToClone',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_fee',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'constructor',
  },
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'contract IMarket',
        'name': '_market',
        'type': 'address',
      },
      {
        'internalType': 'contract IParaShareToken',
        'name': '_para',
        'type': 'address',
      },
    ],
    'name': 'addAMM',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'contract IMarket',
        'name': '_market',
        'type': 'address',
      },
      {
        'internalType': 'contract IParaShareToken',
        'name': '_para',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_setsToBuy',
        'type': 'uint256',
      },
      {
        'internalType': 'bool',
        'name': '_swapForYes',
        'type': 'bool',
      },
      {
        'internalType': 'uint256',
        'name': '_swapHowMuch',
        'type': 'uint256',
      },
    ],
    'name': 'addAMMWithLiquidity',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'internalType': 'address',
        'name': 'target',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'salt',
        'type': 'uint256',
      },
      {
        'internalType': 'address',
        'name': 'creator',
        'type': 'address',
      },
    ],
    'name': 'clone2Address',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'pure',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'exchanges',
    'outputs': [
      {
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'fee',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [
      {
        'internalType': 'contract IMarket',
        'name': '_market',
        'type': 'address',
      },
      {
        'internalType': 'contract IParaShareToken',
        'name': '_para',
        'type': 'address',
      },
    ],
    'name': 'salt',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'pure',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'contract IMarket',
        'name': '_market',
        'type': 'address',
      },
      {
        'internalType': 'contract IParaShareToken',
        'name': '_para',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'sender',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': 'recipient',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': 'quantity',
        'type': 'uint256',
      },
    ],
    'name': 'transferCash',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];
