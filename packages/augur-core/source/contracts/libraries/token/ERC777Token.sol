pragma solidity 0.4.24;


contract ERC777Token {
    function totalSupply() public view returns (uint256);
    function balanceOf(address _owner) public view returns (uint256);

    function defaultOperators() public view returns (address[] memory);
    function isOperatorFor(address _operator, address _tokenHolder) public view returns (bool);
    function authorizeOperator(address _operator) public returns (bool);
    function revokeOperator(address _operator) public returns (bool);

    function send(address _to, uint256 _amount, bytes32 _data) public returns (bool);
    function operatorSend(address _from, address _to, uint256 _amount, bytes32 _data, bytes32 _operatorData) public returns (bool);

    // Note: We choose to disallow manual burning since according to spec this would alter the total supply as well and that does not play cleanly with some of our token tracking and dependencies. ERC777 states we MAY dissallow burning in this way.
    //function burn(uint256 _amount, bytes32 _data) public returns (bool);
    //function operatorBurn(address _from, uint256 _amount, bytes32 _data, bytes32 _operatorData) public;

    event Sent(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes32 data,
        bytes32 operatorData
    );

    event Minted(address indexed operator, address indexed to, uint256 amount, bytes32 operatorData);
    event Burned(address indexed operator, address indexed from, uint256 amount, bytes32 data, bytes32 operatorData);
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);
}
