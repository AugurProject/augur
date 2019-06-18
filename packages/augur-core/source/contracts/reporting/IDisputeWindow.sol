pragma solidity 0.5.4;


import 'ROOT/libraries/ITyped.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/IERC20.sol';


contract IDisputeWindow is ITyped, IERC20 {
    uint256 public invalidMarketsTotal;
    uint256 public validityBondTotal;

    uint256 public incorrectDesignatedReportTotal;
    uint256 public initialReportBondTotal;

    uint256 public designatedReportNoShowsTotal;
    uint256 public designatedReporterNoShowBondTotal;

    function initialize(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc1820RegistryAddress) public returns (bool);
    function getUniverse() public view returns (IUniverse);
    function getReputationToken() public view returns (IReputationToken);
    function getStartTime() public view returns (uint256);
    function getEndTime() public view returns (uint256);
    function getWindowId() public view returns (uint256);
    function isActive() public view returns (bool);
    function isOver() public view returns (bool);
    function onMarketFinalized() public returns (bool);
    function redeem(address _account) public returns (bool);
}
