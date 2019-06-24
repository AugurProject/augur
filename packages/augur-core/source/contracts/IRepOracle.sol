pragma solidity 0.5.4;


// TODO when the Uniswap oracle is available modify this. It will need to take a specific REP token as an argument to accomodate forks
contract IRepOracle {
    function getRepPriceInAttoCash() external view returns (uint256);
}
