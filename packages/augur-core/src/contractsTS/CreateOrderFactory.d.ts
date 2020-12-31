/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface CreateOrderFactoryInterface extends ethers.utils.Interface {
  functions: {
    "createCreateOrder()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createCreateOrder",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "createCreateOrder",
    data: BytesLike
  ): Result;

  events: {};
}

export class CreateOrderFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  listeners<T, G>(
    eventFilter?: TypedEventFilter<T, G>
  ): Array<TypedListener<T, G>>;
  off<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  on<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  once<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  removeListener<T, G>(
    eventFilter: TypedEventFilter<T, G>,
    listener: TypedListener<T, G>
  ): this;
  removeAllListeners<T, G>(eventFilter: TypedEventFilter<T, G>): this;

  queryFilter<T, G>(
    event: TypedEventFilter<T, G>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<T & G>>>;

  interface: CreateOrderFactoryInterface;

  functions: {
    createCreateOrder(overrides?: Overrides): Promise<ContractTransaction>;

    "createCreateOrder()"(overrides?: Overrides): Promise<ContractTransaction>;
  };

  createCreateOrder(overrides?: Overrides): Promise<ContractTransaction>;

  "createCreateOrder()"(overrides?: Overrides): Promise<ContractTransaction>;

  callStatic: {
    createCreateOrder(overrides?: CallOverrides): Promise<string>;

    "createCreateOrder()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    createCreateOrder(overrides?: Overrides): Promise<BigNumber>;

    "createCreateOrder()"(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    createCreateOrder(overrides?: Overrides): Promise<PopulatedTransaction>;

    "createCreateOrder()"(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}
