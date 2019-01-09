pragma solidity 0.4.24;

import 'libraries/IERC820Registry.sol';


contract ERC820Implementer {
    IERC820Registry public erc820Registry;

    function setInterfaceImplementation(string _ifaceLabel, address _impl) internal returns (bool) {
        bytes32 _ifaceHash = keccak256(abi.encodePacked(_ifaceLabel));
        erc820Registry.setInterfaceImplementer(this, _ifaceHash, _impl);
        return true;
    }

    function interfaceAddr(address _address, string _ifaceLabel) internal returns(address) {
        bytes32 _ifaceHash = keccak256(abi.encodePacked(_ifaceLabel));
        return erc820Registry.getInterfaceImplementer(_address, _ifaceHash);
    }
}
