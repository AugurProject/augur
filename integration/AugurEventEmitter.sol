pragma solidity ^0.4.13;

// This simple contract converts function calls to events to allow
// basic integration testing of Augur-node functionality

contract AugurEventEmitter {

    enum ReportingPhase {
        DesignatedReporter, LimitedReporters, AllReporters
    }

    // misc events
    event TokensTransferred(address indexed token, address indexed from, address indexed to, uint256 value);
    // reporting events
    event MarketCreated(address indexed market, address indexed marketCreator, uint256 marketCreationFee, string extraInfo);
    event ReporterRegistered(address indexed reporter, address indexed reportingWindow);
    event DesignatedReportSubmitted(address indexed designatedReporter, address indexed market, uint256[] payoutNumerators);
    event ReportSubmitted(address indexed reporter, address indexed market, address reportingToken, uint256 amountStaked, uint256[] payoutNumerators);
    event WinningTokensRedeemed(address indexed reporter, address indexed market, address reportingToken, uint256 amountRedeemed, address reportingFeesReceived, uint256[] payoutNumerators);
    event ReportsDisputed(address indexed disputer, address indexed market, ReportingPhase reportingPhase, uint256 disputeBondAmount);
    event MarketFinalized(address indexed market);
    event UniverseForked(address indexed universe);
    // trading events
    event OrderCanceled(address indexed market, address indexed sender, uint8 outcome, bytes32 orderId, uint8 orderType, uint256 tokenRefund, uint256 sharesRefund);
    event OrderCreated(address indexed shareToken, address indexed creator, bytes32 indexed orderId, int256 price, uint256 amount, uint256 numTokensEscrowed, uint256 numSharesEscrowed, bytes32 tradeGroupId);
    event OrderFilled(address indexed shareToken, address indexed creator, address indexed filler, int256 price, uint256 numCreatorShares, uint256 numCreatorTokens, uint256 numFillerShares, uint256 numFillerTokens, uint256 settlementFees, bytes32 tradeGroupId);
    event ProceedsClaimed(address indexed sender, address indexed market, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance);


    function tokensTransferred(address token, address from, address to, uint256 value) {
         TokensTransferred(token, from, to, value);
    }

    function marketCreated(address market, address marketCreator, uint256 marketCreationFee, string extraInfo) {
        MarketCreated(market, marketCreator, marketCreationFee, extraInfo);
    }

    function reporterRegistered(address reporter, address reportingWindow) {
        ReporterRegistered(reporter, reportingWindow);
    }

    function designatedReportSubmitted(address designatedReporter, address market, uint256[] payoutNumerators) {
        DesignatedReportSubmitted(designatedReporter, market, payoutNumerators);
    }

    function reportSubmitted(address reporter, address market, address reportingToken, uint256 amountStaked, uint256[] payoutNumerators) {
        ReportSubmitted(reporter, market, reportingToken, amountStaked, payoutNumerators);
    }

    function winningTokensRedeemed(address reporter, address market, address reportingToken, uint256 amountRedeemed, address reportingFeesReceived, uint256[] payoutNumerators) {
        WinningTokensRedeemed(reporter, market, reportingToken, amountRedeemed, reportingFeesReceived, payoutNumerators);
    }

    function reportsDisputed(address disputer, address market, ReportingPhase reportingPhase, uint256 disputeBondAmount) {
        ReportsDisputed(disputer, market, reportingPhase, disputeBondAmount);
    }

    function marketFinalized(address market) {
        MarketFinalized(market);
    }

    function universeForked(address universe) {
        UniverseForked(universe);
    }

    // trading events
    function orderCanceled(address market, address sender, uint8 outcome, bytes32 orderId, uint8 orderType, uint256 tokenRefund, uint256 sharesRefund) {
        OrderCanceled(market, sender, outcome, orderId, orderType, tokenRefund, sharesRefund);
    }

    function orderCreated(address shareToken, address creator, bytes32 orderId, int256 price, uint256 amount, uint256 numTokensEscrowed, uint256 numSharesEscrowed, bytes32 tradeGroupId) {
        OrderCreated(shareToken, creator, orderId, price, amount, numTokensEscrowed, numSharesEscrowed, tradeGroupId);
    }

    function orderFilled(address shareToken, address creator, address filler, int256 price, uint256 numCreatorShares, uint256 numCreatorTokens, uint256 numFillerShares, uint256 numFillerTokens, uint256 settlementFees, bytes32 tradeGroupId) {
        OrderFilled(shareToken, creator, filler, price, numCreatorShares, numCreatorTokens, numFillerShares, numFillerTokens, settlementFees, tradeGroupId);
    }

    function proceedsClaimed(address sender, address market, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance) {
        ProceedsClaimed(sender, market, numShares, numPayoutTokens, finalTokenBalance);
    }
}
