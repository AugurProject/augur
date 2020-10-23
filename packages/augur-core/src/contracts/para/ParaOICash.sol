pragma solidity 0.5.15;

import 'ROOT/para/interfaces/IParaAugur.sol';
import 'ROOT/para/interfaces/IParaUniverse.sol';
import 'ROOT/para/interfaces/IParaShareToken.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/para/interfaces/IParaOICash.sol';


/**
 * @title OI Cash (ETH variant)
 * @dev A Wrapper contract for the deployed Cash contract which Augur considers OI. Cash can be deposited and will count toward OI for reporting fee calculations and will extract a reporting fee on withdrawl
 */
contract ParaOICash is VariableSupplyToken, Initializable, IParaOICash {
    using SafeMathUint256 for uint256;

    IParaAugur public augur;
    IERC20 public cash;
    IParaUniverse public universe;
    IParaShareToken public shareToken;
    uint256 public feesPaid;

    uint256 private constant MAX_APPROVAL_AMOUNT = 2 ** 256 - 1;

    function initialize(IParaAugur _augur, IParaUniverse _universe) external beforeInitialized {
        endInitialization();
        augur = _augur;
        cash = ICash(_augur.lookup("Cash"));
        shareToken = IParaShareToken(_augur.lookup("ShareToken"));
        require(shareToken != IParaShareToken(0));
        universe = _universe;

        require(cash.approve(address(_augur), MAX_APPROVAL_AMOUNT), "Cash approval of augur failed");
        require(cash.approve(address(_universe.getFeePot()), MAX_APPROVAL_AMOUNT), "Cash approval of fee pot failed");
    }

    function approveFeePot() external {
        require(cash.approve(address(universe.getFeePot()), MAX_APPROVAL_AMOUNT), "Cash approval of fee pot failed");
    }

    function deposit(uint256 _amount) external returns (bool) {
        universe.deposit(msg.sender, _amount, address(0));
        mint(msg.sender, _amount);
        return true;
    }

    function withdraw(uint256 _amount) external returns (bool _alwaysTrue, uint256 _payout) {
        burn(msg.sender, _amount);

        // Withdraw cash to this contract
        universe.withdraw(address(this), _amount, address(0));

        _payout = _amount;
        uint256 _reportingFeeDivisor = universe.getOrCacheReportingFeeDivisor();
        uint256 _feesOwed = _amount / _reportingFeeDivisor;

        if (feesPaid > _feesOwed) {
            feesPaid = feesPaid.sub(_feesOwed);
        } else {
            _feesOwed = _feesOwed.sub(feesPaid);
            feesPaid = 0;
            _payout = _payout.sub(_feesOwed);
            universe.getFeePot().depositFees(_feesOwed);
        }

        require(cash.transfer(msg.sender, _payout));

        _alwaysTrue = true;
    }

    function payFees(uint256 _feeAmount) external returns (bool) {
        burn(msg.sender, _feeAmount);
        universe.withdraw(address(this), _feeAmount, address(0));
        universe.getFeePot().depositFees(_feeAmount);
        feesPaid = feesPaid.add(_feeAmount);
        return true;
    }

    function buyCompleteSets(IMarket _market, uint256 _amount) external returns (bool) {
        IUniverse _marketUniverse = _market.getUniverse();
        IUniverse _originUniverse = universe.originUniverse();
        require(augur.isKnownUniverse(_marketUniverse), "Malicious market provided");
        require(_marketUniverse == _originUniverse || _marketUniverse.getParentUniverse() == _originUniverse, "Universe not valid for this OI");
        require(_marketUniverse.isContainerForMarket(_market), "Market does not belong to universe");
        uint256 _cost = _amount.mul(_market.getNumTicks());
        burn(msg.sender, _cost);
        universe.withdraw(address(this), _cost, address(0));
        shareToken.buyCompleteSets(_market, msg.sender, _amount);
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
    }

    function onMint(address _target, uint256 _amount) internal {
    }

    function onBurn(address _target, uint256 _amount) internal {
    }
}
