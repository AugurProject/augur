pragma solidity 0.5.4;

import 'ROOT/libraries/IERC820Registry.sol';


contract ERC820Implementer {
    IERC820Registry public erc820Registry;

    function setInterfaceImplementation(string memory _ifaceLabel, address _impl) internal returns (bool) {
        bytes32 _ifaceHash = keccak256(abi.encodePacked(_ifaceLabel));
        erc820Registry.setInterfaceImplementer(address(this), _ifaceHash, _impl);
        return true;
    }

    function interfaceAddr(address _address, string memory _ifaceLabel) internal returns(address) {
        bytes32 _ifaceHash = keccak256(abi.encodePacked(_ifaceLabel));
        return erc820Registry.getInterfaceImplementer(_address, _ifaceHash);
    }
}
