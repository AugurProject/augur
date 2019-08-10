pragma solidity 0.5.10;


contract ERC777TokensRegistry {
    mapping(address => uint256) public numSends;
    mapping(address => bytes) public lastSendData;

    mapping(address => uint256) public numReceives;
    mapping(address => bytes) public lastReceiveData;

    bytes32 constant ERC1820_ACCEPT_MAGIC = keccak256(abi.encodePacked("ERC1820_ACCEPT_MAGIC"));
    bytes32 constant ERC777_SENDER = keccak256("ERC777TokensSender");
    bytes32 constant ERC777_RECIPIENT = keccak256("ERC777TokensRecipient");

    function canImplementInterfaceForAddress(bytes32 interfaceHash, address addr) view public returns(bytes32) {
        if (interfaceHash == ERC777_SENDER || interfaceHash == ERC777_RECIPIENT) {
            return ERC1820_ACCEPT_MAGIC;
        }
        return bytes32(0);
    }

    function tokensToSend(address operator, address from, address to, uint256 amount, bytes calldata data, bytes calldata operatorData) external {
        numSends[from] += 1;
        lastSendData[from] = data;
    }

    function tokensReceived(address operator, address from, address to, uint256 amount, bytes calldata data, bytes calldata operatorData) external {
        numReceives[to] += 1;
        lastReceiveData[to] = data;
    }

    function getNumSends(address _address) public view returns (uint256) {
        return numSends[_address];
    }

    function getNumReceives(address _address) public view returns (uint256) {
        return numReceives[_address];
    }

    function getLastSendData(address _address) public view returns (bytes memory) {
        return lastSendData[_address];
    }

    function getLastReceiveData(address _address) public view returns (bytes memory) {
        return lastReceiveData[_address];
    }
}
