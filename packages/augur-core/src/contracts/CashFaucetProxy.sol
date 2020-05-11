pragma solidity 0.5.15;

import 'ROOT/libraries/token/IERC20.sol';
import 'ROOT/external/IDaiFaucet.sol';


contract CashFaucetProxy {
    constructor(IDaiFaucet faucet, IERC20 gem) public {
        faucet.gulp(address(gem));
        uint256 balance = gem.balanceOf(address(this));
        gem.transfer(msg.sender, balance);
    }
}