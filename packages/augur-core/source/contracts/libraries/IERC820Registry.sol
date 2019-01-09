pragma solidity 0.4.24;


contract IERC820Registry {
    function getManager(address _address) public view returns(address);
    function setManager(address _address, address _newManager) public;
    function getInterfaceImplementer(address _address, bytes32 _iHash) public returns (address);
    function setInterfaceImplementer(address _address, bytes32 _iHash, address _implementer) public;
}
