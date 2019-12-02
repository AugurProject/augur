pragma solidity 0.5.10;


interface IUniswapV2Factory {
    function getExchange(address tokenA, address tokenB) external view returns (address);
    function createExchange(address tokenA, address tokenB) external returns (address exchange);
}