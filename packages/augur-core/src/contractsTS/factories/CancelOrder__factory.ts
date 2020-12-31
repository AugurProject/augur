/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { CancelOrder } from "../CancelOrder";

export class CancelOrder__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CancelOrder {
    return new Contract(address, _abi, signerOrProvider) as CancelOrder;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [],
    name: "augur",
    outputs: [
      {
        internalType: "contract IAugur",
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
        internalType: "contract IAugurTrading",
        name: "",
        type: "address",
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
        internalType: "bytes32",
        name: "_orderId",
        type: "bytes32",
      },
    ],
    name: "cancelOrder",
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
    constant: false,
    inputs: [
      {
        internalType: "bytes32[]",
        name: "_orderIds",
        type: "bytes32[]",
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
    constant: false,
    inputs: [
      {
        internalType: "contract IAugur",
        name: "_augur",
        type: "address",
      },
      {
        internalType: "contract IAugurTrading",
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
    inputs: [],
    name: "orders",
    outputs: [
      {
        internalType: "contract IOrders",
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
    name: "profitLoss",
    outputs: [
      {
        internalType: "contract IProfitLoss",
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
    name: "shareToken",
    outputs: [
      {
        internalType: "contract IShareToken",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
