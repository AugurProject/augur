pragma solidity 0.5.15;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';


contract OINexus is Ownable {
    using SafeMathUint256 for uint256;
    
    mapping(address => bool) public registeredParaAugur;
    mapping(address => uint256) public numParaUniverses;
    mapping(address => bool) public knownParaUniverse;
    mapping(address => uint256) public paraUniversePreviousContribution;
    mapping(address => uint256) public totalUniverseContributions;
    mapping(address => uint256) public universeReportingFeeDivisor;

    function addParaAugur(IParaAugur _paraAugur) public onlyOwner returns (bool) {
        registeredParaAugur[address(_paraAugur)] = true;
        return true;
    }

    function registerParaUniverse(IUniverse _universe, IParaUniverse _paraUniverse) public {
        require(registeredParaAugur[msg.sender]);
        numParaUniverses[address(_universe)] += 1;
        knownParaUniverse[address(_paraUniverse)] = true;
    }

    function recordParaUniverseValuesAndUpdateReportingFee(IUniverse _universe, uint256 _targetRepMarketCapInAttoCash, uint256 _repMarketCapInAttoCash) public returns (uint256) {
        require(knownParaUniverse[msg.sender]);
        uint256 _reportingFeeDivisor = universeReportingFeeDivisor[address(_universe)];
        if (_reportingFeeDivisor == 0) {
            _reportingFeeDivisor = Reporting.getDefaultReportingFeeDivisor();
        }
        
        // Derive a new total para universe factor by subtracting this ones old value then adding its new value
        uint256 _magnifiedReportingDivisorFactorContribution = _targetRepMarketCapInAttoCash.mul(10**18).div(_repMarketCapInAttoCash);
        uint256 _totalMagnifiedUniverseContributions = totalUniverseContributions[address(_universe)];
        uint256 _paraUniversePreviousContribution = paraUniversePreviousContribution[address(msg.sender)];
        _totalMagnifiedUniverseContributions = _totalMagnifiedUniverseContributions.sub(_paraUniversePreviousContribution);
        _totalMagnifiedUniverseContributions = _totalMagnifiedUniverseContributions.add(_magnifiedReportingDivisorFactorContribution);
        totalUniverseContributions[address(_universe)] = _totalMagnifiedUniverseContributions;
        paraUniversePreviousContribution[address(msg.sender)] = _magnifiedReportingDivisorFactorContribution;

        if (_totalMagnifiedUniverseContributions == 0) {
            _reportingFeeDivisor = Reporting.getDefaultReportingFeeDivisor();
        } else {
            _reportingFeeDivisor = _reportingFeeDivisor.mul(10**18).div(_totalMagnifiedUniverseContributions);
        }

        _reportingFeeDivisor = _reportingFeeDivisor
            .max(Reporting.getMinimumReportingFeeDivisor())
            .min(Reporting.getMaximumReportingFeeDivisor());

        universeReportingFeeDivisor[address(_universe)] = _reportingFeeDivisor;
        return _reportingFeeDivisor;
    }

    function onTransferOwnership(address, address) internal {}
}