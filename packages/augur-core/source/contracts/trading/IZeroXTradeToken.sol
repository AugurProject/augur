
pragma solidity 0.5.10;
pragma experimental ABIEncoderV2;


contract IZeroXTradeToken {

    struct AugurOrderData {
        address marketAddress;                  // Market Address
        uint256 price;                          // Price
        uint8 outcome;                          // Outcome
        uint8 orderType;                        // Order Type
        address kycToken;                       // KYC Token
    }

    function parseAssetData(bytes memory _assetData) public pure returns (AugurOrderData memory _data);
}