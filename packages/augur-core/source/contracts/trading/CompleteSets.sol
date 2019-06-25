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


contract CompleteSets is Initializable, ReentrancyGuard, ICompleteSets {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    ICash public cash;
    address public fillOrder;

    function initialize(IAugur _augur) public beforeInitialized returns (bool) {
        endInitialization();
        augur = _augur;
        fillOrder = augur.lookup("FillOrder");
        cash = ICash(augur.lookup("Cash"));
        return true;
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

    function publicSellCompleteSets(IMarket _market, uint256 _amount) external afterInitialized returns (bool) {
        (uint256 _creatorFee, uint256 _reportingFee) = this.sellCompleteSets(msg.sender, _market, _amount, address(0));
        augur.logCompleteSetsSold(_market.getUniverse(), _market, msg.sender, _amount, _creatorFee.add(_reportingFee));
        _market.assertBalances();
        return true;
    }

    function publicSellCompleteSetsWithCash(IMarket _market, uint256 _amount) external afterInitialized returns (bool) {
        (uint256 _creatorFee, uint256 _reportingFee) = this.sellCompleteSets(msg.sender, _market, _amount, address(0));
        augur.logCompleteSetsSold(_market.getUniverse(), _market, msg.sender, _amount, _creatorFee.add(_reportingFee));
        _market.assertBalances();
        return true;
    }

    function sellCompleteSets(address _sender, IMarket _market, uint256 _amount, address _affiliateAddress) external afterInitialized nonReentrant returns (uint256 _creatorFee, uint256 _reportingFee) {
        require(augur.isValidMarket(_market));
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
