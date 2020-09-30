pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/reporting/IUniverse.sol';


contract IOINexus {
    function addParaAugur(address _paraAugur) external returns (bool);
    function registerParaUniverse(IUniverse _universe, IParaUniverse _paraUniverse) external;
    function recordParaUniverseValuesAndUpdateReportingFee(IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash) external returns (uint256);
}
