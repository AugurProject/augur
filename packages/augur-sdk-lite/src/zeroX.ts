import { BigNumber as BN, defaultAbiCoder, ParamType } from 'ethers/utils';
import { getAddress } from 'ethers/utils/address';
import { BigNumber } from 'bignumber.js';

const multiAssetDataAbi: ParamType[] = [
    { name: 'amounts', type: 'uint256[]' },
    { name: 'nestedAssetData', type: 'bytes[]' },
];

// Original ABI from Go
// [
//   {
//     constant: false,
//     inputs: [
//       { name: 'address', type: 'address' },
//       { name: 'ids', type: 'uint256[]' },
//       { name: 'values', type: 'uint256[]' },
//       { name: 'callbackData', type: 'bytes' },
//     ],
//     name: 'ERC1155Assets',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function',
//   },
// ];
const erc1155AssetDataAbi: ParamType[] = [
    { name: 'address', type: 'address' },
    { name: 'ids', type: 'uint256[]' },
    { name: 'values', type: 'uint256[]' },
    { name: 'callbackData', type: 'bytes' },
];

export interface OrderData {
    market: string;
    price: string;
    outcome: string;
    orderType: string;
    invalidOrder?: boolean;
}

export interface ParsedAssetDataResults {
    orderData: OrderData;
    multiAssetData: any;
}

export function parseZeroXMakerAssetData(makerAssetData: string): OrderData {
    const { orderData } = parseAssetData(makerAssetData);
    return orderData;
}

export function parseAssetData(assetData: string): ParsedAssetDataResults {
    try {
        const multiAssetData = defaultAbiCoder.decode(multiAssetDataAbi, `0x${assetData.slice(10)}`);
        const nestedAssetData = multiAssetData[1] as string[];
        const orderData = parseTradeAssetData(nestedAssetData[0]);
        return {
        orderData,
        multiAssetData
        };
    } catch(e) {
        throw new Error(`Order not in multi-asset format. Error: ${e}`);
    }
}

export function parseTradeAssetData(assetData: string): OrderData {
    // Remove the first 10 characters because assetData is prefixed in 0x, and then contains a selector.
    // Drop the selector and add back to 0x prefix so the AbiDecoder will treat it properly as hex.
    const decoded = defaultAbiCoder.decode(erc1155AssetDataAbi, `0x${assetData.slice(10)}`);
    const ids = decoded[1] as BigNumber[];

    if (ids.length !== 1) {
        throw new Error('More than one ID passed into 0x order');
    }

    // No idea why the BigNumber instance returned here just wont serialize to hex
    // Since `ids[n]` is a BigNumber, it is possible for the higher order bits
    // to all be 0. This will result in the tokenid serialization here to be
    // less than the expected full 32 bytes (64 characters in hex).
    const tokenid = new BN(`${ids[0].toString()}`).toHexString().substr(2).padStart(64, '0');

    // From ZeroXTrade.sol
    //  assembly {
    //      _market := shr(96, and(_tokenId, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000000))
    //      _price := shr(16,  and(_tokenId, 0x0000000000000000000000000000000000000000FFFFFFFFFFFFFFFFFFFF0000))
    //      _outcome := shr(8, and(_tokenId, 0x000000000000000000000000000000000000000000000000000000000000FF00))
    //      _type :=           and(_tokenId, 0x00000000000000000000000000000000000000000000000000000000000000FF)
    //  }
    return {
        market: getAddress(`0x${tokenid.substr(0, 40)}`),
        price: `0x${tokenid.substr(40, 20)}`,
        outcome: `0x${tokenid.substr(60, 2)}`,
        orderType: `0x${tokenid.substr(62, 2)}`,
    };
}