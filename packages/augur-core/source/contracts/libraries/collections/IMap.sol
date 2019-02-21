pragma solidity 0.5.4;


contract IMap {
    function initialize(address _owner) public returns (bool);
    function add(bytes32 _key, address _value) public returns (bool);
    function remove(bytes32 _key) public returns (bool);
    function get(bytes32 _key) public view returns (address);
    function getAsAddressOrZero(bytes32 _key) public view returns (address);
    function contains(bytes32 _key) public view returns (bool);
    function getCount() public view returns (uint256);
}
