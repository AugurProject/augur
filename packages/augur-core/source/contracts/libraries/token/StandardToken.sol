pragma solidity 0.5.4;

import 'ROOT/libraries/token/IStandardToken.sol';
import 'ROOT/libraries/token/ERC777.sol';


/**
 * @title Standard Token
 * @notice An ERC20 / ERC777 wrapper which adds the ability to increase or decrease approvals and do no-ERC777-hook ERC20 transfers
 * @dev internalNoHooksTransfer should be used in any case where a transfer occurs to an account which is not the msg.sender of the triggering TX
 */
contract StandardToken is ERC777, IStandardToken {

    function initialize1820InterfaceImplementations() internal returns (bool) {
        super.initialize1820InterfaceImplementations();
        erc1820Registry.setInterfaceImplementer(address(this), keccak256("ERC20Token"), address(this));
        return true;
    }

    /**
     * @notice ERC20 Transfer without calling ERC777 sender or recipient hooks
     * @param _recipient The recipient of tokens
     * @param _amount The amount of tokens to transfer
     * @return bool Returns true
     */
    function noHooksTransfer(address _recipient, uint256 _amount) external returns (bool) {
        internalNoHooksTransfer(msg.sender, _recipient, _amount);
        return true;
    }

    function internalNoHooksTransfer(address _from, address _recipient, uint256 _amount) internal returns (bool) {
        _transfer(_from, _recipient, _amount, false);
        return true;
    }

    /**
     * @notice ERC20 allowance amount increase
     * @param _spender The approved spender address
     * @param _addedValue The amount of tokens to add to the spender's existing allowance
     * @return bool Returns true
     */
    function increaseApproval(address _spender, uint256 _addedValue) public returns (bool) {
        uint256 _newValue = _allowances[msg.sender][_spender].add(_addedValue);
        _approve(msg.sender, _spender, _newValue);
        return true;
    }

    /**
     * @notice ERC20 allowance amount decrease
     * @param _spender The approved spender address
     * @param _subtractedValue The amount of tokens to subtract from the spender's existing allowance
     * @return bool Returns true
     */
    function decreaseApproval(address _spender, uint256 _subtractedValue) public returns (bool) {
        uint256 _oldValue = _allowances[msg.sender][_spender];
        if (_subtractedValue > _oldValue) {
            _approve(msg.sender, _spender, 0);
        } else {
            _approve(msg.sender, _spender, _oldValue.sub(_subtractedValue));
        }
        return true;
    }
}
