pragma solidity 0.5.15;

import 'ROOT/para/ParaRepOracle.sol';


contract ParaRepOracleFactory {
    function createParaRepOracle() public returns (address) {
        return address(new ParaRepOracle());
    }
}