pragma solidity 0.5.10;


import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/IERC1155.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/reporting/IUniverse.sol';


contract IShareToken is ITyped, IERC1155 {
    function initialize(IAugur _augur) external;
    function initializeMarket(IMarket _market, uint256 _numOutcomes, uint256 _numTicks) public;
    function getMarket(uint256 _tokenId) external view returns (IMarket);
    function getOutcome(uint256 _tokenId) external view returns (uint256);
    function buyCompleteSets(IMarket _market, address _account, uint256 _amount) external returns (bool);
    function buyCompleteSetsForTrade(IMarket _market, uint256 _amount, uint256 _longOutcome, address _longRecipient, address _shortRecipient) external returns (bool);
    function sellCompleteSets(IMarket _market, address _holder, address _recipient, uint256 _amount, address _affiliateAddress) external returns (uint256 _creatorFee, uint256 _reportingFee);
    function sellCompleteSetsForTrade(IMarket _market, uint256 _outcome, uint256 _amount, address _shortParticipant, address _longParticipant, address _shortRecipient, address _longRecipient, uint256 _price, address _affiliateAddress) external returns (uint256 _creatorFee, uint256 _reportingFee);
    function totalSupplyForMarketOutcome(IMarket _market, uint256 _outcome) public view returns (uint256);
    function balanceOfMarketOutcome(IMarket _market, uint256 _outcome, address _account) public view returns (uint256);
    function lowestBalanceOfMarketOutcomes(IMarket _market, uint256[] memory _outcomes, address _account) public view returns (uint256);
    function trustedOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedFillOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedFillOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCancelOrderTransfer(IMarket _market, uint256 _outcome, address _source, address _destination, uint256 _attotokens) public returns (bool);
    function trustedCancelOrderBatchTransfer(IMarket _market, uint256[] memory _outcomes, address _source, address _destination, uint256 _attotokens) public returns (bool);
}
