pragma solidity 0.5.4;

import 'ROOT/libraries/ContractExists.sol';
import 'ROOT/TEST/MockVariableSupplyToken.sol';


contract MockLegacyReputationToken is MockVariableSupplyToken {
    using ContractExists for address;
    uint256 private faucetAmountValue;

    function getFaucetAmountValue() public returns(uint256) {
        return faucetAmountValue;
    }

    function faucet(uint256 _amount) public returns (bool) {
        faucetAmountValue = _amount;
        return true;
    }
}
