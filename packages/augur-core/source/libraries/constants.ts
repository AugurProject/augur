
export const INTERNAL_CONTRACTS = [
    'Universe',
    'Augur',
    'AugurTrading',
    'CancelOrder',
    'ShareToken',
    'InitialReporter',
    'DisputeCrowdsourcer',
    'DisputeWindow',
    'Market',
    'ReputationToken',
    'CreateOrder',
    'FillOrder',
    'Orders',
    'Trade',
    'SimulateTrade',
    'ProfitLoss',
    'Time',
    'ZeroXTrade',
    'GnosisSafeRegistry',
    'WarpSync',
    'OICash',
    'Affiliates',
    'AffiliateValidator',
    'EthExchange',
    'RepExchangeFactory',
    'RepExchange',
    // utility
    'BuyParticipationTokens',
    'Formulas',
    'HotLoading',
    'RedeemStake',
    'RepSymbol',
    // factories
    'DisputeCrowdsourcerFactory',
    'DisputeWindowFactory',
    'InitialReporterFactory',
    'MarketFactory',
    'OICashFactory',
    'ReputationTokenFactory',
    'UniverseFactory',
];

export const TRADING_CONTRACTS = [
    'CreateOrder',
    'FillOrder',
    'CancelOrder',
    'Trade',
    'Orders',
    'ZeroXTrade',
    'ProfitLoss',
    'SimulateTrade',
    'ZeroXExchange', // uses registration name, not environments.json name
    'GnosisSafeRegistry'
];

export const TEST_CONTRACTS = [
    'CashFaucet',
    'TimeControlled',
    'TestNetReputationTokenFactory',
    'TestNetReputationToken',
    // Maker
    'TestNetDaiJoin',
    'TestNetDaiPot',
    'TestNetDaiVat',
];

export const EXTERNAL_CONTRACTS = [
    'OldLegacyReputationToken',
    'LegacyReputationToken',
    // 0x contracts
    'ERC20Proxy',
    'ERC721Proxy',
    'ERC1155Proxy',
    'MultiAssetProxy',
    'Exchange',
    'Coordinator',
    'CoordinatorRegistry',
    'ChaiBridge',
    'DevUtils',
    'WETH9',
    'ZRXToken',
    // Maker
    'Cash',
    'DaiJoin',
    'DaiPot',
    'DaiVat',
    // Gnosis
    'GnosisSafe',
    'ProxyFactory',
    // Uniswap
    'UniswapV2Factory',
];

export const REGISTERED_EXTERNAL_CONTRACTS = [
    'LegacyReputationToken',
    // 0x contracts
    'Exchange',
    'WETH9',
    // Maker
    'Cash',
    'DaiJoin',
    'DaiPot',
    'DaiVat',
    // Gnosis
    'GnosisSafe',
    'ProxyFactory',
    // Uniswap
    // "UniswapV2Factory", TODO
];

export const REGISTERED_INTERNAL_CONTRACTS = [
    'CancelOrder',
    'ShareToken',
    'InitialReporter',
    'DisputeCrowdsourcer',
    'DisputeWindow',
    'Market',
    'CreateOrder',
    'FillOrder',
    'Orders',
    'Trade',
    'SimulateTrade',
    'ProfitLoss',
    'Time',
    'ZeroXTrade',
    'GnosisSafeRegistry',
    'WarpSync',
    'OICash',
    'Affiliates',
    'AffiliateValidator',
    'EthExchange',
    'RepExchangeFactory',
    'RepExchange',
    // utility
    'BuyParticipationTokens',
    'Formulas',
    'HotLoading',
    'RedeemStake',
    'RepSymbol',
    // factories
    'DisputeCrowdsourcerFactory',
    'DisputeWindowFactory',
    'InitialReporterFactory',
    'MarketFactory',
    'OICashFactory',
    'ReputationTokenFactory',
    'UniverseFactory',
];

export const INITIALIZED_CONTRACTS = [
    'ShareToken',
    'CreateOrder',
    'FillOrder',
    'CancelOrder',
    'Trade',
    'Orders',
    'ProfitLoss',
    'SimulateTrade',
    'ZeroXTrade',
    'GnosisSafeRegistry',
    'WarpSync',
    'EthExchange' // TODO Remove once uniswap in
];
