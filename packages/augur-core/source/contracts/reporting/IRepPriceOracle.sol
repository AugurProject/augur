pragma solidity 0.5.10;


// TODO: When the Uniswap price oracle is available change this signature to match. Will need to accept a REP token as an argument
contract IRepPriceOracle {
    function getRepPriceInAttoCash() external view returns (uint256);
}
