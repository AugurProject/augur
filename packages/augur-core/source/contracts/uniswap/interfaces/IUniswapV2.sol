pragma solidity 0.5.10;


interface IUniswapV2 {
    function getReservesCumulative() external view returns (uint256, uint256);
}