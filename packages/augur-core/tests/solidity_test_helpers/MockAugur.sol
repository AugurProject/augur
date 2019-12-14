pragma solidity 0.5.10;


import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/reporting/IUniverse.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/reporting/IReputationToken.sol';
import 'ROOT/reporting/IShareToken.sol';
import 'ROOT/trading/Order.sol';


// AUDIT/CONSIDER: Is it better that this contract provide generic functions that are limited to whitelisted callers or for it to have many specific functions which have more limited and specific validation?
contract MockAugur {

    function reset() public {
        logMarketCreatedCalledValue = false;
        logReportsDisputedCalledValue = false;
        logUniverseForkedCalledValue = false;
        logReputationTokensTransferredCalledValue = false;
        logMarketFinalizedCalledValue = false;
    }

    function trustedCashTransfer(IERC20 _token, address _from, address _to, uint256 _amount) public returns (bool) {
        return true;
    }

    //
    // Logging
    //
    bool private logMarketCreatedCalledValue;

    function logMarketCreatedCalled() public returns(bool) {return logMarketCreatedCalledValue;}

    function logMarketCreated(uint256 _endTime, string memory _extraInfo, IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] memory _prices, IMarket.MarketType _marketType, bytes32[] memory _outcomes) public returns (bool) {
        logMarketCreatedCalledValue = true;
        return true;
    }

    function logMarketCreated(uint256 _endTime, string memory _extraInfo, IMarket _market, address _marketCreator, address _designatedReporter, uint256 _feeDivisor, int256[] memory _prices, IMarket.MarketType _marketType, uint256 _numTicks) public returns (bool) {
        logMarketCreatedCalledValue = true;
        return true;
    }

    function logDesignatedReportSubmitted(IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, uint256[] _payoutNumerators) public returns (bool) {
        return true;
    }

    function logReportSubmitted(IUniverse _universe, address _reporter, address _market, address _reportingParticipant, uint256 _amountStaked, uint256[] _payoutNumerators) public returns (bool) {
        return true;
    }

    function logReportingParticipantDisavowed(IUniverse _universe, IMarket _market) public returns (bool) {
        return true;
    }

    function logMarketParticipantsDisavowed(IUniverse _universe) public returns (bool) {
        return true;
    }

    function logInitialReporterRedeemed(IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256 _reportingFeesReceived, uint256[] _payoutNumerators) public returns (bool) {
        return true;
    }

    function logDisputeCrowdsourcerRedeemed(IUniverse _universe, address _reporter, address _market, uint256 _amountRedeemed, uint256 _repReceived, uint256 _reportingFeesReceived, uint256[] _payoutNumerators) public returns (bool) {
        return true;
    }

    function logDisputeWindowRedeemed(IUniverse _universe, address _reporter, uint256 _amountRedeemed, uint256 _reportingFeesReceived) public returns (bool) {
        return true;
    }

    function logInitialReporterTransferred(IUniverse _universe, IMarket _market, address _from, address _to) public returns (bool) {
        return true;
    }

    bool private logReportsDisputedCalledValue;

    function logReportsDisputedCalled() public returns(bool) { return logReportsDisputedCalledValue; }

    function logReportsDisputed(IUniverse _universe, address _disputer, address _market, uint256 _disputeBondAmount) public returns (bool) {
        logReportsDisputedCalledValue = true;
        return true;
    }

    function logMarketFinalizedCalled() public returns (bool) { return logMarketFinalizedCalledValue; }

    bool private logMarketFinalizedCalledValue;

    function logMarketFinalized(IUniverse _universe) public returns (bool) {
        logMarketFinalizedCalledValue = true;
        return true;
    }

    function logMarketMigrated(IMarket _market, IUniverse _originalUniverse) public returns (bool) {
        return true;
    }

    function logOrderCanceled(IUniverse _universe, address _shareToken, address _sender, IMarket _market, bytes32 _orderId, Order.Types _orderType, uint256 _tokenRefund, uint256 _sharesRefund) public returns (bool) {
        return true;
    }

    function disputeCrowdsourcerCreated(IUniverse _universe, IMarket _market, IDisputeCrowdsourcer _crowdsourcer, uint256[] _payoutNumerators, uint256 _size) public returns (bool) {
        return true;
    }

    function logOrderCreated(Order.Types _orderType, uint256 _amount, uint256 _price, address _sender, uint256 _tradeGroupId, uint256 _sharesEscrowed, bytes32 _tradeGroupId, bytes32 _orderId, IUniverse _universe, IMarket _market, IERC20 _kycToken, uint256 _outcome) public returns (bool) {
        return true;
    }

    function logOrderFilled(IUniverse _universe, address _shareToken, address _filler, bytes32 _orderId, uint256 _numCreatorShares, uint256 _numCreatorTokens, uint256 _numFillerShares, uint256 _numFillerTokens, uint256 _fees, uint256 _amountFilled, bytes32 _tradeGroupId, bool _orderIsCompletelyFilled) public returns (bool) {
        return true;
    }

    function logCompleteSetsPurchased(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) public returns (bool) {
        return true;
    }

    function logCompleteSetsSold(IUniverse _universe, IMarket _market, address _account, uint256 _numCompleteSets) public returns (bool) {
        return true;
    }

    function logProceedsClaimed(IUniverse _universe, address _shareToken, address _sender, address _market, uint256 _numShares, uint256 _numPayoutTokens, uint256 _finalTokenBalance) public returns (bool) {
        return true;
    }

    function logReputationTokensBurned(IUniverse _universe, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function logReputationTokensMinted(IUniverse _universe, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function logShareTokensBurned(IUniverse _universe, IMarket _market, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function logShareTokensMinted(IUniverse _universe, IMarket _market, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function logDisputeWindowBurned(IUniverse _universe, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function logDisputeWindowMinted(IUniverse _universe, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    bool private logUniverseForkedCalledValue;

    function logUniverseForkedCalled() public returns (bool) { return logUniverseForkedCalledValue; }

    function logUniverseForked() public returns (bool) {
        logUniverseForkedCalledValue = true;
        return true;
    }

    bool private logUniverseCreatedCalledValue;

    function logUniverseCreatedCalled() public returns(bool) { return logUniverseCreatedCalledValue;}

    function logUniverseCreated(IUniverse _childUniverse, uint256[] _payoutNumerators) public returns (bool) {
        logUniverseCreatedCalledValue = true;
        return true;
    }

    function logDisputeWindowsTransferred(IUniverse _universe, address _from, address _to, uint256 _value) public returns (bool) {
        return true;
    }

    bool private logReputationTokensTransferredCalledValue;

    function logReputationTokensTransferredCalled() public returns(bool) { return logReputationTokensTransferredCalledValue;}

    function logReputationTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value) public returns (bool) {
        logReputationTokensTransferredCalledValue = true;
        return true;
    }

    function logShareTokensTransferred(IUniverse _universe, IMarket _market, address _from, address _to, uint256 _value) public returns (bool) {
        return true;
    }

    function logDisputeWindowCreated(IDisputeWindow _disputeWindow, uint256 _id) public returns (bool) {
        return true;
    }

    function logInitialReportSubmitted(IUniverse _universe, address _reporter, address _market, uint256 _amountStaked, bool _isDesignatedReporter, uint256[] _payoutNumerators, string description) public returns (bool) {
        return true;
    }

    function disputeCrowdsourcerCreated(IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256[] _payoutNumerators, uint256 _size) public returns (bool) {
        return true;
    }

    function logDisputeCrowdsourcerContribution(IUniverse _universe, address _reporter, address _market, address _disputeCrowdsourcer, uint256 _amountStaked, string memory _description) public returns (bool) {
        return true;
    }

    function logDisputeCrowdsourcerCompleted(IUniverse _universe, address _market, address _disputeCrowdsourcer, uint256 _nextWindowStartTime, bool _pacingOn) public returns (bool) {
        return true;
    }

    function logTimestampSet(uint256 _newTimestamp) public returns (bool) {
        return true;
    }

    function logMarketTransferred(IUniverse _universe, address _from, address _to) public returns (bool) {
        return true;
    }

    function logAuctionTokensTransferred(IUniverse _universe, address _from, address _to, uint256 _value) public returns (bool) {
        return true;
    }

    function logAuctionTokensBurned(IUniverse _universe, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function logAuctionTokensMinted(IUniverse _universe, address _target, uint256 _amount) public returns (bool) {
        return true;
    }

    function recordAuctionTokens() public returns (bool) {
        return true;
    }

    function lookup(bytes32 _key) public view returns (address) {
        return 0;
    }

    function getTimestamp() public view returns (uint256) {
        return 0;
    }
}
