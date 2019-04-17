pragma solidity 0.5.4;


import 'ROOT/libraries/ITyped.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/ERC20Token.sol';


contract IDisputeWindow is ITyped, ERC20Token {
    function initialize(IAugur _augur, IUniverse _universe, uint256 _disputeWindowId, uint256 _duration, uint256 _startTime, address _erc820RegistryAddress) public returns (bool);
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
