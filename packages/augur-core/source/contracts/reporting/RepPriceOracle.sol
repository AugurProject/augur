pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/reporting/IRepPriceOracle.sol';
import 'ROOT/ens/IENSRegistry.sol';
import 'ROOT/ens/IENSResolver.sol';


contract RepPriceOracle is IRepPriceOracle, Initializable {

    uint256 constant Q112 = 2**112;

    bytes32 public constant UNISWAP_REGISTRY_ENS_NAME = 0xf259e1e59b6e1e9de21a18289a53332ebc255d2e4ece8a91e0e90c628a9c7f87; // "uniswapv2.eth"; // TODO: set this to the actual namehash of the owned ENS name

    IAugur public augur;
    address public cash;
    uint256 public period = 3 days; // TODO: revisit if this is an appropriate period
    IUniswapV2Factory public uniswapFactory;
    IENSRegistry public ensRegistry;
    bool public uniswapUpgraded;

    struct ExchangeData {
        IUniswapV2 exchange;
        uint256 repPriceAccumulated;
        uint256 blockNumber;
        uint256 blockTimestamp;
        uint256 price;
        bool repIsToken0;
        bool upgradeHandled;
    }

    mapping(address => ExchangeData) public exchangeData;

    uint256 public genesisInitialRepPriceinAttoCash = 9 * 10**18;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        cash = _augur.lookup("Cash");
        require(cash != address(0));
        uniswapFactory = IUniswapV2Factory(_augur.lookup("UniswapV2Factory"));
        require(uniswapFactory != IUniswapV2Factory(0));
        ensRegistry = IENSRegistry(_augur.lookup("ENSRegistry"));
        require(ensRegistry != IENSRegistry(0));
    }

    function upgradeUniswapFactory() public {
        require(!uniswapUpgraded, "Already upgraded");
        IENSResolver _resolver = IENSResolver(ensRegistry.resolver(UNISWAP_REGISTRY_ENS_NAME));
        require(_resolver != IENSResolver(0), "Resolver for ENS name not found");
        address _newUniswapFactory = _resolver.addr(UNISWAP_REGISTRY_ENS_NAME);
        require(_newUniswapFactory != address(0), "Could not get address from resolver");
        uniswapFactory = IUniswapV2Factory(_newUniswapFactory);
        uniswapUpgraded = true;
    }

    // TODO: Consider when this should be called other than when the price is requested as part of new fee setting
    function pokeRepPriceInAttoCash(IV2ReputationToken _reputationToken) external returns (uint256) {
        if (exchangeData[address(_reputationToken)].exchange == IUniswapV2(0)) {
            initializeUniverse(_reputationToken);
        }
        ExchangeData memory _newExchangeData = calculateNewExchangeData(_reputationToken);
        exchangeData[address(_reputationToken)] = _newExchangeData;
        return _newExchangeData.price;
    }

    function calculateNewExchangeData(IV2ReputationToken _reputationToken) private returns (ExchangeData memory) {
        ExchangeData memory _exchangeData = exchangeData[address(_reputationToken)];
        uint256 _blockNumber = block.number;
        uint256 _blockTimestamp = block.timestamp; // solium-disable-line security/no-block-members
        if (_blockNumber == _exchangeData.blockNumber) {
            return _exchangeData;
        }

        if (uniswapUpgraded && !_exchangeData.upgradeHandled) {
            uint256 _price = _exchangeData.price;
            initializeUniverse(_reputationToken);
            exchangeData[address(_reputationToken)].price = _price;
            exchangeData[address(_reputationToken)].upgradeHandled = true;
            return exchangeData[address(_reputationToken)];
        }

        IUniswapV2 _exchange = _exchangeData.exchange;
        if (_blockNumber != _exchange.blockNumberLast()) {
            _exchange.sync();
        }
        uint256 _repPriceCumulative = _exchangeData.repIsToken0 ? _exchange.price0CumulativeLast() : _exchange.price1CumulativeLast();
        if (_repPriceCumulative == 0) {
            return _exchangeData;
        }

        // The first time we have actual data from the exchange we need to simply record the acumulator value and return the default since we have no accurate _relative_ delta to base the real price off of
        if (_exchangeData.repPriceAccumulated == 0) {
            _exchangeData.blockNumber = _blockNumber;
            _exchangeData.blockTimestamp = _blockTimestamp;
            _exchangeData.repPriceAccumulated = _repPriceCumulative;
            return _exchangeData;
        }

        uint256 _blocksElapsed = _blockNumber - _exchangeData.blockNumber;

        uint256 _price = (_repPriceCumulative - _exchangeData.repPriceAccumulated) * 10**18 / _blocksElapsed / Q112;
        require(_price > 0, "Price should not be 0");

        uint256 _secondsElapsed = _blockTimestamp - _exchangeData.blockTimestamp;
        uint256 _priceAverage = _price;

        if (_secondsElapsed < period) {
            _priceAverage = (_exchangeData.price * (period - _secondsElapsed) + _price * _secondsElapsed) / period;
        }

        _exchangeData.blockNumber = _blockNumber;
        _exchangeData.blockTimestamp = _blockTimestamp;
        _exchangeData.repPriceAccumulated = _repPriceCumulative;
        _exchangeData.price = _priceAverage;
        return _exchangeData;
    }

    function initializeUniverse(IV2ReputationToken _reputationToken) private {
        uint256 _blockNumber = block.number;
        IUniswapV2 _exchange = getOrCreateUniswapExchange(_reputationToken);
        exchangeData[address(_reputationToken)].exchange = _exchange;
        if (_blockNumber != _exchange.blockNumberLast()) {
            _exchange.sync();
        }
        uint256 _initialPrice = getInitialPrice(_reputationToken);
        exchangeData[address(_reputationToken)].price = _initialPrice;
        exchangeData[address(_reputationToken)].blockNumber = _blockNumber;
        exchangeData[address(_reputationToken)].blockTimestamp = block.timestamp; // solium-disable-line security/no-block-members
        (address token0, address token1) = uniswapFactory.sortTokens(cash, address(_reputationToken));
        bool repIsToken0 = token0 == address(_reputationToken);
        exchangeData[address(_reputationToken)].repIsToken0 = repIsToken0;
        exchangeData[address(_reputationToken)].repPriceAccumulated = repIsToken0 ? _exchange.price0CumulativeLast() : _exchange.price1CumulativeLast();
    }

    function getInitialPrice(IV2ReputationToken _reputationToken) private view returns (uint256) {
        IUniverse _parentUniverse = _reputationToken.getUniverse().getParentUniverse();
        if (_parentUniverse != IUniverse(0)) {
            IV2ReputationToken _parentReputationToken = _parentUniverse.getReputationToken();
            return exchangeData[address(_parentReputationToken)].price;
        }
        return genesisInitialRepPriceinAttoCash;
    }

    function getOrCreateUniswapExchange(IV2ReputationToken _reputationToken) public returns (IUniswapV2) {
        address _exchangeAddress = uniswapFactory.getExchange(cash, address(_reputationToken));
        if (_exchangeAddress == address(0)) {
            _exchangeAddress = uniswapFactory.createExchange(cash, address(_reputationToken));
        }
        return IUniswapV2(_exchangeAddress);
    }
}
