pragma solidity 0.4.24;


import 'libraries/token/ERC20Token.sol';
import 'libraries/token/ERC777BaseToken.sol';


contract StandardToken is ERC20Token, ERC777BaseToken {
    // Approvals of this amount are simply considered an everlasting approval which is not decremented when transfers occur
    uint256 public constant ETERNAL_APPROVAL_VALUE = 2 ** 256 - 1;

    mapping(address => mapping(address => uint256)) internal allowed;

    constructor() internal ERC777BaseToken() {
        setInterfaceImplementation("ERC20Token", this);
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(_to != address(0), "Cannot send to 0x0");
        internalTransfer(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        uint256 _allowance = allowed[_from][msg.sender];
        require(_amount <= _allowance, "Not enough funds allowed");

        if (_allowance != ETERNAL_APPROVAL_VALUE) {
            allowed[_from][msg.sender] = _allowance.sub(_amount);
        }

        internalTransfer(_from, _to, _amount);
        return true;
    }

    function internalTransfer(address _from, address _to, uint256 _amount) internal returns (bool) {
        doSend(msg.sender, _from, _to, _amount, "", "", false);
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        approveInternal(msg.sender, _spender, _amount);
        return true;
    }

    function increaseApproval(address _spender, uint _addedValue) public returns (bool) {
        approveInternal(msg.sender, _spender, allowed[msg.sender][_spender].add(_addedValue));
        return true;
    }

    function decreaseApproval(address _spender, uint _subtractedValue) public returns (bool) {
        uint oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue > oldValue) {
            approveInternal(msg.sender, _spender, 0);
        } else {
            approveInternal(msg.sender, _spender, oldValue.sub(_subtractedValue));
        }
        return true;
    }

    function approveInternal(address _owner, address _spender, uint256 _allowance) public returns (bool) {
        allowed[_owner][_spender] = _allowance;
        emit Approval(_owner, _spender, _allowance);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowed[_owner][_spender];
    }

    function doSend(address _operator, address _from, address _to, uint256 _amount, bytes32  _data, bytes32  _operatorData, bool _preventLocking) internal {
        super.doSend(_operator, _from, _to, _amount, _data, _operatorData, _preventLocking);
        emit Transfer(_from, _to, _amount);
        onTokenTransfer(_from, _to, _amount);
    }

    function doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32  _data, bytes32  _operatorData) internal {
        super.doBurn(_operator, _tokenHolder, _amount, _data, _operatorData);
        emit Transfer(_tokenHolder, 0x0, _amount);
    }

    // Subclasses of this token generally want to send additional logs through the centralized Augur log emitter contract
    function onTokenTransfer(address _from, address _to, uint256 _value) internal returns (bool);
}
