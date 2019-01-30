pragma solidity 0.4.24;


import 'trading/ICompleteSets.sol';
import 'IAugur.sol';
import 'libraries/ReentrancyGuard.sol';
import 'libraries/math/SafeMathUint256.sol';
import 'trading/ICash.sol';
import 'reporting/IMarket.sol';
import 'reporting/IDisputeWindow.sol';
import 'reporting/IAuction.sol';
import 'trading/IOrders.sol';
import 'libraries/Initializable.sol';
import 'IAugur.sol';


contract CompleteSets is Initializable, ReentrancyGuard, ICompleteSets {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    address public fillOrder;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        fillOrder = augur.lookup("FillOrder");
    }

    /**
     * Buys `_amount` shares of every outcome in the specified market.
    **/
    function publicBuyCompleteSets(IMarket _market, uint256 _amount) external afterInitialized returns (bool) {
        this.buyCompleteSets(msg.sender, _market, _amount);
        augur.logCompleteSetsPurchased(_market.getUniverse(), _market, msg.sender, _amount);
        _market.assertBalances();
        return true;
    }

    function publicBuyCompleteSetsWithCash(IMarket _market, uint256 _amount) external afterInitialized returns (bool) {
        this.buyCompleteSets(msg.sender, _market, _amount);
        augur.logCompleteSetsPurchased(_market.getUniverse(), _market, msg.sender, _amount);
        _market.assertBalances();
        return true;
    }

    function buyCompleteSets(address _sender, IMarket _market, uint256 _amount) external nonReentrant returns (bool) {
        require(augur.isValidMarket(_market));
        require(msg.sender == fillOrder || msg.sender == address(this));
        require(_sender != address(0));

        uint256 _numOutcomes = _market.getNumberOfOutcomes();
        ICash _denominationToken = _market.getDenominationToken();

        uint256 _cost = _amount.mul(_market.getNumTicks());
        require(augur.trustedTransfer(_denominationToken, _sender, _market, _cost));
        for (uint256 _outcome = 0; _outcome < _numOutcomes; ++_outcome) {
            _market.getShareToken(_outcome).createShares(_sender, _amount);
        }

        if (!_market.isFinalized()) {
            _market.getUniverse().incrementOpenInterest(_cost);
        }

        return true;
    }

    function publicSellCompleteSets(IMarket _market, uint256 _amount) external afterInitialized returns (bool) {
        this.sellCompleteSets(msg.sender, _market, _amount);
        augur.logCompleteSetsSold(_market.getUniverse(), _market, msg.sender, _amount);
        _market.assertBalances();
        return true;
    }

    function publicSellCompleteSetsWithCash(IMarket _market, uint256 _amount) external afterInitialized returns (bool) {
        this.sellCompleteSets(msg.sender, _market, _amount);
        augur.logCompleteSetsSold(_market.getUniverse(), _market, msg.sender, _amount);
        _market.assertBalances();
        return true;
    }

    function sellCompleteSets(address _sender, IMarket _market, uint256 _amount) external afterInitialized nonReentrant returns (uint256 _creatorFee, uint256 _reportingFee) {
        require(augur.isValidMarket(_market));
        require(msg.sender == fillOrder || msg.sender == address(this));
        require(_sender != address(0));

        uint256 _numOutcomes = _market.getNumberOfOutcomes();
        ICash _denominationToken = _market.getDenominationToken();
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
            _market.recordMarketCreatorFees(_creatorFee);
        }
        if (_reportingFee != 0) {
            IAuction _auction = IAuction(_market.getUniverse().getAuction());
            require(_denominationToken.transferFrom(_market, _auction, _reportingFee));
            _auction.recordFees(_reportingFee);
        }
        require(_denominationToken.transferFrom(_market, _sender, _payout));

        return (_creatorFee, _reportingFee);
    }
}
