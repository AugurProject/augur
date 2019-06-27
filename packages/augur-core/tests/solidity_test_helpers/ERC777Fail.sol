pragma solidity 0.5.4;


contract ERC777Fail {
    bytes32 constant ERC1820_ACCEPT_MAGIC = keccak256(abi.encodePacked("ERC1820_ACCEPT_MAGIC"));
    bytes32 constant ERC777_SENDER = keccak256("ERC777TokensSender");
    bytes32 constant ERC777_RECIPIENT = keccak256("ERC777TokensRecipient");

    bool public shouldFail = false;

    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) view public returns(bytes32) {
        if (interfaceHash == ERC777_SENDER || interfaceHash == ERC777_RECIPIENT) {
            return ERC1820_ACCEPT_MAGIC;
        }
        return bytes32(0);
    }

    function tokensToSend(address operator, address from, address to, uint256 amount, bytes calldata data, bytes calldata operatorData) external {
        if (shouldFail) {
            revert();
        }
    }

    function tokensReceived(address operator, address from, address to, uint256 amount, bytes calldata data, bytes calldata operatorData) external {
        if (shouldFail) {
            revert();
        }
    }

    function setFail(bool _shouldFail) external {
        shouldFail = _shouldFail;
    }
}
