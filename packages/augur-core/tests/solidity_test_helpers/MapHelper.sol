pragma solidity ^0.5.10;

import 'ROOT/libraries/collections/Map.sol';
import 'ROOT/factories/MapFactory.sol';


contract MapHelper {
    IMap private map;

    function init(IAugur _augur) public returns (bool) {
        map = MapFactory(_augur.lookup("MapFactory")).createMap(_augur, address(this));
    }

    function add(bytes32 _key, address _value) public returns (bool) {
        return map.add(_key, _value);
    }

    function remove(bytes32 _key) public returns (bool) {
        return map.remove(_key);
    }

    function getAddressOrZero(bytes32 _key) public view returns (address) {
        return map.getAsAddressOrZero(_key);
    }

    function get(bytes32 _key) public view returns (address) {
        return map.get(_key);
    }

    function contains(bytes32 _key) public view returns (bool) {
        return map.contains(_key);
    }

    function getCount() public view returns (uint256) {
        return map.getCount();
    }
}
