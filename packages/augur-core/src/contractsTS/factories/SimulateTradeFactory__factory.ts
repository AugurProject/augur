/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";

import type { SimulateTradeFactory } from "../SimulateTradeFactory";

export class SimulateTradeFactory__factory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SimulateTradeFactory {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as SimulateTradeFactory;
  }
}

const _abi = [
  {
    constant: false,
    inputs: [],
    name: "createSimulateTrade",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
