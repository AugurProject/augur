pragma solidity 0.5.4;

import 'IAugur.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IMarket.sol';


contract IMarketFactory {
    function createMarket(IAugur _augur, IUniverse _universe, uint256 _endTime, uint256 _feePerEthInWei, uint256 _affiliateFeeDivisor, address _designatedReporterAddress, address _sender, uint256 _numOutcomes, uint256 _numTicks) public returns (IMarket _market);
}
