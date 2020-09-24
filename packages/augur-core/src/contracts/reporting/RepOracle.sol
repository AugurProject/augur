pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';
import 'ROOT/trading/IAugurTrading.sol';
import 'ROOT/uniswap/libraries/UQ112x112.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract RepOracle is Initializable {
    using SafeMathUint256 for uint256;
    using UQ112x112 for uint224;

    struct RepData {
        uint256 lastUpdateTimestamp;
        uint256 priceCumulativeLast;
        uint256 price;
        bool token0IsCash;
    }

    mapping(address => RepData) repData;

    uint256 constant public PERIOD = 3 days;

    uint256 constant public genesisInitialRepPriceinAttoCash = 23 * 10**18;

    address public augur;
    address public cash;
    IUniswapV2Factory public uniswapFactory;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = address(_augur);
        cash = _augur.lookup("Cash");
        uniswapFactory = IUniswapV2Factory(_augur.lookup("UniswapV2Factory"));
    }

    function poke(address _reputationToken) external returns (uint256) {
        IUniswapV2Pair _exchange = getExchange(_reputationToken);
        uint256 _blockTimestamp = block.timestamp;
        // If we've never updated this rep data before initialize it and return
        if (repData[_reputationToken].price == 0) {
            uint256 _initialPrice = getInitialPrice(_reputationToken);
            repData[_reputationToken].price = _initialPrice;
            repData[_reputationToken].token0IsCash = _exchange.token0() == address(cash);
            repData[_reputationToken].lastUpdateTimestamp = _blockTimestamp;
            return _initialPrice;
        }
        RepData memory _repData = repData[_reputationToken];
        // Early return if we've already updated in this block
        if (_repData.lastUpdateTimestamp == _blockTimestamp) {
            return _repData.price;
        }
        uint256 _timeElapsed = _blockTimestamp.sub(_repData.lastUpdateTimestamp);
        bool _token0IsCash = repData[_reputationToken].token0IsCash;

        uint256 _priceCumulative = _token0IsCash ? _exchange.price1CumulativeLast() : _exchange.price0CumulativeLast();

        // Edge case where we update multiple times before there is a value on the exchange
        if (_priceCumulative == 0) {
            _priceCumulative = repData[_reputationToken].priceCumulativeLast;
        }

        // if time has elapsed since the last update, mock the accumulated price values
        {
            (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = _exchange.getReserves();
            // If there is no liquidity we don't need to do anything since there is no uncalculated value to add for this time slice
            bool _canMock = _reserve0 != 0 && _reserve1 != 0;

            if (_blockTimestampLast != _blockTimestamp && _canMock) {
                _priceCumulative += uint256(UQ112x112.encode(_token0IsCash ? _reserve0 : _reserve1).uqdiv(_token0IsCash ? _reserve1 : _reserve0)) * _timeElapsed;
            }
        }

        // underflow desired, casting never truncates
        uint256 _price = (_priceCumulative - repData[_reputationToken].priceCumulativeLast) / _timeElapsed;
        _price = UQ112x112.decode(_price * 10**18);

        if (_timeElapsed < PERIOD) {
            _price = repData[_reputationToken].price.mul(PERIOD.sub(_timeElapsed)).add(_price.mul(_timeElapsed)) / PERIOD;
        }

        repData[_reputationToken].price = _price;
        repData[_reputationToken].priceCumulativeLast = _priceCumulative;
        repData[_reputationToken].lastUpdateTimestamp = _blockTimestamp;
        return _price;
    }

    function getExchange(address _reputationToken) public returns (IUniswapV2Pair) {
        address _exchangeAddress = uniswapFactory.getPair(_reputationToken, address(cash));
        if (_exchangeAddress == address(0)) {
            _exchangeAddress = uniswapFactory.createPair(_reputationToken, address(cash));
        }
        return IUniswapV2Pair(_exchangeAddress);
    }

    function getInitialPrice(address _reputationToken) private view returns (uint256) {
        IUniverse _parentUniverse = IUniverse(IReputationToken(_reputationToken).getUniverse().getParentUniverse());
        if (_parentUniverse == IUniverse(0)) {
            return genesisInitialRepPriceinAttoCash;
        } else {
            return repData[address(_parentUniverse.getReputationToken())].price;
        }
    }

    function getLastUpdateTimestamp(address _reputationToken) external view returns (uint256) {
        return repData[_reputationToken].lastUpdateTimestamp;
    }

    function getPriceCumulativeLast(address _reputationToken) external view returns (uint256) {
        return repData[_reputationToken].priceCumulativeLast;
    }

    function getPrice(address _reputationToken) external view returns (uint256) {
        return repData[_reputationToken].price;
    }
}