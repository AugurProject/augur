pragma solidity 0.5.10;


import 'ROOT/trading/IClaimTradingProceeds.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/trading/IProfitLoss.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/reporting/Reporting.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/libraries/Initializable.sol';


/**
 * @title Claim Trading Proceeds
 * @notice This allows users to claim their money from a market by exchanging their shares
 */
contract ClaimTradingProceeds is Initializable, ReentrancyGuard, IClaimTradingProceeds {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    IProfitLoss public profitLoss;
    ICash public cash;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        profitLoss = IProfitLoss(augur.lookup("ProfitLoss"));
        cash = ICash(augur.lookup("Cash"));
    }

    /**
     * @notice Claims winnings for multiple markets and for a particular shareholder
     * @param _markets Array of markets to claim winnings for
     * @param _shareHolder The account to claim winnings for
     * @return Bool True
     */
    function claimMarketsProceeds(IMarket[] calldata _markets, address _shareHolder) external returns(bool) {
        for (uint256 i=0; i < _markets.length; i++) {
            this.claimTradingProceeds(_markets[i], _shareHolder);
        }
        return true;
    }

    /**
     * @notice Claims winnings for a market and for a particular shareholder
     * @param _market The market to claim winnings for
     * @param _shareHolder The account to claim winnings for
     * @return Bool True
     */
    function claimTradingProceeds(IMarket _market, address _shareHolder) external nonReentrant returns(bool) {
        require(augur.isKnownMarket(_market));
        require(_market.isFinalized(), "ClaimTradingProceeds.claimTradingProceeds: Market is not finalized");

        for (uint256 _outcome = 0; _outcome < _market.getNumberOfOutcomes(); ++_outcome) {
            IShareToken _shareToken = _market.getShareToken(_outcome);
            uint256 _numberOfShares = _shareToken.balanceOf(_shareHolder);

            if (_numberOfShares > 0) {
                uint256 _proceeds;
                uint256 _shareHolderShare;
                uint256 _creatorShare;
                uint256 _reporterShare;
                (_proceeds, _shareHolderShare, _creatorShare, _reporterShare) = divideUpWinnings(_market, _outcome, _numberOfShares);

                // always destroy shares as it gives a minor gas refund and is good for the network
                _shareToken.destroyShares(_shareHolder, _numberOfShares);
                logTradingProceedsClaimed(_market, _outcome, address(_shareToken), _shareHolder, _numberOfShares, _shareHolderShare, _creatorShare.add(_reporterShare));

                if (_proceeds > 0) {
                    _market.getUniverse().withdraw(address(this), _shareHolderShare.add(_reporterShare), address(_market));
                    distributeProceeds(_market, _shareHolder, _shareHolderShare, _creatorShare, _reporterShare);
                }
            }
        }

        profitLoss.recordClaim(_market, _shareHolder);

        _market.assertBalances();

        return true;
    }

    function distributeProceeds(IMarket _market, address _shareHolder, uint256 _shareHolderShare, uint256 _creatorShare, uint256 _reporterShare) private {
        if (_shareHolderShare > 0) {
            require(cash.transfer(_shareHolder, _shareHolderShare));
        }
        if (_creatorShare > 0) {
            _market.recordMarketCreatorFees(_creatorShare, address(0));
        }
        if (_reporterShare > 0) {
            require(cash.transfer(address(_market.getUniverse().getOrCreateNextDisputeWindow(false)), _reporterShare));
        }
    }

    function logTradingProceedsClaimed(IMarket _market, uint256 _outcome, address _shareToken, address _sender, uint256 _numShares, uint256 _numPayoutTokens, uint256 _fees) private {
        augur.logTradingProceedsClaimed(_market.getUniverse(), _shareToken, _sender, address(_market), _outcome, _numShares, _numPayoutTokens, _sender.balance.add(_numPayoutTokens), _fees);
    }

    function divideUpWinnings(IMarket _market, uint256 _outcome, uint256 _numberOfShares) public returns (uint256 _proceeds, uint256 _shareHolderShare, uint256 _creatorShare, uint256 _reporterShare) {
        _proceeds = calculateProceeds(_market, _outcome, _numberOfShares);
        _creatorShare = calculateCreatorFee(_market, _proceeds);
        _reporterShare = calculateReportingFee(_market, _proceeds);
        _shareHolderShare = _proceeds.sub(_creatorShare).sub(_reporterShare);
        return (_proceeds, _shareHolderShare, _creatorShare, _reporterShare);
    }

    function calculateProceeds(IMarket _market, uint256 _outcome, uint256 _numberOfShares) public view returns (uint256) {
        uint256 _payoutNumerator = _market.getWinningPayoutNumerator(_outcome);
        return _numberOfShares.mul(_payoutNumerator);
    }

    function calculateReportingFee(IMarket _market, uint256 _amount) public returns (uint256) {
        uint256 _reportingFeeDivisor = _market.getUniverse().getOrCacheReportingFeeDivisor();
        return _amount.div(_reportingFeeDivisor);
    }

    function calculateCreatorFee(IMarket _market, uint256 _amount) public view returns (uint256) {
        return _market.deriveMarketCreatorFeeAmount(_amount);
    }
}
