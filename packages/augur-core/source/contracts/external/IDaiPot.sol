pragma solidity 0.5.4;


contract IDaiPot {
    uint256 public dsr;  // The Dai Savings Rate
    uint256 public chi;  // The Rate Accumulator

    // TODO this will change to join/exit in a future update
    function save(int wad) public;
}
