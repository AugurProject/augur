pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/trading/IOrders.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/math/SafeMathUint256.sol';
import 'ROOT/libraries/math/SafeMathInt256.sol';


/**
 * @title Profit Loss
 * @notice Storage of Profit Loss data.
 */
contract ProfitLoss is Initializable {
    using SafeMathUint256 for uint256;
    using SafeMathInt256 for int256;

    IAugur public augur;
    IOrders public orders;
    address public createOrder;
    address public cancelOrder;
    address public fillOrder;
    address public claimTradingProceeds;

    struct OutcomeData {
        int256 netPosition;
        int256 avgPrice; // Cannot actually be negative. Typed for code convenience
        int256 realizedProfit;
        int256 frozenFunds;
        int256 realizedCost; // Also cannot be negative.
    }

    // User => Market => Outcome => Data
    mapping (address => mapping(address => mapping(uint256 => OutcomeData))) private profitLossData;

    function initialize(IAugur _augur) public beforeInitialized {
        endInitialization();
        augur = _augur;
        createOrder = augur.lookup("CreateOrder");
        cancelOrder = augur.lookup("CancelOrder");
        fillOrder = augur.lookup("FillOrder");
        claimTradingProceeds = augur.lookup("ClaimTradingProceeds");
        orders = IOrders(augur.lookup("Orders"));
    }

    function recordFrozenFundChange(IMarket _market, address _account, uint256 _outcome, int256 _frozenFundDelta) public returns (bool) {
        require(msg.sender == createOrder || msg.sender == cancelOrder || msg.sender == address(orders) || msg.sender == fillOrder);
        OutcomeData storage _outcomeData = profitLossData[_account][address(_market)][_outcome];
        _outcomeData.frozenFunds += _frozenFundDelta;
        augur.logProfitLossChanged(_market, _account, _outcome, _outcomeData.netPosition, uint256(_outcomeData.avgPrice), _outcomeData.realizedProfit, _outcomeData.frozenFunds,  _outcomeData.realizedCost);
        return true;
    }

    function recordExternalTransfer(address _source, address _destination, uint256 _value) public returns (bool) {
        IShareToken _shareToken = IShareToken(msg.sender);
        require(augur.isKnownShareToken(_shareToken));
        this.recordTrade(_shareToken.getMarket(), _destination, _source, _shareToken.getOutcome(), int256(_value), 0, 0, 0, 0, _value);
        return true;
    }

    function adjustTraderProfitForFees(IMarket _market, address _trader, uint256 _outcome, uint256 _fees) public returns (bool) {
        profitLossData[_trader][address(_market)][_outcome].realizedProfit -= int256(_fees);
        return true;
    }

    function recordTrade(IMarket _market, address _longAddress, address _shortAddress, uint256 _outcome, int256 _amount, int256 _price, uint256 _numLongTokens, uint256 _numShortTokens, uint256 _numLongShares, uint256 _numShortShares) public returns (bool) {
        require(msg.sender == fillOrder || msg.sender == address(this));
        int256 _numTicks = int256(_market.getNumTicks());
        int256  _longFrozenTokenDelta = int256(_numLongTokens).sub(int256(_numLongShares).mul(_numTicks.sub(_price)));
        int256  _shortFrozenTokenDelta = int256(_numShortTokens).sub(int256(_numShortShares).mul(_price));
        adjustForTrader(_market, _shortAddress, _outcome, -_amount, _price, _shortFrozenTokenDelta);
        adjustForTrader(_market, _longAddress, _outcome, _amount, _price, _longFrozenTokenDelta);
        return true;
    }

    function adjustForTrader(IMarket _market, address _address, uint256 _outcome, int256 _amount, int256 _price, int256 _frozenTokenDelta) public returns (bool) {
        OutcomeData storage _outcomeData = profitLossData[_address][address(_market)][_outcome];
        int256 _newNetPosition = _outcomeData.netPosition.add(_amount);
        bool _sold = _outcomeData.netPosition < 0 &&  _amount > 0 || _outcomeData.netPosition > 0 &&  _amount < 0;
        int256 _profit = 0;
        if (_outcomeData.netPosition != 0 && _sold) {
            int256 _amountSold = _outcomeData.netPosition.abs().min(_amount.abs());
            _profit = (_outcomeData.netPosition < 0 ? _outcomeData.avgPrice.sub(_price) : _price.sub(_outcomeData.avgPrice)).mul(_amountSold);
            _outcomeData.realizedProfit += _profit;
            _outcomeData.realizedCost += (_outcomeData.netPosition < 0 ? int256(_market.getNumTicks()).sub(_outcomeData.avgPrice) : _outcomeData.avgPrice).mul(_amountSold);
            _outcomeData.frozenFunds = _outcomeData.frozenFunds + _profit;
        }

        _outcomeData.frozenFunds += _frozenTokenDelta;

        if (_newNetPosition == 0) {
            _outcomeData.avgPrice = 0;
            _outcomeData.netPosition = 0;
            augur.logProfitLossChanged(_market, _address, _outcome, 0, 0, _outcomeData.realizedProfit, _outcomeData.frozenFunds, _outcomeData.realizedCost);
            return true;
        }

        bool _reversed = _outcomeData.netPosition < 0 &&  _newNetPosition > 0 || _outcomeData.netPosition > 0 &&  _newNetPosition < 0;

        if (_reversed) {
            _outcomeData.avgPrice = _price;
        } else if (!_sold) {
            _outcomeData.avgPrice = _outcomeData.netPosition.abs().mul(_outcomeData.avgPrice).add(_amount.abs().mul(_price)).div(_newNetPosition.abs());
        }

        _outcomeData.netPosition = _newNetPosition;
        augur.logProfitLossChanged(_market, _address, _outcome, _outcomeData.netPosition, uint256(_outcomeData.avgPrice), _outcomeData.realizedProfit, _outcomeData.frozenFunds,  _outcomeData.realizedCost);
        return true;
    }

    function recordClaim(IMarket _market, address _account, uint256[] memory _outcomeFees) public returns (bool) {
        require(msg.sender == claimTradingProceeds);
        uint256 _numOutcomes = _market.getNumberOfOutcomes();
        for (uint256 _outcome = 0; _outcome < _numOutcomes; _outcome++) {
            OutcomeData storage _outcomeData = profitLossData[_account][address(_market)][_outcome];
            if (_outcomeData.netPosition == 0) {
                continue;
            }
            int256 _salePrice = int256(_market.getWinningPayoutNumerator(_outcome));
            int256 _amount = _outcomeData.netPosition.abs();
            _outcomeData.realizedProfit += (_outcomeData.netPosition < 0 ? _outcomeData.avgPrice.sub(_salePrice) : _salePrice.sub(_outcomeData.avgPrice)).mul(_amount);
            _outcomeData.realizedProfit -= int256(_outcomeFees[_outcome]);
            _outcomeData.realizedCost += (_outcomeData.netPosition < 0 ? int256(_market.getNumTicks()).sub(_outcomeData.avgPrice) : _outcomeData.avgPrice).mul(_amount);
            _outcomeData.avgPrice = 0;
            _outcomeData.frozenFunds = 0;
            _outcomeData.netPosition = 0;
            augur.logProfitLossChanged(_market, _account, _outcome, 0, 0, _outcomeData.realizedProfit, 0, _outcomeData.realizedCost);
        }
        return true;
    }

    function getNetPosition(address _market, address _account, uint256 _outcome) public view returns (int256) {
        return profitLossData[_account][_market][_outcome].netPosition;
    }

    function getAvgPrice(address _market, address _account, uint256 _outcome) public view returns (int256) {
        return profitLossData[_account][_market][_outcome].avgPrice;
    }

    function getRealizedProfit(address _market, address _account, uint256 _outcome) public view returns (int256) {
        return profitLossData[_account][_market][_outcome].realizedProfit;
    }

    function getFrozenFunds(address _market, address _account, uint256 _outcome) public view returns (int256) {
        return profitLossData[_account][_market][_outcome].frozenFunds;
    }

    function getRealizedCost(address _market, address _account, uint256 _outcome) public view returns (int256) {
        return profitLossData[_account][_market][_outcome].realizedCost;
    }
}
