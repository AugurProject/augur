pragma solidity 0.5.15;

import "ROOT/reporting/IV2ReputationToken.sol";


contract IRepPriceOracle {
    function pokeRepPriceInAttoCash(IV2ReputationToken _reputationToken) external returns (uint256);
}
