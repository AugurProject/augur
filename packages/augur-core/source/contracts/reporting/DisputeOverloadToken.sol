pragma solidity 0.4.24;

import 'libraries/IERC820Registry.sol';
import 'reporting/IDisputeCrowdsourcer.sol';
import 'reporting/IDisputeOverloadToken.sol';
import 'libraries/token/VariableSupplyToken.sol';
import 'libraries/Initializable.sol';


contract DisputeOverloadToken is VariableSupplyToken, IDisputeOverloadToken, Initializable {
    IDisputeCrowdsourcer disputeCrowdsourcer;

    string constant public name = "Dispute Overload Token";
    string constant public symbol = "DSOV";

    function initialize(IDisputeCrowdsourcer _disputeCrowdsourcer, address _erc820RegistryAddress) public beforeInitialized returns (bool) {
        endInitialization();
        disputeCrowdsourcer = _disputeCrowdsourcer;
        erc820Registry = IERC820Registry(_erc820RegistryAddress);
        initialize820InterfaceImplementations();
        return true;
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
        // TODO augur.logDisputeCrowdsourcerTokensTransferred(universe, _from, _to, _value);
        return true;
    }

    function onMint(address _target, uint256 _amount) internal returns (bool) {
        // TODO augur.logDisputeCrowdsourcerTokensMinted(universe, _target, _amount);
        return true;
    }

    function onBurn(address _target, uint256 _amount) internal returns (bool) {
        // TODO augur.logDisputeCrowdsourcerTokensBurned(universe, _target, _amount);
        return true;
    }
}
