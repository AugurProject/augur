pragma solidity 0.5.10;

import "ROOT/reporting/IV2ReputationToken.sol";


contract IRepPriceOracle {
    function pokeRepPriceInAttoCash(IV2ReputationToken _reputationToken) external returns (uint256);
    function getRepPriceInAttoCash(IV2ReputationToken _reputationToken) external view returns (uint256);
}
