pragma solidity ^0.4.17;

contract IMarket {
    enum ReportingState {
        PRE_REPORTING,
        DESIGNATED_REPORTING,
        AWAITING_FORK_MIGRATION,
        DESIGNATED_DISPUTE,
        FIRST_REPORTING,
        FIRST_DISPUTE,
        AWAITING_NO_REPORT_MIGRATION,
        LAST_REPORTING,
        LAST_DISPUTE,
        FORKING,
        AWAITING_FINALIZATION,
        FINALIZED
    }
}

library Order {
    enum TradeTypes {
        Bid, Ask
    }
}

contract MockAugur {
    event MarketCreated(address indexed universe, address indexed market, address indexed marketCreator, uint256 marketCreationFee, string extraInfo);
    function marketCreated(address universe, address market, address marketCreator, uint256 marketCreationFee, string extraInfo) public {
        MarketCreated(universe, market, marketCreator, marketCreationFee, extraInfo);
    }


    event DesignatedReportSubmitted(address indexed universe, address indexed reporter, address indexed market, address stakeToken, uint256 amountStaked, uint256[] payoutNumerators);
    function designatedReportSubmitted(address universe, address reporter, address market, address stakeToken, uint256 amountStaked, uint256[] payoutNumerators) public {
        DesignatedReportSubmitted(universe, reporter, market, stakeToken, amountStaked, payoutNumerators);
    }


    event ReportSubmitted(address indexed universe, address indexed reporter, address indexed market, address stakeToken, uint256 amountStaked, uint256[] payoutNumerators);
    function reportSubmitted(address universe, address reporter, address market, address stakeToken, uint256 amountStaked, uint256[] payoutNumerators) public {
        ReportSubmitted(universe, reporter, market, stakeToken, amountStaked, payoutNumerators);
    }


    event WinningTokensRedeemed(address indexed universe, address indexed reporter, address indexed market, address stakeToken, uint256 amountRedeemed, uint256 reportingFeesReceived, uint256[] payoutNumerators);
    function winningTokensRedeemed(address universe, address reporter, address market, address stakeToken, uint256 amountRedeemed, uint256 reportingFeesReceived, uint256[] payoutNumerators) public {
        WinningTokensRedeemed(universe, reporter, market, stakeToken, amountRedeemed, reportingFeesReceived, payoutNumerators);
    }


    event ReportsDisputed(address indexed universe, address indexed disputer, address indexed market, IMarket.ReportingState reportingPhase, uint256 disputeBondAmount);
    function reportsDisputed(address universe, address disputer, address market, IMarket.ReportingState reportingPhase, uint256 disputeBondAmount) public {
        ReportsDisputed(universe, disputer, market, reportingPhase, disputeBondAmount);
    }


    event MarketFinalized(address indexed universe, address indexed market);
    function marketFinalized(address universe, address market) public {
        MarketFinalized(universe, market);
    }


    event UniverseForked(address indexed universe);
    function universeForked(address universe) public {
        UniverseForked(universe);
    }


    event OrderCanceled(address indexed universe, address indexed shareToken, address indexed sender, bytes32 orderId, Order.TradeTypes orderType, uint256 tokenRefund, uint256 sharesRefund);
    function orderCanceled(address universe, address shareToken, address sender, bytes32 orderId, Order.TradeTypes orderType, uint256 tokenRefund, uint256 sharesRefund) public {
        OrderCanceled(universe, shareToken, sender, orderId, orderType, tokenRefund, sharesRefund);
    }


    event OrderCreated(address indexed universe, address indexed shareToken, address indexed creator, bytes32 orderId, uint256 tradeGroupId);
    function orderCreated(address universe, address shareToken, address creator, bytes32 orderId, uint256 tradeGroupId) public {
        OrderCreated(universe, shareToken, creator, orderId, tradeGroupId);
    }


    event OrderFilled(address indexed universe, address indexed shareToken, address filler, bytes32 orderId, uint256 numCreatorShares, uint256 numCreatorTokens, uint256 numFillerShares, uint256 numFillerTokens, uint256 marketCreatorFees, uint256 reporterFees, uint256 tradeGroupId);
    function orderFilled(address universe, address shareToken, address filler, bytes32 orderId, uint256 numCreatorShares, uint256 numCreatorTokens, uint256 numFillerShares, uint256 numFillerTokens, uint256 marketCreatorFees, uint256 reporterFees, uint256 tradeGroupId) public {
        OrderFilled(universe, shareToken, filler, orderId, numCreatorShares, numCreatorTokens, numFillerShares, numFillerTokens, marketCreatorFees, reporterFees, tradeGroupId);
    }


    event ProceedsClaimed(address indexed universe, address indexed shareToken, address indexed sender, address market, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance);
    function proceedsClaimed(address universe, address shareToken, address sender, address market, uint256 numShares, uint256 numPayoutTokens, uint256 finalTokenBalance) public {
        ProceedsClaimed(universe, shareToken, sender, market, numShares, numPayoutTokens, finalTokenBalance);
    }


    event UniverseCreated(address indexed parentUniverse, address indexed childUniverse);
    function universeCreated(address parentUniverse, address childUniverse) public {
        UniverseCreated(parentUniverse, childUniverse);
    }


    event TokensTransferred(address indexed universe, address indexed token, address indexed from, address to, uint256 value);
    function tokensTransferred(address universe, address token, address from, address to, uint256 value) public {
        TokensTransferred(universe, token, from, to, value);
    }


}
