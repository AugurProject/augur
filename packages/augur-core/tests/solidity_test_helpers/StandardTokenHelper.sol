pragma solidity ^0.4.24;

import 'IAugur.sol';
import 'libraries/token/StandardToken.sol';


contract StandardTokenHelper is StandardToken {
    function initialize(IAugur _augur) public returns (bool) {
        erc820Registry = IERC820Registry(_augur.lookup("ERC820Registry"));
        initialize820InterfaceImplementations();
        return true;
    }

    function faucet(uint256 _amount) public returns (bool) {
        balances[msg.sender] = balances[msg.sender].add(_amount);
        supply = supply.add(_amount);
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool) {
        return true;
    }
}
