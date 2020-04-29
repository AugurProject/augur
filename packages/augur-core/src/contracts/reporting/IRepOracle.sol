pragma solidity 0.5.15;


interface IRepOracle {
    function getLastUpdateTimestamp(address _reputationToken) external view returns (uint256);
    function poke(address _reputationTokenAddress) external returns (uint256);
}