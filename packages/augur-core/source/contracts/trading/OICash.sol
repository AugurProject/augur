pragma solidity 0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/trading/IOICash.sol';
import 'ROOT/trading/ICompleteSets.sol';



/**
 * @title OI Cash
 * @dev A Wrapper contract for the deployed Cash contract which Augur considers OI. Cash can be deposited and will count toward OI for reporting fee calculations and will extract a reporting fee on withdrawl
 */
contract OICash is VariableSupplyToken, Initializable, IOICash {
    using SafeMathUint256 for uint256;

    IAugur public augur;
    IERC20 public cash;
    IUniverse public universe;
    ICompleteSets public completeSets;
    uint256 public feesPaid;

    function initialize(IAugur _augur, IUniverse _universe, address _erc1820RegistryAddress) external beforeInitialized {
        endInitialization();
        augur = _augur;
        cash = ICash(_augur.lookup("Cash"));
        completeSets = ICompleteSets(_augur.lookup("CompleteSets"));
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

        // Withdraw cash to this contract
        universe.withdraw(address(this), _amount, address(0));

        uint256 _payout = _amount;
        uint256 _reportingFeeDivisor = universe.getOrCacheReportingFeeDivisor();
        uint256 _feesOwed = _amount / _reportingFeeDivisor;

        if (feesPaid > _feesOwed) {
            feesPaid = feesPaid.sub(_feesOwed);
        } else {
            _feesOwed = _feesOwed.sub(feesPaid);
            feesPaid = 0;
            _payout = _payout.sub(_feesOwed);
            cash.transfer(address(universe.getOrCreateNextDisputeWindow(false)), _feesOwed);
        }

        cash.transfer(msg.sender, _payout);

        return true;
    }

    function payFees(uint256 _feeAmount) external returns (bool) {
        burn(msg.sender, _feeAmount);
        universe.withdraw(address(universe.getOrCreateNextDisputeWindow(false)), _feeAmount, address(0));
        feesPaid = feesPaid.add(_feeAmount);
        return true;
    }

    function buyCompleteSets(IMarket _market, uint256 _amount) external returns (bool) {
        require(universe.isContainerForMarket(_market), "Market does not belong to universe");
        uint256 _cost = _amount.mul(_market.getNumTicks());
        feesPaid = feesPaid.add(_cost / universe.getOrCacheReportingFeeDivisor());
        burn(msg.sender, _cost);
        universe.withdraw(msg.sender, _cost, address(0));
        completeSets.buyCompleteSets(msg.sender, _market, _amount);
        augur.logCompleteSetsPurchased(_market.getUniverse(), _market, msg.sender, _amount);
        _market.assertBalances();
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
    }

    function onMint(address _target, uint256 _amount) internal {
    }

    function onBurn(address _target, uint256 _amount) internal {
    }
}