pragma solidity 0.5.15;

import 'ROOT/para/ParaShareToken.sol';


contract ParaShareTokenFactory {
    function createParaShareToken() public returns (address) {
        return address(new ParaShareToken());
    }
}