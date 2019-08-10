pragma solidity ^0.5.10;

import 'ROOT/libraries/ReentrancyGuard.sol';


contract ReentrancyGuardHelper is ReentrancyGuard {
    function testerNonReentrant() public nonReentrant returns (bool) {
        return true;
    }

    function testerCanNotReentrant() public nonReentrant returns (bool) {
        return testerNonReentrant();
    }

    function testerReentrant() public returns (bool) {
        return true;
    }

    function testerCanReentrant() public returns (bool) {
        return testerReentrant();
    }
}
