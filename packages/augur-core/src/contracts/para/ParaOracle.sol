pragma solidity 0.5.15;

import 'ROOT/uniswap/libraries/UQ112x112.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Factory.sol';
import 'ROOT/uniswap/interfaces/IUniswapV2Pair.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/token/IERC20.sol';


contract ParaOracle {
    using SafeMathUint256 for uint256;
    using UQ112x112 for uint224;

    struct TokenData {
        uint256 lastUpdateTimestamp;
        uint256 priceCumulativeLast;
        uint256 price;
        bool token0IsWeth;
        uint256 precision;
    }

    mapping(address => TokenData) public tokenData;

    uint256 constant public PERIOD = 3 days;

    address public weth;
    IUniswapV2Factory public uniswapFactory;

    constructor (address _weth, address _uniswapFactory) public {
        weth = _weth;
        uniswapFactory = IUniswapV2Factory(_uniswapFactory);
        require(_weth != address(0));
        require(_uniswapFactory != address(0));
    }

    function poke(address _token) external returns (uint256) {
        if (_token == weth) {
            return 10**18;
        }
        IUniswapV2Pair _exchange = getExchange(_token);
        uint256 _blockTimestamp = block.timestamp;
        // If we've never updated this rep data before initialize it and return
        if (tokenData[_token].price == 0) {
            uint256 _initialPrice = getInitialPrice(_token);
            tokenData[_token].price = _initialPrice;
            tokenData[_token].lastUpdateTimestamp = _blockTimestamp;
            return _initialPrice;
        }
        TokenData memory _tokenData = tokenData[_token];
        // Early return if we've already updated in this block
        if (_tokenData.lastUpdateTimestamp == _blockTimestamp) {
            return _tokenData.price;
        }
        uint256 _timeElapsed = _blockTimestamp.sub(_tokenData.lastUpdateTimestamp);
        bool _token0IsWeth = tokenData[_token].token0IsWeth;

        uint256 _priceCumulative = _token0IsWeth ? _exchange.price1CumulativeLast() : _exchange.price0CumulativeLast();

        // Edge case where we update multiple times before there is a value on the exchange
        if (_priceCumulative == 0) {
            _priceCumulative = tokenData[_token].priceCumulativeLast;
        }

        // if time has elapsed since the last update, mock the accumulated price values
        {
            (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = _exchange.getReserves();
            // If there is no liquidity we don't need to do anything since there is no uncalculated value to add for this time slice
            bool _canMock = _reserve0 != 0 && _reserve1 != 0;

            if (_blockTimestampLast != _blockTimestamp && _canMock) {
                _priceCumulative += uint256(UQ112x112.encode(_token0IsWeth ? _reserve0 : _reserve1).uqdiv(_token0IsWeth ? _reserve1 : _reserve0)) * (_blockTimestamp.sub(_blockTimestampLast));
            }
        }

        // underflow desired, casting never truncates
        uint256 _price = (_priceCumulative - tokenData[_token].priceCumulativeLast) / _timeElapsed;
        _price = UQ112x112.decode(_price * tokenData[_token].precision);

        if (_timeElapsed < PERIOD) {
            _price = tokenData[_token].price.mul(PERIOD.sub(_timeElapsed)).add(_price.mul(_timeElapsed)) / PERIOD;
        }

        tokenData[_token].price = _price;
        tokenData[_token].priceCumulativeLast = _priceCumulative;
        tokenData[_token].lastUpdateTimestamp = _blockTimestamp;
        return _price;
    }

    function getExchange(address _token) public returns (IUniswapV2Pair) {
        address _exchangeAddress = uniswapFactory.getPair(_token, address(weth));
        if (_exchangeAddress == address(0)) {
            _exchangeAddress = uniswapFactory.createPair(_token, address(weth));
        }
        return IUniswapV2Pair(_exchangeAddress);
    }

    function getInitialPrice(address _token) private returns (uint256) {
        IUniswapV2Pair _exchange = getExchange(_token);
        (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast) = _exchange.getReserves();
        bool _token0IsWeth = _exchange.token0() == address(weth);
        uint256 _decimals = IERC20(_token).decimals();
        uint256 _precision  = 10 ** _decimals;
        tokenData[_token].token0IsWeth = _token0IsWeth;
        tokenData[_token].precision = _precision;
        if (_reserve0 == 0 || _reserve1 == 0) {
            return 0;
        }
        return _token0IsWeth ? (_reserve0 * _precision / _reserve1) : (_reserve1 * _precision / _reserve0);
    }

    function getLastUpdateTimestamp(address _token) external view returns (uint256) {
        return tokenData[_token].lastUpdateTimestamp;
    }

    function getPriceCumulativeLast(address _token) external view returns (uint256) {
        return tokenData[_token].priceCumulativeLast;
    }

    function getPrice(address _token) external view returns (uint256) {
        return tokenData[_token].price;
    }
}