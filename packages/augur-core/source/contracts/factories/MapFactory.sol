pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'IAugur.sol';
import 'libraries/collections/Map.sol';


contract MapFactory is CloneFactory {
    function createMap(IAugur _augur, address _owner) public returns (Map) {
        Map _map = Map(createClone(_augur.lookup("Map")));
        _map.initialize(_owner);
        return _map;
    }
}
