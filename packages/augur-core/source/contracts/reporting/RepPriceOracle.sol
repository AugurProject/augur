pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/reporting/IRepPriceOracle.sol';


contract RepPriceOracle is IRepPriceOracle, Initializable {

    uint256 constant Q112 = 2**112;

    IAugur public augur;
    address public cash;
    uint256 public period = 1 days;
    IUniswapV2Factory public uniswapFactory;

    struct ExchangeData {
        IUniswapV2 exchange;
        uint256 repPriceAccumulated;
        uint256 blockNumber;
        uint256 blockTimestamp;
        uint256 price;
        bool repIsToken0;
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
        uint256 _initialPrice = genesisInitialRepPriceinAttoCash;
        if (_parentUniverse != IUniverse(0)) {
            IV2ReputationToken _parentReputationToken = _parentUniverse.getReputationToken();
            _initialPrice = exchangeData[address(_parentReputationToken)].price;
        }
        return _initialPrice;
    }

    function getOrCreateUniswapExchange(IV2ReputationToken _reputationToken) public returns (IUniswapV2) {
        address _exchangeAddress = uniswapFactory.getExchange(cash, address(_reputationToken));
        if (_exchangeAddress == address(0)) {
            _exchangeAddress = uniswapFactory.createExchange(cash, address(_reputationToken));
        }
        return IUniswapV2(_exchangeAddress);
    }
}
