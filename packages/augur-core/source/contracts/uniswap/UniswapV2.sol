pragma solidity 0.5.10;

import "ROOT/uniswap/interfaces/IUniswapV2.sol";


// Mock Uniswap V2 contract for initial testing and early implementation of our Oracle
contract UniswapV2 is IUniswapV2 {
    uint256 public reservesCumulativeToken0;
    uint256 public reservesCumulativeToken1;

    // For use in testing
    function setReservesCumulative(uint256 _reservesCumulativeToken0, uint256 _reservesCumulativeToken1) external {
        reservesCumulativeToken0 = _reservesCumulativeToken0;
        reservesCumulativeToken1 = _reservesCumulativeToken1;
    }

    function getReservesCumulative() external view returns (uint256 _token0, uint256 _token1) {
        return (reservesCumulativeToken0, reservesCumulativeToken1);
    }

    function mintLiquidity(address _recipient) external returns (uint256 liquidity) {}

    function swap(address, address) external returns (uint256) {}
}