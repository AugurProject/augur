pragma solidity 0.5.4;

import 'ROOT/libraries/IERC820Registry.sol';
import 'ROOT/reporting/IDisputeCrowdsourcer.sol';
import 'ROOT/reporting/IDisputeOverloadToken.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';
import 'ROOT/libraries/Initializable.sol';


contract DisputeOverloadToken is VariableSupplyToken, IDisputeOverloadToken, Initializable {
    IDisputeCrowdsourcer public disputeCrowdsourcer;
    IUniverse public universe;
    IAugur public augur;

    string constant public name = "Dispute Overload Token";
    string constant public symbol = "DSOV";

    function initialize(IAugur _augur, IDisputeCrowdsourcer _disputeCrowdsourcer, address _erc820RegistryAddress) public beforeInitialized returns (bool) {
        endInitialization();
        disputeCrowdsourcer = _disputeCrowdsourcer;
        augur = _augur;
        universe = disputeCrowdsourcer.getMarket().getUniverse();
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
        return true;
    }

    function getMarket() public returns (IMarket) {
        return disputeCrowdsourcer.getMarket();
    }

    function trustedMint(address _target, uint256 _amount) public returns (bool) {
        require(IDisputeCrowdsourcer(msg.sender) == disputeCrowdsourcer);
        mint(_target, _amount);
        return true;
    }

    function trustedBurn(address _target, uint256 _amount) public returns (bool) {
        require(IDisputeCrowdsourcer(msg.sender) == disputeCrowdsourcer);
        burn(_target, _amount);
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        augur.logDisputeOverloadTokensTransferred(universe, _from, _to, _value, balances[_from], balances[_to]);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeOverloadTokensMinted(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeOverloadTokensBurned(universe, _target, _amount, totalSupply(), balances[_target]);
        return true;
    }
}
