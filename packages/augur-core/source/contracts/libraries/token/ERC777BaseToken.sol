pragma solidity 0.4.24;

import 'libraries/ERC820Implementer.sol';
import 'libraries/token/ERC777Token.sol';
import 'libraries/token/ERC777TokensSender.sol';
import 'libraries/token/ERC777TokensRecipient.sol';
import 'libraries/ContractExists.sol';
import 'libraries/math/SafeMathUint256.sol';


contract ERC777BaseToken is ERC777Token, ERC820Implementer {
    using SafeMathUint256 for uint256;
    using ContractExists for address;

    mapping(address => uint) internal balances;
    uint256 public supply;

    uint256 constant public granularity = 1;
    uint8 constant public decimals = 18;

    address[] internal initialDefaultOperators;
    mapping(address => bool) internal isDefaultOperator;
    mapping(address => mapping(address => bool)) internal revokedDefaultOperator;
    mapping(address => mapping(address => bool)) internal authorizedOperators;

    constructor() internal {
        setInterfaceImplementation("ERC777Token", this);
    }

    function totalSupply() public view returns (uint256) {
        return supply;
    }

    function balanceOf(address _tokenHolder) public view returns (uint256) {
        return balances[_tokenHolder];
    }

    function defaultOperators() public view returns (address[] memory) {
        return initialDefaultOperators;
    }

    function send(address _to, uint256 _amount, bytes32 _data) public {
        doSend(msg.sender, msg.sender, _to, _amount, _data, "", true);
    }

    function authorizeOperator(address _operator) public {
        require(_operator != msg.sender, "Cannot authorize yourself as an operator");

        if (isDefaultOperator[_operator]) {
            revokedDefaultOperator[_operator][msg.sender] = false;
        } else {
            authorizedOperators[_operator][msg.sender] = true;
        }
        emit AuthorizedOperator(_operator, msg.sender);
    }

    function revokeOperator(address _operator) public {
        require(_operator != msg.sender, "Cannot revoke yourself as an operator");

        if (isDefaultOperator[_operator]) {
            revokedDefaultOperator[_operator][msg.sender] = true;
        } else {
            authorizedOperators[_operator][msg.sender] = false;
        }

        emit RevokedOperator(_operator, msg.sender);
    }

    function isOperatorFor(address _operator, address _tokenHolder) public view returns (bool) {
        return (_operator == _tokenHolder // solium-disable-line operator-whitespace
            || authorizedOperators[_operator][_tokenHolder]
            || (isDefaultOperator[_operator] && !revokedDefaultOperator[_operator][_tokenHolder]));
    }

    function operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) public {
        require(isOperatorFor(msg.sender, _from), "Not an operator");
        doSend(msg.sender, _from, _to, _amount, _data, _operatorData, true);
    }

    function doSend(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking) internal {
        callSender(_operator, _from, _to, _amount, _data, _operatorData);

        require(_to != address(0), "Cannot send to 0x0");
        require(balances[_from] >= _amount, "Not enough funds");

        balances[_from] = balances[_from].sub(_amount);
        balances[_to] = balances[_to].add(_amount);

        callRecipient(_operator, _from, _to, _amount, _data, _operatorData, _preventLocking);

        emit Sent(_operator, _from, _to, _amount, _data, _operatorData);
    }

    function doBurn(address _operator, address _tokenHolder, uint256 _amount, bytes32 _data, bytes32 _operatorData) internal {
        callSender(_operator, _tokenHolder, 0x0, _amount, _data, _operatorData);

        require(balanceOf(_tokenHolder) >= _amount, "Not enough funds");

        balances[_tokenHolder] = balances[_tokenHolder].sub(_amount);
        supply = supply.sub(_amount);

        emit Burned(_operator, _tokenHolder, _amount, _data, _operatorData);
    }

    function callRecipient(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData, bool _preventLocking) internal {
        address recipientImplementation = interfaceAddr(_to, "ERC777TokensRecipient");
        if (recipientImplementation != 0) {
            ERC777TokensRecipient(recipientImplementation).tokensReceived(_operator, _from, _to, _amount, _data, _operatorData);
        } else if (_preventLocking) {
            require(!_to.exists(), "Cannot send to contract without ERC777TokensRecipient");
        }
    }

    function callSender(address _operator, address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) internal {
        address senderImplementation = interfaceAddr(_from, "ERC777TokensSender");
        if (senderImplementation == 0) {
            return;
        }
        ERC777TokensSender(senderImplementation).tokensToSend(_operator, _from, _to, _amount, _data, _operatorData);
    }
}
