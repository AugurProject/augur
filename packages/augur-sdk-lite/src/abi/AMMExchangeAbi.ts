export const AMMExchangeAbi = [
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'owner',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'spender',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Approval',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'sender',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'cash',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'outputShares',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'bool',
        'name': 'buyYes',
        'type': 'bool',
      },
    ],
    'name': 'EnterPosition',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'sender',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'invalidShares',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'noShares',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'yesShares',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'cashPayout',
        'type': 'uint256',
      },
    ],
    'name': 'ExitPosition',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'internalType': 'address',
        'name': 'sender',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'inputShares',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'outputShares',
        'type': 'uint256',
      },
      {
        'indexed': false,
        'internalType': 'bool',
        'name': 'inputYes',
        'type': 'bool',
      },
    ],
    'name': 'SwapPosition',
    'type': 'event',
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'from',
        'type': 'address',
      },
      {
        'indexed': true,
        'internalType': 'address',
        'name': 'to',
        'type': 'address',
      },
      {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'value',
        'type': 'uint256',
      },
    ],
    'name': 'Transfer',
    'type': 'event',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'INVALID',
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
    'inputs': [],
    'name': 'NO',
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
    'inputs': [],
    'name': 'YES',
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
    'constant': false,
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_setsToBuy',
        'type': 'uint256',
      },
    ],
    'name': 'addLiquidity',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
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
    'name': 'addLiquidityThenSwap',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
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
        'name': '_owner',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': '_spender',
        'type': 'address',
      },
    ],
    'name': 'allowance',
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
    'name': 'allowances',
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
    'constant': false,
    'inputs': [
      {
        'internalType': 'address',
        'name': '_spender',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_amount',
        'type': 'uint256',
      },
    ],
    'name': 'approve',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'augurMarket',
    'outputs': [
      {
        'internalType': 'contract IMarket',
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
    'inputs': [
      {
        'internalType': 'address',
        'name': '_account',
        'type': 'address',
      },
    ],
    'name': 'balanceOf',
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
        'internalType': 'address',
        'name': '',
        'type': 'address',
      },
    ],
    'name': 'balances',
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
    'inputs': [],
    'name': 'cash',
    'outputs': [
      {
        'internalType': 'contract ICash',
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
    'name': 'decimals',
    'outputs': [
      {
        'internalType': 'uint8',
        'name': '',
        'type': 'uint8',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'address',
        'name': '_spender',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_subtractedValue',
        'type': 'uint256',
      },
    ],
    'name': 'decreaseAllowance',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
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
        'internalType': 'uint256',
        'name': '_cashCost',
        'type': 'uint256',
      },
      {
        'internalType': 'bool',
        'name': '_buyYes',
        'type': 'bool',
      },
      {
        'internalType': 'uint256',
        'name': '_minShares',
        'type': 'uint256',
      },
    ],
    'name': 'enterPosition',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
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
        'internalType': 'uint256',
        'name': '_minCashPayout',
        'type': 'uint256',
      },
    ],
    'name': 'exitAll',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
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
        'internalType': 'uint256',
        'name': '_invalidShares',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_noShares',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_yesShares',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_minCashPayout',
        'type': 'uint256',
      },
    ],
    'name': 'exitPosition',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'factory',
    'outputs': [
      {
        'internalType': 'contract IAMMFactory',
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
    'constant': false,
    'inputs': [
      {
        'internalType': 'address',
        'name': '_spender',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_addedValue',
        'type': 'uint256',
      },
    ],
    'name': 'increaseAllowance',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
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
        'name': '_shareToken',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_fee',
        'type': 'uint256',
      },
    ],
    'name': 'initialize',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'numTicks',
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
        'internalType': 'uint256',
        'name': '_poolYes',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_poolNo',
        'type': 'uint256',
      },
    ],
    'name': 'poolConstant',
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
        'internalType': 'uint256',
        'name': '_yesses',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_nos',
        'type': 'uint256',
      },
    ],
    'name': 'rateAddLiquidity',
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
    'name': 'rateAddLiquidityThenSwap',
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
        'internalType': 'uint256',
        'name': '_cashToSpend',
        'type': 'uint256',
      },
      {
        'internalType': 'bool',
        'name': '_buyYes',
        'type': 'bool',
      },
    ],
    'name': 'rateEnterPosition',
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
    'inputs': [],
    'name': 'rateExitAll',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '_cashPayout',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_invalidFromUser',
        'type': 'uint256',
      },
      {
        'internalType': 'int256',
        'name': '_noFromUser',
        'type': 'int256',
      },
      {
        'internalType': 'int256',
        'name': '_yesFromUser',
        'type': 'int256',
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
        'internalType': 'uint256',
        'name': '_invalidShares',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_noShares',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_yesShares',
        'type': 'uint256',
      },
    ],
    'name': 'rateExitPosition',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '_cashPayout',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_invalidFromUser',
        'type': 'uint256',
      },
      {
        'internalType': 'int256',
        'name': '_noFromUser',
        'type': 'int256',
      },
      {
        'internalType': 'int256',
        'name': '_yesFromUser',
        'type': 'int256',
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
        'internalType': 'uint256',
        'name': '_poolTokensToSell',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_minSetsSold',
        'type': 'uint256',
      },
    ],
    'name': 'rateRemoveLiquidity',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '_invalidShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_noShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_yesShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_cashShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_setsSold',
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
        'internalType': 'uint256',
        'name': '_inputShares',
        'type': 'uint256',
      },
      {
        'internalType': 'bool',
        'name': '_inputYes',
        'type': 'bool',
      },
    ],
    'name': 'rateSwap',
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
    'constant': false,
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_poolTokensToSell',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_minSetsSold',
        'type': 'uint256',
      },
    ],
    'name': 'removeLiquidity',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '_invalidShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_noShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_yesShare',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_cashShare',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'shareToken',
    'outputs': [
      {
        'internalType': 'contract IParaShareToken',
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
    'inputs': [
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
    'name': 'sharesRateForAddLiquidityThenSwap',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '_yesses',
        'type': 'uint256',
      },
      {
        'internalType': 'uint256',
        'name': '_nos',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function',
  },
  {
    'constant': false,
    'inputs': [
      {
        'internalType': 'uint256',
        'name': '_inputShares',
        'type': 'uint256',
      },
      {
        'internalType': 'bool',
        'name': '_inputYes',
        'type': 'bool',
      },
      {
        'internalType': 'uint256',
        'name': '_minOutputShares',
        'type': 'uint256',
      },
    ],
    'name': 'swap',
    'outputs': [
      {
        'internalType': 'uint256',
        'name': '',
        'type': 'uint256',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'totalSupply',
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
    'constant': false,
    'inputs': [
      {
        'internalType': 'address',
        'name': '_recipient',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_amount',
        'type': 'uint256',
      },
    ],
    'name': 'transfer',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
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
        'internalType': 'address',
        'name': '_sender',
        'type': 'address',
      },
      {
        'internalType': 'address',
        'name': '_recipient',
        'type': 'address',
      },
      {
        'internalType': 'uint256',
        'name': '_amount',
        'type': 'uint256',
      },
    ],
    'name': 'transferFrom',
    'outputs': [
      {
        'internalType': 'bool',
        'name': '',
        'type': 'bool',
      },
    ],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function',
  },
];
