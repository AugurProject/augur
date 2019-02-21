pragma solidity 0.5.4;


import 'libraries/ITyped.sol';
import 'reporting/IUniverse.sol';
import 'reporting/IMarket.sol';
import 'reporting/IReputationToken.sol';
import 'trading/ICash.sol';
import 'IAugur.sol';


contract IDisputeWindow is ITyped {
    function initialize(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _duration) public returns (bool);
    function getUniverse() public view returns (IUniverse);
    function getReputationToken() public view returns (IReputationToken);
    function getStartTime() public view returns (uint256);
    function getEndTime() public view returns (uint256);
    function getNumMarkets() public view returns (uint256);
    function getNumInvalidMarkets() public view returns (uint256);
    function getNumIncorrectDesignatedReportMarkets() public view returns (uint256);
    function getNumDesignatedReportNoShows() public view returns (uint256);
    function getWindowId() public view returns (uint256);
    function isActive() public view returns (bool);
    function isOver() public view returns (bool);
    function onMarketFinalized() public returns (bool);
}
