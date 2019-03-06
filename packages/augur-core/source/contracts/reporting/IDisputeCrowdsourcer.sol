pragma solidity 0.5.4;

import 'ROOT/reporting/IReportingParticipant.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/IDisputeOverloadToken.sol';
import 'ROOT/libraries/token/ERC20Token.sol';
import 'ROOT/IAugur.sol';


contract IDisputeCrowdsourcer is IReportingParticipant, ERC20Token {
    function initialize(IAugur _augur, IMarket market, uint256 _size, bytes32 _payoutDistributionHash, uint256[] memory _payoutNumerators, IDisputeOverloadToken _disputeOverloadToken, address _erc820RegistryAddress) public returns (bool);
    function contribute(address _participant, uint256 _amount, bool _overload) public returns (uint256);
    function setSize(uint256 _size) public returns (bool);
    function getRemainingToFill() public view returns (uint256);
    function getDisputeOverloadToken() public returns (IDisputeOverloadToken);
    function correctSize() public returns (bool);
}
