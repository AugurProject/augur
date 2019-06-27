pragma solidity ^0.5.4;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/StandardToken.sol';


contract StandardTokenHelper is StandardToken {
    function initialize(IAugur _augur) public returns (bool) {
        erc1820Registry = IERC1820Registry(_augur.lookup("ERC1820Registry"));
        initialize1820InterfaceImplementations();
        return true;
    }

    function faucet(uint256 _amount) public returns (bool) {
        balances[msg.sender] = balances[msg.sender].add(_amount);
        supply = supply.add(_amount);
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
    }
}
