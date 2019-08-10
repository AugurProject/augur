pragma solidity 0.5.10;

import 'ROOT/libraries/Ownable.sol';
import 'ROOT/libraries/Initializable.sol';
import 'ROOT/libraries/collections/IMap.sol';


// Provides a mapping that has a count and more control over the behavior of Key errors. Additionally allows for a clean way to clear an existing map by simply creating a new one on owning contracts.
contract Map is Ownable, Initializable, IMap {
    mapping(bytes32 => address) private items;
    uint256 private count;

    function initialize(address _owner) public beforeInitialized {
        endInitialization();
        owner = _owner;
    }

    function add(bytes32 _key, address _value) public onlyOwner returns (bool) {
        require(_value != address(0));
        if (contains(_key)) {
            return false;
        }
        items[_key] = _value;
        count += 1;
        return true;
    }

    function remove(bytes32 _key) public onlyOwner returns (bool) {
        if (!contains(_key)) {
            return false;
        }
        delete items[_key];
        count -= 1;
        return true;
    }

    function get(bytes32 _key) public view returns (address) {
        address _value = items[_key];
        require(_value != address(0));
        return _value;
    }

    function getAsAddressOrZero(bytes32 _key) public view returns (address) {
        return items[_key];
    }

    function contains(bytes32 _key) public view returns (bool) {
        return items[_key] != address(0);
    }

    function getCount() public view returns (uint256) {
        return count;
    }

    function onTransferOwnership(address, address) internal {
    }
}
