pragma solidity 0.5.15;

import 'ROOT/ICash.sol';
import 'ROOT/libraries/ITyped.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';


/**
 * @title Cash
 * @dev Test contract for CASH
 */
contract Cash is VariableSupplyToken, ITyped, ICash {
    using SafeMathUint256 for uint256;

    string constant public name = "Cash";
    string constant public symbol = "CASH";

    bool public canSetDecimals = true;

    function faucet(uint256 _amount) public returns (bool) {
        mint(msg.sender, _amount);
        canSetDecimals = false;
        return true;
    }

    function setDecimals(uint8 _decimals) public returns (bool) {
        require(canSetDecimals, "Go away!");
        decimals = _decimals;
        return true;
    }

    function getTypeName() public view returns (bytes32) {
        return "Cash";
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}