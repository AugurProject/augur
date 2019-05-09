pragma solidity 0.5.4;

import 'ROOT/external/IDaiVat.sol';


contract TestNetDaiVat is IDaiVat {
    mapping (address => uint256) public dai;  // [rad]
    mapping(address => mapping (address => uint)) public can;

    function add(uint x, int y) internal pure returns (uint z) {
        z = x + uint(y);
        require(y >= 0 || z <= x);
        require(y <= 0 || z >= x);
    }

    function sub(uint x, int y) internal pure returns (uint z) {
        z = x - uint(y);
        require(y <= 0 || z <= x);
        require(y >= 0 || z >= x);
    }

    function hope(address usr) public { can[msg.sender][usr] = 1; }
    function nope(address usr) public { can[msg.sender][usr] = 0; }
    function wish(address bit, address usr) internal view returns (bool) {
        return bit == usr || can[bit][usr] == 1;
    }

    function move(address src, address dst, int256 rad) public {
        require(wish(src, msg.sender));
        dai[src] = sub(dai[src], rad);
        dai[dst] = add(dai[dst], rad);
    }

    function heal(int rad) public {
        dai[msg.sender] = sub(dai[msg.sender], rad);
    }

    function faucet(address _target, uint256 _amount) public {
        dai[_target] = add(dai[_target], int(_amount));
    }
}
