pragma solidity 0.5.10;

import 'ROOT/external/IDaiJoin.sol';
import 'ROOT/external/IDaiVat.sol';
import 'ROOT/trading/ICash.sol';


contract TestNetDaiJoin is IDaiJoin {
    IDaiVat public vat;
    ICash public dai;

    uint constant ONE = 10 ** 27;

    constructor(address vat_, address dai_) public {
        vat = IDaiVat(vat_);
        dai = ICash(dai_);
    }

    function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function join(address urn, uint wad) public {
        vat.move(address(this), urn, mul(ONE, wad));
        dai.joinBurn(msg.sender, wad);
    }

    function exit(address usr, uint wad) public {
        address urn = msg.sender;
        vat.move(urn, address(this), mul(ONE, wad));
        dai.joinMint(usr, wad);
    }
}