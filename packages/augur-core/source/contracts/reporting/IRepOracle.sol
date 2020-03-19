pragma solidity 0.5.15;


interface IRepOracle {
    function poke(address _reputationTokenAddress) external returns (uint256);
}