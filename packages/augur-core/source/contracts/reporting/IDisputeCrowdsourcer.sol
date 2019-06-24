pragma solidity 0.5.4;

import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/IAugur.sol';


contract IDisputeCrowdsourcer is IReportingParticipant, IERC20 {
    function initialize(IAugur _augur, IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, address _erc1820RegistryAddress) public returns (bool);
    function contribute(address _participant, uint256 _amount, bool _overload) public returns (uint256);
    function setSize(uint256 _size) public returns (bool);
    function getRemainingToFill() public view returns (uint256);
    function correctSize() public returns (bool);
}
