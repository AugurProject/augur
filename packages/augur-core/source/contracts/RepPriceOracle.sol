pragma solidity 0.5.4;

import 'ROOT/reporting/IRepPriceOracle.sol';


// A test REP price oracle
contract RepPriceOracle is IRepPriceOracle {
    uint256 public repPriceinAttoCash = 20 * 10**18;

    function setRepPriceInAttoCash(uint256 _repPriceinAttoCash) external returns (bool) {
        repPriceinAttoCash = _repPriceinAttoCash;
        return true;
    }

    function getRepPriceInAttoCash() external view returns (uint256) {
        return repPriceinAttoCash;
    }
}
