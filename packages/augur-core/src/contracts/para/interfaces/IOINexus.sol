pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/reporting/IUniverse.sol';


contract IOINexus {
    function registerParaUniverse(IUniverse _universe, IParaUniverse _paraUniverse) public;
    function recordParaUniverseValuesAndUpdateReportingFee(IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash) public returns (uint256);
}