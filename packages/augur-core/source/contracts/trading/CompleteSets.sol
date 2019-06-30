pragma solidity 0.5.4;


import 'ROOT/trading/ICompleteSets.sol';
import 'ROOT/IAugur.sol';
import 'ROOT/libraries/ReentrancyGuard.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/trading/ICash.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/reporting/IDisputeWindow.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/IAugur.sol';


/**
 * @title Complete Sets
 * @notice Exposes functions to purchase or sell complete sets of shares for a market
 */
contract CompleteSets is Initializable, ReentrancyGuard, ICompleteSets {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    ICash public cash;
    address public fillOrder;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        fillOrder = augur.lookup("FillOrder");
        cash = ICash(augur.lookup("Cash"));
    }

    /**
     * @notice Buy some amount of complete sets for a market
     * @param _market The market to purchase complete sets in
     * @param _amount The number of complete sets to purchase
     * @return Bool True
     */
    function publicBuyCompleteSets(IMarket _market, uint256 _amount) external returns (bool) {
        this.buyCompleteSets(msg.sender, _market, _amount);
        augur.logCompleteSetsPurchased(_market.getUniverse(), _market, msg.sender, _amount);
        _market.assertBalances();
        return true;
    }

    function buyCompleteSets(address _sender, IMarket _market, uint256 _amount) external nonReentrant returns (bool) {
        require(augur.isKnownMarket(_market));
        require(msg.sender == fillOrder || msg.sender == address(this));
        require(_sender != address(0));

        uint256 _numOutcomes = _market.getNumberOfOutcomes();

        uint256 _cost = _amount.mul(_market.getNumTicks());
        require(augur.trustedTransfer(cash, _sender, address(_market), _cost));
        for (uint256 _outcome = 0; _outcome < _numOutcomes; ++_outcome) {
            _market.getShareToken(_outcome).createShares(_sender, _amount);
        }

        if (!_market.isFinalized()) {
            _market.getUniverse().incrementOpenInterest(_cost);
        }

        return true;
    }

    /**
     * @notice Sell some amount of complete sets for a market
     * @param _market The market to sell complete sets in
     * @param _amount The number of complete sets to sell
     * @return Bool True
     */
    function publicSellCompleteSets(IMarket _market, uint256 _amount) external returns (bool) {
        (uint256 _creatorFee, uint256 _reportingFee) = this.sellCompleteSets(msg.sender, _market, _amount, address(0));
        augur.logCompleteSetsSold(_market.getUniverse(), _market, msg.sender, _amount, _creatorFee.add(_reportingFee));
        _market.assertBalances();
        return true;
    }

    function sellCompleteSets(address _sender, IMarket _market, uint256 _amount, address _affiliateAddress) external nonReentrant returns (uint256 _creatorFee, uint256 _reportingFee) {
        require(augur.isKnownMarket(_market));
        require(msg.sender == fillOrder || msg.sender == address(this));
        require(_sender != address(0));

        uint256 _numOutcomes = _market.getNumberOfOutcomes();
        uint256 _payout = _amount.mul(_market.getNumTicks());
        if (!_market.isFinalized()) {
            _market.getUniverse().decrementOpenInterest(_payout);
        }
        _creatorFee = _market.deriveMarketCreatorFeeAmount(_payout);
        uint256 _reportingFeeDivisor = _market.getUniverse().getOrCacheReportingFeeDivisor();
        _reportingFee = _payout.div(_reportingFeeDivisor);
        _payout = _payout.sub(_creatorFee).sub(_reportingFee);

        // Takes shares away from participant and decreases the amount issued in the market since we're exchanging complete sets
        for (uint256 _outcome = 0; _outcome < _numOutcomes; ++_outcome) {
            _market.getShareToken(_outcome).destroyShares(_sender, _amount);
        }

        if (_creatorFee != 0) {
            _market.recordMarketCreatorFees(_creatorFee, _affiliateAddress);
        }
        if (_reportingFee != 0) {
            require(cash.transferFrom(address(_market), address(_market.getUniverse().getOrCreateNextDisputeWindow(false)), _reportingFee));
        }
        require(cash.transferFrom(address(_market), _sender, _payout));

        return (_creatorFee, _reportingFee);
    }
}
