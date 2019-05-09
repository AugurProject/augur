pragma solidity 0.5.4;

import 'ROOT/external/IDaiVat.sol';
import 'ROOT/external/IDaiPot.sol';


contract TestNetDaiPot is IDaiPot {

    mapping (address => uint256) public pie;  // user Savings Dai

    uint256 public Pie;  // total Savings Dai

    IDaiVat public vat;  // CDP engine
    uint256  public rho;  // Time of last drip

    uint constant ONE = 10 ** 27;

    constructor(address vat_) public {
        vat = IDaiVat(vat_);
        dsr = ONE;
        chi = ONE;
    }

    function rpow(uint x, uint n, uint base) internal pure returns (uint z) {
        assembly {
            switch x case 0 {switch n case 0 {z := base} default {z := 0}}
            default {
                switch mod(n, 2) case 0 { z := base } default { z := x }
                let half := div(base, 2)  // for rounding.
                for { n := div(n, 2) } n { n := div(n,2) } {
                    let xx := mul(x, x)
                    if iszero(eq(div(xx, x), x)) { revert(0,0) }
                    let xxRound := add(xx, half)
                    if lt(xxRound, xx) { revert(0,0) }
                    x := div(xxRound, base)
                    if mod(n,2) {
                        let zx := mul(z, x)
                        if and(iszero(iszero(x)), iszero(eq(div(zx, x), z))) { revert(0,0) }
                        let zxRound := add(zx, half)
                        if lt(zxRound, zx) { revert(0,0) }
                        z := div(zxRound, base)
                    }
                }
            }
        }
    }

    function Add(uint x, int y) internal pure returns (uint z) {
        assembly {
            z := add(x, y)
            if sgt(y, 0) { if iszero(gt(z, x)) { revert(0, 0) } }
            if slt(y, 0) { if iszero(lt(z, x)) { revert(0, 0) } }
        }
    }

    function Sub(uint x, int y) internal pure returns (uint z) {
        assembly {
            z := sub(x, y)
            if slt(y, 0) { if iszero(gt(z, x)) { revert(0, 0) } }
            if sgt(y, 0) { if iszero(lt(z, x)) { revert(0, 0) } }
        }
    }

    function Mul(uint x, int y) internal pure returns (int z) {
        assembly {
            z := mul(x, y)
            if slt(x, 0) { revert(0, 0) }
            if iszero(eq(y, 0)) { if iszero(eq(sdiv(z, y), x)) { revert(0, 0) } }
        }
    }

    function Sub(uint x, uint y) internal pure returns (int z) {
        z = int(x) - int(y);
        require(int(x) >= 0 && int(y) >= 0);
    }

    function rmul(uint x, uint y) internal pure returns (uint z) {
        z = x * y;
        require(y == 0 || z / y == x);
        z = z / ONE;
    }

    function drip() public {
        require(now >= rho);
        int chi_ = Sub(rmul(rpow(dsr, now - rho, ONE), chi), chi);
        chi = Add(chi, chi_);
        rho  = uint48(now);
        vat.heal(-Mul(Pie, chi_));
    }

    function save(int wad) public {
        address guy = msg.sender;
        pie[guy] = Add(pie[guy], wad);
        Pie      = Add(Pie,      wad);
        if (wad >= 0) {
            vat.move(guy, address(this), Mul(chi, wad));
        } else {
            vat.move(address(this), guy, -Mul(chi, wad));
        }
    }
}
