/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { SideChainZeroXTrade } from "../SideChainZeroXTrade";

export class SideChainZeroXTrade__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SideChainZeroXTrade {
    return new Contract(address, _abi, signerOrProvider) as SideChainZeroXTrade;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback",
  },
  {
    constant: true,
    inputs: [],
    name: "EIP1271_ORDER_WITH_HASH_SELECTOR",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "EIP712_DOMAIN_HASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "askBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "augur",
    outputs: [
      {
        internalType: "contract ISideChainAugur",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "augurTrading",
    outputs: [
      {
        internalType: "contract ISideChainAugurTrading",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "balances_",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
    ],
    name: "bidBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order[]",
        name: "_orders",
        type: "tuple[]",
      },
      {
        internalType: "bytes[]",
        name: "_signatures",
        type: "bytes[]",
      },
      {
        internalType: "uint256",
        name: "_maxProtocolFeeDai",
        type: "uint256",
      },
    ],
    name: "cancelOrders",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "cash",
    outputs: [
      {
        internalType: "contract ICash",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
    ],
    name: "cashAvailableForTransferFrom",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_attoshares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_expirationTimeSeconds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_salt",
        type: "uint256",
      },
    ],
    name: "createZeroXOrder",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "_zeroXOrder",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "_orderHash",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_maker",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_attoshares",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_expirationTimeSeconds",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_salt",
        type: "uint256",
      },
    ],
    name: "createZeroXOrderFor",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "_zeroXOrder",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "_orderHash",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "_order",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "creatorHasFundsForTrade",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes",
        name: "_assetData",
        type: "bytes",
      },
    ],
    name: "decodeAssetData",
    outputs: [
      {
        internalType: "bytes4",
        name: "_assetProxyId",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_tokenValues",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_callbackData",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes",
        name: "_assetData",
        type: "bytes",
      },
    ],
    name: "decodeTradeAssetData",
    outputs: [
      {
        internalType: "bytes4",
        name: "_assetProxyId",
        type: "bytes4",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_tokenIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "_tokenValues",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "_callbackData",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
    ],
    name: "encodeAssetData",
    outputs: [
      {
        internalType: "bytes",
        name: "_assetData",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "_zeroXOrder",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "_orderHash",
        type: "bytes32",
      },
    ],
    name: "encodeEIP1271OrderWithHash",
    outputs: [
      {
        internalType: "bytes",
        name: "encoded",
        type: "bytes",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "exchange",
    outputs: [
      {
        internalType: "contract IExchange",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "fillOrder",
    outputs: [
      {
        internalType: "contract ISideChainFillOrder",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getInitialized",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
    ],
    name: "getTokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "_order",
        type: "tuple",
      },
    ],
    name: "getTokenIdFromOrder",
    outputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getTransferFromAllowed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes",
        name: "_assetData",
        type: "bytes",
      },
    ],
    name: "getZeroXTradeTokenData",
    outputs: [
      {
        internalType: "contract IERC1155",
        name: "_token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "contract ISideChainAugur",
        name: "_augur",
        type: "address",
      },
      {
        internalType: "contract ISideChainAugurTrading",
        name: "_augurTrading",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "marketGetter",
    outputs: [
      {
        internalType: "contract IMarketGetter",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order",
        name: "_order",
        type: "tuple",
      },
    ],
    name: "parseOrderData",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "marketAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "outcome",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "orderType",
            type: "uint8",
          },
        ],
        internalType: "struct IZeroXTrade.AugurOrderData",
        name: "_data",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "shareToken",
    outputs: [
      {
        internalType: "contract ISideChainShareToken",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "token0IsCash",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_requestedFillAmount",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_fingerprint",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_tradeGroupId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_maxProtocolFeeDai",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxTrades",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "makerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "takerAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "feeRecipientAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "senderAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "makerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerAssetAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "makerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "takerFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expirationTimeSeconds",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "salt",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "makerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "makerFeeAssetData",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "takerFeeAssetData",
            type: "bytes",
          },
        ],
        internalType: "struct IExchange.Order[]",
        name: "_orders",
        type: "tuple[]",
      },
      {
        internalType: "bytes[]",
        name: "_signatures",
        type: "bytes[]",
      },
    ],
    name: "trade",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "unpackTokenId",
    outputs: [
      {
        internalType: "address",
        name: "_market",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_outcome",
        type: "uint8",
      },
      {
        internalType: "uint8",
        name: "_type",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
];
