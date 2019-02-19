pragma solidity 0.4.24;

import 'libraries/CloneFactory.sol';
import 'IAugur.sol';
import 'libraries/collections/IMap.sol';


contract MapFactory is CloneFactory {
    function createMap(IAugur _augur, address _owner) public returns (IMap) {
        IMap _map = IMap(createClone(_augur.lookup("Map")));
        _map.initialize(_owner);
        return _map;
    }
}
