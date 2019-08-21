pragma solidity 0.5.10;

import 'ROOT/libraries/IERC1820Registry.sol';
import 'ROOT/trading/IShareToken.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/reporting/IMarket.sol';
import 'ROOT/trading/IProfitLoss.sol';
import 'ROOT/IAugur.sol';


/**
 * @title Share Token
 * @notice Storage of all data associated with orders
 */
contract ShareToken is ITyped, Initializable, VariableSupplyToken, IShareToken {

    string constant public name = "Shares";
    string constant public symbol = "SHARE";

    IMarket private market;
    uint256 private outcome;

    IAugur public augur;
    address public createOrder;
    address public fillOrder;
    address public cancelOrder;
    address public completeSets;
    address public claimTradingProceeds;
    IProfitLoss public profitLoss;

    bool private shouldUpdatePL = true;

    modifier doesNotUpdatePL() {
        shouldUpdatePL = false;
        _;
        shouldUpdatePL = true;
    }

    function initialize(IAugur _augur, IMarket _market, uint256 _outcome, address _erc1820RegistryAddress) external beforeInitialized {
        endInitialization();
        market = _market;
        outcome = _outcome;
        augur = _augur;
        createOrder = _augur.lookup("CreateOrder");
        fillOrder = _augur.lookup("FillOrder");
        cancelOrder = _augur.lookup("CancelOrder");
        completeSets = _augur.lookup("CompleteSets");
        claimTradingProceeds = _augur.lookup("ClaimTradingProceeds");
        profitLoss = IProfitLoss(_augur.lookup("ProfitLoss"));
        erc1820Registry = IERC1820Registry(_erc1820RegistryAddress);
        initialize1820InterfaceImplementations();
    }

    function createShares(address _owner, uint256 _fxpValue) external returns(bool) {
        require(msg.sender == completeSets);
        mint(_owner, _fxpValue);
        return true;
    }

    function destroyShares(address _owner, uint256 _fxpValue) external returns(bool) {
        require(msg.sender == completeSets || msg.sender == claimTradingProceeds);
        burn(_owner, _fxpValue);
        return true;
    }

    function trustedOrderTransfer(address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == createOrder);
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == fillOrder);
        // We do not call ERC777 hooks here as it would allow a malicious order creator to halt trading
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens) public doesNotUpdatePL returns (bool) {
        require(msg.sender == cancelOrder);
        return internalNoHooksTransfer(_source, _destination, _attotokens);
    }

    function getTypeName() public view returns(bytes32) {
        return "ShareToken";
    }

    /**
     * @return The market associated with this Share Token
     */
    function getMarket() external view returns(IMarket) {
        return market;
    }

    /**
     * @return The outcome associated with this Share Token
     */
    function getOutcome() external view returns(uint256) {
        return outcome;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
        if (shouldUpdatePL) {
            profitLoss.recordExternalTransfer(_from, _to, _value);
        }
        augur.logShareTokensTransferred(market.getUniverse(), _from, _to, _value, balances[_from], balances[_to], outcome);
    }

    function onMint(address _target, uint256 _amount) internal {
        augur.logShareTokensMinted(market.getUniverse(), _target, _amount, totalSupply(), balances[_target], outcome);
    }

    function onBurn(address _target, uint256 _amount) internal {
        augur.logShareTokensBurned(market.getUniverse(), _target, _amount, totalSupply(), balances[_target], outcome);
    }
}
