pragma solidity 0.5.4;

import 'libraries/IERC820Registry.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'reporting/IDisputeOverloadToken.sol';
import 'libraries/token/VariableSupplyToken.sol';
import 'libraries/Initializable.sol';


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
        augur.logDisputeOverloadTokensTransferred(universe, _from, _to, _value);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeOverloadTokensMinted(universe, _target, _amount);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        augur.logDisputeOverloadTokensBurned(universe, _target, _amount);
        return true;
    }
}
