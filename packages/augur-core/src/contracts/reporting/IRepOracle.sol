pragma solidity 0.5.15;

import 'ROOT/IAugur.sol';


interface IRepOracle {
    function initialize(IAugur _augur) external;
    function getLastUpdateTimestamp(address _reputationToken) external view returns (uint256);
    function poke(address _reputationTokenAddress) external returns (uint256);
}