pragma solidity 0.5.10;


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
        require(msg.sender == fillOrder || msg.sender == address(this) || _market.getUniverse().isOpenInterestCash(msg.sender));
        require(_sender != address(0));

        uint256 _numOutcomes = _market.getNumberOfOutcomes();

        uint256 _cost = _amount.mul(_market.getNumTicks());

        IUniverse _universe = _market.getUniverse();

        _universe.deposit(_sender, _cost, address(_market));

        for (uint256 _outcome = 0; _outcome < _numOutcomes; ++_outcome) {
            _market.getShareToken(_outcome).createShares(_sender, _amount);
        }

        if (!_market.isFinalized()) {
            _universe.incrementOpenInterest(_cost);
        }

        augur.logMarketOIChanged(_universe, _market);

        return true;
    }

    function jointBuyCompleteSets(IMarket _market, uint256 _amount, address _longParticipant, address _shortParticipant, uint256 _longOutcome, address _longRecipient, address _shortRecipient, uint256 _price) external nonReentrant {
        require(augur.isKnownMarket(_market));
        require(msg.sender == fillOrder);

        uint256 _cost = _amount.mul(_market.getNumTicks());

        uint256 _longCost = _amount.mul(_price);
        uint256 _shortCost = _cost.sub(_longCost);
        IUniverse _universe = _market.getUniverse();

        // Transfer cost from both participants. If the funds were already escrowed in the market do nothing.
        if (_longParticipant != address(_market)) {
            _universe.deposit(_longParticipant, _longCost, address(_market));
        }
        if (_shortParticipant != address(_market)) {
            _universe.deposit(_shortParticipant, _shortCost, address(_market));
        }

        // Mint shares as specified to recipients

        _market.getShareToken(_longOutcome).createShares(_longRecipient, _amount);
        for (uint256 _outcome = 0; _outcome < _market.getNumberOfOutcomes(); ++_outcome) {
            if (_longOutcome == _outcome) {
                continue;
            }
            _market.getShareToken(_outcome).createShares(_shortRecipient, _amount);
        }

        if (!_market.isFinalized()) {
            _universe.incrementOpenInterest(_cost);
        }

        augur.logMarketOIChanged(_universe, _market);
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
        IUniverse _universe = _market.getUniverse();
        if (!_market.isFinalized()) {
            _universe.decrementOpenInterest(_payout);
        }
        _creatorFee = _market.deriveMarketCreatorFeeAmount(_payout);
        uint256 _reportingFeeDivisor = _universe.getOrCacheReportingFeeDivisor();
        _reportingFee = _payout.div(_reportingFeeDivisor);
        _payout = _payout.sub(_creatorFee).sub(_reportingFee);

        // Takes shares away from participant and decreases the amount issued in the market since we're exchanging complete sets
        for (uint256 _outcome = 0; _outcome < _numOutcomes; ++_outcome) {
            _market.getShareToken(_outcome).destroyShares(_sender, _amount);
        }

        if (_creatorFee != 0) {
            _market.recordMarketCreatorFees(_creatorFee, _affiliateAddress);
        }

        _market.getUniverse().withdraw(address(this), _payout.add(_reportingFee), address(_market));


        if (_reportingFee != 0) {
            require(cash.transfer(address(_universe.getOrCreateNextDisputeWindow(false)), _reportingFee));
        }
        require(cash.transfer(_sender, _payout));

        augur.logMarketOIChanged(_universe, _market);

        return (_creatorFee, _reportingFee);
    }

    function jointSellCompleteSets(IMarket _market, uint256 _amount, address _shortParticipant, address _longParticipant, uint256 _shortOutcome, address _shortRecipient, address _longRecipient, uint256 _price, address _affiliateAddress) external nonReentrant returns (uint256 _creatorFee, uint256 _reportingFee) {
        require(augur.isKnownMarket(_market));
        require(msg.sender == fillOrder);

        uint256 _payout = _amount.mul(_market.getNumTicks());

        IUniverse _universe = _market.getUniverse();

        if (!_market.isFinalized()) {
            _universe.decrementOpenInterest(_payout);
        }

        _creatorFee = _market.deriveMarketCreatorFeeAmount(_payout);
        _reportingFee = _payout.div(_universe.getOrCacheReportingFeeDivisor());
        _payout = _payout.sub(_creatorFee).sub(_reportingFee);

        // Takes shares away from participants
        _market.getShareToken(_shortOutcome).destroyShares(_shortParticipant, _amount);
        for (uint256 _outcome = 0; _outcome < _market.getNumberOfOutcomes(); ++_outcome) {
            if (_outcome == _shortOutcome) {
                continue;
            }
            _market.getShareToken(_outcome).destroyShares(_longParticipant, _amount);
        }

        distributePayout(_market, _price, _shortRecipient, _longRecipient, _payout, _creatorFee, _reportingFee, _affiliateAddress);

        augur.logMarketOIChanged(_universe, _market);

        return (_creatorFee, _reportingFee);
    }

    function distributePayout(IMarket _market, uint256 _price, address _shortRecipient, address _longRecipient, uint256 _payout, uint256 _creatorFee, uint256 _reportingFee, address _affiliateAddress) private {
        // Distribute fees
        if (_creatorFee != 0) {
            _market.recordMarketCreatorFees(_creatorFee, _affiliateAddress);
        }

        _market.getUniverse().withdraw(address(this), _payout.add(_reportingFee), address(_market));

        if (_reportingFee != 0) {
            require(cash.transfer(address(_market.getUniverse().getOrCreateNextDisputeWindow(false)), _reportingFee));
        }

        // Distribute cash to the recipients
        uint256 _shortPayout = _payout.mul(_price) / _market.getNumTicks();
        require(cash.transfer(_shortRecipient, _shortPayout));
        require(cash.transfer(_longRecipient, _payout.sub(_shortPayout)));
    }
}
