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

interface AugurPushBridgeInterface extends ethers.utils.Interface {
  functions: {
    "bridgeMarket(address)": FunctionFragment;
    "bridgeReportingFee(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "bridgeMarket",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "bridgeReportingFee",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "bridgeMarket",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bridgeReportingFee",
    data: BytesLike
  ): Result;

  events: {};
}

export class AugurPushBridge extends Contract {
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

  interface: AugurPushBridgeInterface;

  functions: {
    bridgeMarket(
      _market: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "bridgeMarket(address)"(
      _market: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    bridgeReportingFee(
      _universe: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "bridgeReportingFee(address)"(
      _universe: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  bridgeMarket(
    _market: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "bridgeMarket(address)"(
    _market: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  bridgeReportingFee(
    _universe: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "bridgeReportingFee(address)"(
    _universe: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    bridgeMarket(
      _market: string,
      overrides?: CallOverrides
    ): Promise<
      [
        boolean,
        boolean,
        string,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        BigNumber[],
        BigNumber
      ] & {
        finalized: boolean;
        invalid: boolean;
        owner: string;
        feeDivisor: BigNumber;
        universe: string;
        numTicks: BigNumber;
        numOutcomes: BigNumber;
        winningPayout: BigNumber[];
        affiliateFeeDivisor: BigNumber;
      }
    >;

    "bridgeMarket(address)"(
      _market: string,
      overrides?: CallOverrides
    ): Promise<
      [
        boolean,
        boolean,
        string,
        BigNumber,
        string,
        BigNumber,
        BigNumber,
        BigNumber[],
        BigNumber
      ] & {
        finalized: boolean;
        invalid: boolean;
        owner: string;
        feeDivisor: BigNumber;
        universe: string;
        numTicks: BigNumber;
        numOutcomes: BigNumber;
        winningPayout: BigNumber[];
        affiliateFeeDivisor: BigNumber;
      }
    >;

    bridgeReportingFee(
      _universe: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "bridgeReportingFee(address)"(
      _universe: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    bridgeMarket(_market: string, overrides?: Overrides): Promise<BigNumber>;

    "bridgeMarket(address)"(
      _market: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    bridgeReportingFee(
      _universe: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "bridgeReportingFee(address)"(
      _universe: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    bridgeMarket(
      _market: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "bridgeMarket(address)"(
      _market: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    bridgeReportingFee(
      _universe: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "bridgeReportingFee(address)"(
      _universe: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}
