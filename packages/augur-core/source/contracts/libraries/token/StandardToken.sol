pragma solidity 0.5.4;


import 'ROOT/libraries/token/ERC777.sol';


contract StandardToken is ERC777 {

    function initialize1820InterfaceImplementations() internal returns (bool) {
        super.initialize1820InterfaceImplementations();
        erc1820Registry.setInterfaceImplementer(address(this), keccak256("ERC20Token"), address(this));
        return true;
    }

    function noHooksTransfer(address recipient, uint256 amount) public returns (bool) {
        internalNoHooksTransfer(msg.sender, recipient, amount);
        return true;
    }

    function internalNoHooksTransfer(address from, address recipient, uint256 amount) internal returns (bool) {
        _transfer(from, recipient, amount, false);
        return true;
    }

    function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
        uint256 _newValue = _allowances[msg.sender][_spender].add(_addedValue);
        _approve(msg.sender, _spender, _newValue);
        return true;
    }

    function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
        uint _oldValue = _allowances[msg.sender][_spender];
        if (_subtractedValue > _oldValue) {
            _approve(msg.sender, _spender, 0);
        } else {
            _approve(msg.sender, _spender, _oldValue.sub(_subtractedValue));
        }
        return true;
    }
}
