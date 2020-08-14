pragma solidity 0.5.15;

import 'ROOT/reporting/RepOracle.sol';


contract ParaRepOracle is RepOracle {
    uint256 constant public genesisInitialRepPriceinAttoCash = 5 * 10**16;

    function getInitialPrice(address _reputationToken) private view returns (uint256) {
        IUniverse _parentUniverse = IUniverse(IReputationToken(_reputationToken).getUniverse().getParentUniverse());
        if (_parentUniverse == IUniverse(0)) {
            return genesisInitialRepPriceinAttoCash;
        } else {
            return repData[address(_parentUniverse.getReputationToken())].price;
        }
    }
}