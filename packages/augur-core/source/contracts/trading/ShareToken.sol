pragma solidity 0.4.24;

import 'libraries/IERC820Registry.sol';
import 'trading/IShareToken.sol';
import 'libraries/token/VariableSupplyToken.sol';
import 'libraries/ITyped.sol';
import 'libraries/Initializable.sol';
import 'reporting/IMarket.sol';
import 'IAugur.sol';


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

    function initialize(IAugur _augur, IMarket _market, uint256 _outcome, address _erc820RegistryAddress) external beforeInitialized returns(bool) {
        endInitialization();
        market = _market;
        outcome = _outcome;
        augur = _augur;
        createOrder = _augur.lookup("CreateOrder");
        fillOrder = _augur.lookup("FillOrder");
        cancelOrder = _augur.lookup("CancelOrder");
        completeSets = _augur.lookup("CompleteSets");
        claimTradingProceeds = _augur.lookup("ClaimTradingProceeds");
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
        return true;
    }

    function createShares(address _owner, uint256 _fxpValue) external afterInitialized returns(bool) {
        require(msg.sender == completeSets);
        mint(_owner, _fxpValue);
        return true;
    }

    function destroyShares(address _owner, uint256 _fxpValue) external afterInitialized returns(bool) {
        require(msg.sender == completeSets || msg.sender == claimTradingProceeds);
        burn(_owner, _fxpValue);
        return true;
    }

    function trustedOrderTransfer(address _source, address _destination, uint256 _attotokens) public afterInitialized returns (bool) {
        require(msg.sender == createOrder);
        return internalTransfer(_source, _destination, _attotokens, true);
    }

    function trustedFillOrderTransfer(address _source, address _destination, uint256 _attotokens) public afterInitialized returns (bool) {
        require(msg.sender == fillOrder);
        // We do not call ERC777 hooks here as it would allow a malicious order creator to halt trading
        return internalTransfer(_source, _destination, _attotokens, false);
    }

    function trustedCancelOrderTransfer(address _source, address _destination, uint256 _attotokens) public afterInitialized returns (bool) {
        require(msg.sender == cancelOrder);
        return internalTransfer(_source, _destination, _attotokens, true);
    }

    function getTypeName() public view returns(bytes32) {
        return "ShareToken";
    }

    function getMarket() external view returns(IMarket) {
        return market;
    }

    function getOutcome() external view returns(uint256) {
        return outcome;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logShareTokensTransferred(market.getUniverse(), _from, _to, _value);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logShareTokenMinted(market.getUniverse(), _target, _amount);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logShareTokenBurned(market.getUniverse(), _target, _amount);
        return true;
    }
}
