pragma solidity 0.5.10;

import "ROOT/uniswap/interfaces/IUniswapV2Factory.sol";
import "ROOT/uniswap/UniswapV2.sol";


// Mock Uniswap V2 Factory contract for initial testing and early implementation of our Oracle
contract UniswapV2Factory is IUniswapV2Factory {

    struct Pair {
        address token0;
        address token1;
    }

    mapping (address => Pair) private exchangeToPair;
    mapping (address => mapping(address => address)) private tokensToExchange;

    constructor(bytes memory, uint256) public {}

    function getPair(address _tokenA, address _tokenB) private pure returns (Pair memory) {
        return _tokenA < _tokenB ? Pair({ token0: _tokenA, token1: _tokenB }) : Pair({ token0: _tokenB, token1: _tokenA });
    }

    function getExchange(address _tokenA, address _tokenB) external view returns (address) {
        Pair memory _pair = getPair(_tokenA, _tokenB);
        return tokensToExchange[_pair.token0][_pair.token1];
    }

    function createExchange(address _tokenA, address _tokenB) external returns (address) {
        Pair memory _pair = getPair(_tokenA, _tokenB);

        UniswapV2 _exchange = new UniswapV2();
        exchangeToPair[address(_exchange)] = _pair;
        tokensToExchange[_pair.token0][_pair.token1] = address(_exchange);
        return address(_exchange);
    }
}