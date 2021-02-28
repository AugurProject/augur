pragma solidity 0.5.15;

import 'ROOT/symbiote/ISymbioteShareToken.sol';
import 'ROOT/libraries/token/VariableSupplyToken.sol';


contract SymbioteShareToken is VariableSupplyToken, ISymbioteShareToken {
    
    string public name;
    string public symbol;

    address public hatchery;

    constructor(string memory _symbol, string memory _name, address _hatchery) public {
        symbol = _symbol;
        name = _name;
        hatchery = _hatchery;
    }

    function trustedTransfer(address _from, address _to, uint256 _amount) external {
        require(msg.sender == hatchery, "SymbioteShareToken: trustedTransfer is only callable by the hatchery");
        _transfer(_from, _to, _amount);
    }

    function trustedMint(address _target, uint256 _amount) external {
        require(msg.sender == hatchery, "SymbioteShareToken: trustedMint is only callable by the hatchery");
        mint(_target, _amount);
    }

    function trustedBurn(address _target, uint256 _amount) external {
        require(msg.sender == hatchery, "SymbioteShareToken: trustedBurn is only callable by the hatchery");
        burn(_target, _amount);
    }

    function trustedBurnAll(address _target) external returns (uint256){
        require(msg.sender == hatchery, "SymbioteShareToken: trustedBurn is only callable by the hatchery");
        uint256 _balance = balanceOf(_target);
        burn(_target, _balance);
        return _balance;
    }

    function onTokenTransfer(address _from, address _to, uint256 _value) internal {}
}