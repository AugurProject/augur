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

interface SideChainSimulateTradeInterface extends ethers.utils.Interface {
  functions: {
    "augur()": FunctionFragment;
    "augurTrading()": FunctionFragment;
    "getInitialized()": FunctionFragment;
    "getNumberOfAvaialableShares(uint8,address,uint256,address)": FunctionFragment;
    "initialize(address,address)": FunctionFragment;
    "marketGetter()": FunctionFragment;
    "shareToken()": FunctionFragment;
    "simulateZeroXTrade(tuple[],uint256,bool)": FunctionFragment;
    "zeroXTrade()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "augur", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "augurTrading",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getInitialized",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getNumberOfAvaialableShares",
    values: [BigNumberish, string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "marketGetter",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "shareToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "simulateZeroXTrade",
    values: [
      {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      BigNumberish,
      boolean
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "zeroXTrade",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "augur", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "augurTrading",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInitialized",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getNumberOfAvaialableShares",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "marketGetter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "shareToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "simulateZeroXTrade",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "zeroXTrade", data: BytesLike): Result;

  events: {};
}

export class SideChainSimulateTrade extends Contract {
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

  interface: SideChainSimulateTradeInterface;

  functions: {
    augur(overrides?: CallOverrides): Promise<[string]>;

    "augur()"(overrides?: CallOverrides): Promise<[string]>;

    augurTrading(overrides?: CallOverrides): Promise<[string]>;

    "augurTrading()"(overrides?: CallOverrides): Promise<[string]>;

    getInitialized(overrides?: CallOverrides): Promise<[boolean]>;

    "getInitialized()"(overrides?: CallOverrides): Promise<[boolean]>;

    getNumberOfAvaialableShares(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "getNumberOfAvaialableShares(uint8,address,uint256,address)"(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    initialize(
      _augur: string,
      _augurTrading: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "initialize(address,address)"(
      _augur: string,
      _augurTrading: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    marketGetter(overrides?: CallOverrides): Promise<[string]>;

    "marketGetter()"(overrides?: CallOverrides): Promise<[string]>;

    shareToken(overrides?: CallOverrides): Promise<[string]>;

    "shareToken()"(overrides?: CallOverrides): Promise<[string]>;

    simulateZeroXTrade(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        _sharesFilled: BigNumber;
        _tokensDepleted: BigNumber;
        _sharesDepleted: BigNumber;
        _settlementFees: BigNumber;
        _numFills: BigNumber;
      }
    >;

    "simulateZeroXTrade(tuple[],uint256,bool)"(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        _sharesFilled: BigNumber;
        _tokensDepleted: BigNumber;
        _sharesDepleted: BigNumber;
        _settlementFees: BigNumber;
        _numFills: BigNumber;
      }
    >;

    zeroXTrade(overrides?: CallOverrides): Promise<[string]>;

    "zeroXTrade()"(overrides?: CallOverrides): Promise<[string]>;
  };

  augur(overrides?: CallOverrides): Promise<string>;

  "augur()"(overrides?: CallOverrides): Promise<string>;

  augurTrading(overrides?: CallOverrides): Promise<string>;

  "augurTrading()"(overrides?: CallOverrides): Promise<string>;

  getInitialized(overrides?: CallOverrides): Promise<boolean>;

  "getInitialized()"(overrides?: CallOverrides): Promise<boolean>;

  getNumberOfAvaialableShares(
    _direction: BigNumberish,
    _market: string,
    _outcome: BigNumberish,
    _sender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getNumberOfAvaialableShares(uint8,address,uint256,address)"(
    _direction: BigNumberish,
    _market: string,
    _outcome: BigNumberish,
    _sender: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    _augur: string,
    _augurTrading: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "initialize(address,address)"(
    _augur: string,
    _augurTrading: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  marketGetter(overrides?: CallOverrides): Promise<string>;

  "marketGetter()"(overrides?: CallOverrides): Promise<string>;

  shareToken(overrides?: CallOverrides): Promise<string>;

  "shareToken()"(overrides?: CallOverrides): Promise<string>;

  simulateZeroXTrade(
    _orders: {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumberish;
      takerAssetAmount: BigNumberish;
      makerFee: BigNumberish;
      takerFee: BigNumberish;
      expirationTimeSeconds: BigNumberish;
      salt: BigNumberish;
      makerAssetData: BytesLike;
      takerAssetData: BytesLike;
      makerFeeAssetData: BytesLike;
      takerFeeAssetData: BytesLike;
    }[],
    _amount: BigNumberish,
    _fillOnly: boolean,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      _sharesFilled: BigNumber;
      _tokensDepleted: BigNumber;
      _sharesDepleted: BigNumber;
      _settlementFees: BigNumber;
      _numFills: BigNumber;
    }
  >;

  "simulateZeroXTrade(tuple[],uint256,bool)"(
    _orders: {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumberish;
      takerAssetAmount: BigNumberish;
      makerFee: BigNumberish;
      takerFee: BigNumberish;
      expirationTimeSeconds: BigNumberish;
      salt: BigNumberish;
      makerAssetData: BytesLike;
      takerAssetData: BytesLike;
      makerFeeAssetData: BytesLike;
      takerFeeAssetData: BytesLike;
    }[],
    _amount: BigNumberish,
    _fillOnly: boolean,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      _sharesFilled: BigNumber;
      _tokensDepleted: BigNumber;
      _sharesDepleted: BigNumber;
      _settlementFees: BigNumber;
      _numFills: BigNumber;
    }
  >;

  zeroXTrade(overrides?: CallOverrides): Promise<string>;

  "zeroXTrade()"(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    augur(overrides?: CallOverrides): Promise<string>;

    "augur()"(overrides?: CallOverrides): Promise<string>;

    augurTrading(overrides?: CallOverrides): Promise<string>;

    "augurTrading()"(overrides?: CallOverrides): Promise<string>;

    getInitialized(overrides?: CallOverrides): Promise<boolean>;

    "getInitialized()"(overrides?: CallOverrides): Promise<boolean>;

    getNumberOfAvaialableShares(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getNumberOfAvaialableShares(uint8,address,uint256,address)"(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _augur: string,
      _augurTrading: string,
      overrides?: CallOverrides
    ): Promise<void>;

    "initialize(address,address)"(
      _augur: string,
      _augurTrading: string,
      overrides?: CallOverrides
    ): Promise<void>;

    marketGetter(overrides?: CallOverrides): Promise<string>;

    "marketGetter()"(overrides?: CallOverrides): Promise<string>;

    shareToken(overrides?: CallOverrides): Promise<string>;

    "shareToken()"(overrides?: CallOverrides): Promise<string>;

    simulateZeroXTrade(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        _sharesFilled: BigNumber;
        _tokensDepleted: BigNumber;
        _sharesDepleted: BigNumber;
        _settlementFees: BigNumber;
        _numFills: BigNumber;
      }
    >;

    "simulateZeroXTrade(tuple[],uint256,bool)"(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        _sharesFilled: BigNumber;
        _tokensDepleted: BigNumber;
        _sharesDepleted: BigNumber;
        _settlementFees: BigNumber;
        _numFills: BigNumber;
      }
    >;

    zeroXTrade(overrides?: CallOverrides): Promise<string>;

    "zeroXTrade()"(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    augur(overrides?: CallOverrides): Promise<BigNumber>;

    "augur()"(overrides?: CallOverrides): Promise<BigNumber>;

    augurTrading(overrides?: CallOverrides): Promise<BigNumber>;

    "augurTrading()"(overrides?: CallOverrides): Promise<BigNumber>;

    getInitialized(overrides?: CallOverrides): Promise<BigNumber>;

    "getInitialized()"(overrides?: CallOverrides): Promise<BigNumber>;

    getNumberOfAvaialableShares(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getNumberOfAvaialableShares(uint8,address,uint256,address)"(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _augur: string,
      _augurTrading: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "initialize(address,address)"(
      _augur: string,
      _augurTrading: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    marketGetter(overrides?: CallOverrides): Promise<BigNumber>;

    "marketGetter()"(overrides?: CallOverrides): Promise<BigNumber>;

    shareToken(overrides?: CallOverrides): Promise<BigNumber>;

    "shareToken()"(overrides?: CallOverrides): Promise<BigNumber>;

    simulateZeroXTrade(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "simulateZeroXTrade(tuple[],uint256,bool)"(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    zeroXTrade(overrides?: CallOverrides): Promise<BigNumber>;

    "zeroXTrade()"(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    augur(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "augur()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    augurTrading(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "augurTrading()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getInitialized(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "getInitialized()"(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getNumberOfAvaialableShares(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getNumberOfAvaialableShares(uint8,address,uint256,address)"(
      _direction: BigNumberish,
      _market: string,
      _outcome: BigNumberish,
      _sender: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _augur: string,
      _augurTrading: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "initialize(address,address)"(
      _augur: string,
      _augurTrading: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    marketGetter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "marketGetter()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    shareToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "shareToken()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    simulateZeroXTrade(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "simulateZeroXTrade(tuple[],uint256,bool)"(
      _orders: {
        makerAddress: string;
        takerAddress: string;
        feeRecipientAddress: string;
        senderAddress: string;
        makerAssetAmount: BigNumberish;
        takerAssetAmount: BigNumberish;
        makerFee: BigNumberish;
        takerFee: BigNumberish;
        expirationTimeSeconds: BigNumberish;
        salt: BigNumberish;
        makerAssetData: BytesLike;
        takerAssetData: BytesLike;
        makerFeeAssetData: BytesLike;
        takerFeeAssetData: BytesLike;
      }[],
      _amount: BigNumberish,
      _fillOnly: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    zeroXTrade(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "zeroXTrade()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
