pragma solidity ^0.5.10;

import 'ROOT/IAugur.sol';
import 'ROOT/libraries/token/ERC20.sol';


contract StandardTokenHelper is ERC20 {
    function faucet(uint256 _amount) public returns (bool) {
        balances[msg.sender] = balances[msg.sender].add(_amount);
        totalSupply = totalSupply.add(_amount);
        return true;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {
    }
}
