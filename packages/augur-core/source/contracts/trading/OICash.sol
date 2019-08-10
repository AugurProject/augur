pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/trading/IOICash.sol';


/**
 * @title OI Cash
 * @dev A Wrapper contract for the deployed Cash contract which Augur considers OI. Cash can be deposited and will count toward OI for reporting fee calculations and will extract a reporting fee on withdrawl
 */
contract OICash is VariableSupplyToken, Initializable, IOICash {
    using SafeMathUint256 for uint256;

    IERC20 public cash;
    IUniverse public universe;
    uint256 public totalAmountFeesPaid;

    function initialize(IAugur _augur, IUniverse _universe, address _erc1820RegistryAddress) external beforeInitialized {
        endInitialization();
        cash = ICash(_augur.lookup("Cash"));
        universe = _universe;
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
    }

    function deposit(uint256 _amount) external returns (bool) {
        universe.deposit(msg.sender, _amount, address(0));
        mint(msg.sender, _amount);
        return true;
    }

    function withdraw(uint256 _amount) external returns (bool) {
        burn(msg.sender, _amount);

        uint256 _payout = _amount;
        uint256 _amountOwedFees = _amount;

        if (totalAmountFeesPaid >= _amountOwedFees) {
            totalAmountFeesPaid = totalAmountFeesPaid.sub(_amountOwedFees);
            _amountOwedFees = 0;
        } else if (totalAmountFeesPaid > 0) {
            _amountOwedFees = _amountOwedFees.sub(totalAmountFeesPaid);
            totalAmountFeesPaid = 0;
        }

        universe.withdraw(address(this), _amount, address(0));

        if (_amountOwedFees > 0) {
            uint256 _reportingFeeDivisor = universe.getOrCacheReportingFeeDivisor();
            uint256 _reportingFee = _amountOwedFees.div(_reportingFeeDivisor);
            _payout = _payout.sub(_reportingFee);
            cash.transfer(address(universe.getOrCreateNextDisputeWindow(false)), _reportingFee);
        }

        cash.transfer(msg.sender, _payout);

        return true;
    }

    function payFees(uint256 _feeAmount) external returns (bool) {
        burn(msg.sender, _feeAmount);
        uint256 _reportingFeeDivisor = universe.getOrCacheReportingFeeDivisor();
        uint256 _openInterestAmount = _feeAmount.mul(_reportingFeeDivisor);
        universe.withdraw(address(universe.getOrCreateNextDisputeWindow(false)), _feeAmount, address(0));
        totalAmountFeesPaid = totalAmountFeesPaid.add(_openInterestAmount);
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
    }

    function onMint(address _target, uint256 _amount) internal {
    }

    function onBurn(address _target, uint256 _amount) internal {
    }
}