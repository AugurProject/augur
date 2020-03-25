pragma solidity 0.5.15;

// a library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

// range: [0, 2**112 - 1] (theoretical upper bound of 2**112 - (1 / 2**112) does not apply in this setting)
// resolution: 1 / 2**112

library UQ112x112 {
    uint224 constant Q112 = 2**112;

    // encode a uint112 as a UQ112x112
    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112; // never overflows
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }

    // multiply a UQ112x112 by a uint, returning a UQ112x112
    function uqmul(uint224 x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = uint(x) * y) / y == uint(x), "uqmul-overflow");
    }

    // decode a UQ112x112 into a uint
    function decode(uint y) internal pure returns (uint z) {
        z = y / uint(Q112);
    }
}
