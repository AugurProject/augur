pragma solidity 0.5.10;


import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';


contract IShareToken is ITyped, IERC1155 {
    function initialize(IAugur _augur) external;
    function initializeMarket(IMarket _market, uint256 _numOutcomes) public;
    function createSet(IMarket _market, address _owner, uint256 _amount) external returns (bool);
    function destroySet(IMarket _market, address _owner, uint256 _amount) external returns (bool);
    function destroyShares(IMarket _market, uint256 _outcome, address _owner, uint256 _amount) external returns (bool);
    function getMarket(uint256 _tokenId) external view returns (IMarket);
    function getOutcome(uint256 _tokenId) external view returns (uint256);
    function totalSupplyForMarketOutcome(IMarket _market, uint256 _outcome) public view returns (uint256);
    function balanceOfMarketOutcome(IMarket _market, uint256 _outcome, address _account) public view returns (uint256);
    function lowestBalanceOfMarketOutcomes(IMarket _market, uint256[] memory _outcomes, address _account) public view returns (uint256);
    function trustedOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedFillOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedFillOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCancelOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCancelOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCompleteSetTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
}
