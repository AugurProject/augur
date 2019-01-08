pragma solidity 0.4.24;

import 'libraries/ERC820Registry.sol';


// TODO
contract ERC820Implementer {
    //ERC820Registry erc820Registry = ERC820Registry(0x991a1bcb077599290d7305493c9A630c20f8b798);

    function setInterfaceImplementation(string, address) internal {
        //bytes32 _ifaceHash = keccak256(abi.encodePacked(_ifaceLabel));
        //erc820Registry.setInterfaceImplementer(this, _ifaceHash, _impl);
    }

    function interfaceAddr(address, string) internal view returns(address) {
        //bytes32 _ifaceHash = keccak256(abi.encodePacked(_ifaceLabel));
        //return erc820Registry.getInterfaceImplementer(_address, _ifaceHash);
    }

    function delegateManagement(address) internal {
        //erc820Registry.setManager(this, _newManager);
    }
}
