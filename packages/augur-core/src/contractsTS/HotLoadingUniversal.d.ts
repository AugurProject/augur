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
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface HotLoadingUniversalInterface extends ethers.utils.Interface {
  functions: {
    "getCurrentDisputeWindowData(address,address)": FunctionFragment;
    "getLastTradedPrices(address,uint256,address)": FunctionFragment;
    "getMarketData(address,address,address,address)": FunctionFragment;
    "getMarketsData(address,address[],address,address)": FunctionFragment;
    "getReportingState(address,address)": FunctionFragment;
    "getTotalValidityBonds(address[])": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getCurrentDisputeWindowData",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getLastTradedPrices",
    values: [string, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getMarketData",
    values: [string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getMarketsData",
    values: [string, string[], string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getReportingState",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTotalValidityBonds",
    values: [string[]]
  ): string;

  decodeFunctionResult(
    functionFragment: "getCurrentDisputeWindowData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLastTradedPrices",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMarketData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getMarketsData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getReportingState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTotalValidityBonds",
    data: BytesLike
  ): Result;

  events: {};
}

export class HotLoadingUniversal extends Contract {
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

  interface: HotLoadingUniversalInterface;

  functions: {
    getCurrentDisputeWindowData(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
          disputeWindow: string;
          startTime: BigNumber;
          endTime: BigNumber;
          purchased: BigNumber;
          fees: BigNumber;
        }
      ] & {
        _disputeWindowData: [
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber
        ] & {
          disputeWindow: string;
          startTime: BigNumber;
          endTime: BigNumber;
          purchased: BigNumber;
          fees: BigNumber;
        };
      }
    >;

    "getCurrentDisputeWindowData(address,address)"(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
          disputeWindow: string;
          startTime: BigNumber;
          endTime: BigNumber;
          purchased: BigNumber;
          fees: BigNumber;
        }
      ] & {
        _disputeWindowData: [
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber
        ] & {
          disputeWindow: string;
          startTime: BigNumber;
          endTime: BigNumber;
          purchased: BigNumber;
          fees: BigNumber;
        };
      }
    >;

    getLastTradedPrices(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { _lastTradedPrices: BigNumber[] }>;

    "getLastTradedPrices(address,uint256,address)"(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]] & { _lastTradedPrices: BigNumber[] }>;

    getMarketData(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        }
      ] & {
        _marketData: [
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        };
      }
    >;

    "getMarketData(address,address,address,address)"(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      [
        [
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        }
      ] & {
        _marketData: [
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        };
      }
    >;

    getMarketsData(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        })[]
      ] & {
        _marketsData: ([
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        })[];
      }
    >;

    "getMarketsData(address,address[],address,address)"(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      [
        ([
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        })[]
      ] & {
        _marketsData: ([
          string,
          string,
          string,
          string[],
          number,
          BigNumber[],
          string,
          number,
          BigNumber,
          BigNumber[],
          BigNumber,
          BigNumber,
          BigNumber[],
          string,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber[]
        ] & {
          extraInfo: string;
          marketCreator: string;
          owner: string;
          outcomes: string[];
          marketType: number;
          displayPrices: BigNumber[];
          designatedReporter: string;
          reportingState: number;
          disputeRound: BigNumber;
          winningPayout: BigNumber[];
          volume: BigNumber;
          openInterest: BigNumber;
          lastTradedPrices: BigNumber[];
          universe: string;
          numTicks: BigNumber;
          feeDivisor: BigNumber;
          affiliateFeeDivisor: BigNumber;
          endTime: BigNumber;
          numOutcomes: BigNumber;
          validityBond: BigNumber;
          reportingFeeDivisor: BigNumber;
          outcomeVolumes: BigNumber[];
        })[];
      }
    >;

    getReportingState(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    "getReportingState(address,address)"(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getTotalValidityBonds(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _totalValidityBonds: BigNumber }>;

    "getTotalValidityBonds(address[])"(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { _totalValidityBonds: BigNumber }>;
  };

  getCurrentDisputeWindowData(
    _augur: string,
    _universe: string,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
      disputeWindow: string;
      startTime: BigNumber;
      endTime: BigNumber;
      purchased: BigNumber;
      fees: BigNumber;
    }
  >;

  "getCurrentDisputeWindowData(address,address)"(
    _augur: string,
    _universe: string,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
      disputeWindow: string;
      startTime: BigNumber;
      endTime: BigNumber;
      purchased: BigNumber;
      fees: BigNumber;
    }
  >;

  getLastTradedPrices(
    _market: string,
    _numOutcomes: BigNumberish,
    _orders: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  "getLastTradedPrices(address,uint256,address)"(
    _market: string,
    _numOutcomes: BigNumberish,
    _orders: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getMarketData(
    _augur: string,
    _market: string,
    _fillOrder: string,
    _orders: string,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      string,
      string[],
      number,
      BigNumber[],
      string,
      number,
      BigNumber,
      BigNumber[],
      BigNumber,
      BigNumber,
      BigNumber[],
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber[]
    ] & {
      extraInfo: string;
      marketCreator: string;
      owner: string;
      outcomes: string[];
      marketType: number;
      displayPrices: BigNumber[];
      designatedReporter: string;
      reportingState: number;
      disputeRound: BigNumber;
      winningPayout: BigNumber[];
      volume: BigNumber;
      openInterest: BigNumber;
      lastTradedPrices: BigNumber[];
      universe: string;
      numTicks: BigNumber;
      feeDivisor: BigNumber;
      affiliateFeeDivisor: BigNumber;
      endTime: BigNumber;
      numOutcomes: BigNumber;
      validityBond: BigNumber;
      reportingFeeDivisor: BigNumber;
      outcomeVolumes: BigNumber[];
    }
  >;

  "getMarketData(address,address,address,address)"(
    _augur: string,
    _market: string,
    _fillOrder: string,
    _orders: string,
    overrides?: CallOverrides
  ): Promise<
    [
      string,
      string,
      string,
      string[],
      number,
      BigNumber[],
      string,
      number,
      BigNumber,
      BigNumber[],
      BigNumber,
      BigNumber,
      BigNumber[],
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber[]
    ] & {
      extraInfo: string;
      marketCreator: string;
      owner: string;
      outcomes: string[];
      marketType: number;
      displayPrices: BigNumber[];
      designatedReporter: string;
      reportingState: number;
      disputeRound: BigNumber;
      winningPayout: BigNumber[];
      volume: BigNumber;
      openInterest: BigNumber;
      lastTradedPrices: BigNumber[];
      universe: string;
      numTicks: BigNumber;
      feeDivisor: BigNumber;
      affiliateFeeDivisor: BigNumber;
      endTime: BigNumber;
      numOutcomes: BigNumber;
      validityBond: BigNumber;
      reportingFeeDivisor: BigNumber;
      outcomeVolumes: BigNumber[];
    }
  >;

  getMarketsData(
    _augur: string,
    _markets: string[],
    _fillOrder: string,
    _orders: string,
    overrides?: CallOverrides
  ): Promise<
    ([
      string,
      string,
      string,
      string[],
      number,
      BigNumber[],
      string,
      number,
      BigNumber,
      BigNumber[],
      BigNumber,
      BigNumber,
      BigNumber[],
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber[]
    ] & {
      extraInfo: string;
      marketCreator: string;
      owner: string;
      outcomes: string[];
      marketType: number;
      displayPrices: BigNumber[];
      designatedReporter: string;
      reportingState: number;
      disputeRound: BigNumber;
      winningPayout: BigNumber[];
      volume: BigNumber;
      openInterest: BigNumber;
      lastTradedPrices: BigNumber[];
      universe: string;
      numTicks: BigNumber;
      feeDivisor: BigNumber;
      affiliateFeeDivisor: BigNumber;
      endTime: BigNumber;
      numOutcomes: BigNumber;
      validityBond: BigNumber;
      reportingFeeDivisor: BigNumber;
      outcomeVolumes: BigNumber[];
    })[]
  >;

  "getMarketsData(address,address[],address,address)"(
    _augur: string,
    _markets: string[],
    _fillOrder: string,
    _orders: string,
    overrides?: CallOverrides
  ): Promise<
    ([
      string,
      string,
      string,
      string[],
      number,
      BigNumber[],
      string,
      number,
      BigNumber,
      BigNumber[],
      BigNumber,
      BigNumber,
      BigNumber[],
      string,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber[]
    ] & {
      extraInfo: string;
      marketCreator: string;
      owner: string;
      outcomes: string[];
      marketType: number;
      displayPrices: BigNumber[];
      designatedReporter: string;
      reportingState: number;
      disputeRound: BigNumber;
      winningPayout: BigNumber[];
      volume: BigNumber;
      openInterest: BigNumber;
      lastTradedPrices: BigNumber[];
      universe: string;
      numTicks: BigNumber;
      feeDivisor: BigNumber;
      affiliateFeeDivisor: BigNumber;
      endTime: BigNumber;
      numOutcomes: BigNumber;
      validityBond: BigNumber;
      reportingFeeDivisor: BigNumber;
      outcomeVolumes: BigNumber[];
    })[]
  >;

  getReportingState(
    _augur: string,
    _market: string,
    overrides?: CallOverrides
  ): Promise<number>;

  "getReportingState(address,address)"(
    _augur: string,
    _market: string,
    overrides?: CallOverrides
  ): Promise<number>;

  getTotalValidityBonds(
    _markets: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getTotalValidityBonds(address[])"(
    _markets: string[],
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    getCurrentDisputeWindowData(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        disputeWindow: string;
        startTime: BigNumber;
        endTime: BigNumber;
        purchased: BigNumber;
        fees: BigNumber;
      }
    >;

    "getCurrentDisputeWindowData(address,address)"(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber, BigNumber, BigNumber, BigNumber] & {
        disputeWindow: string;
        startTime: BigNumber;
        endTime: BigNumber;
        purchased: BigNumber;
        fees: BigNumber;
      }
    >;

    getLastTradedPrices(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    "getLastTradedPrices(address,uint256,address)"(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getMarketData(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        string,
        string[],
        number,
        BigNumber[],
        string,
        number,
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber,
        BigNumber[],
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
      ] & {
        extraInfo: string;
        marketCreator: string;
        owner: string;
        outcomes: string[];
        marketType: number;
        displayPrices: BigNumber[];
        designatedReporter: string;
        reportingState: number;
        disputeRound: BigNumber;
        winningPayout: BigNumber[];
        volume: BigNumber;
        openInterest: BigNumber;
        lastTradedPrices: BigNumber[];
        universe: string;
        numTicks: BigNumber;
        feeDivisor: BigNumber;
        affiliateFeeDivisor: BigNumber;
        endTime: BigNumber;
        numOutcomes: BigNumber;
        validityBond: BigNumber;
        reportingFeeDivisor: BigNumber;
        outcomeVolumes: BigNumber[];
      }
    >;

    "getMarketData(address,address,address,address)"(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        string,
        string,
        string[],
        number,
        BigNumber[],
        string,
        number,
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber,
        BigNumber[],
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
      ] & {
        extraInfo: string;
        marketCreator: string;
        owner: string;
        outcomes: string[];
        marketType: number;
        displayPrices: BigNumber[];
        designatedReporter: string;
        reportingState: number;
        disputeRound: BigNumber;
        winningPayout: BigNumber[];
        volume: BigNumber;
        openInterest: BigNumber;
        lastTradedPrices: BigNumber[];
        universe: string;
        numTicks: BigNumber;
        feeDivisor: BigNumber;
        affiliateFeeDivisor: BigNumber;
        endTime: BigNumber;
        numOutcomes: BigNumber;
        validityBond: BigNumber;
        reportingFeeDivisor: BigNumber;
        outcomeVolumes: BigNumber[];
      }
    >;

    getMarketsData(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      ([
        string,
        string,
        string,
        string[],
        number,
        BigNumber[],
        string,
        number,
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber,
        BigNumber[],
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
      ] & {
        extraInfo: string;
        marketCreator: string;
        owner: string;
        outcomes: string[];
        marketType: number;
        displayPrices: BigNumber[];
        designatedReporter: string;
        reportingState: number;
        disputeRound: BigNumber;
        winningPayout: BigNumber[];
        volume: BigNumber;
        openInterest: BigNumber;
        lastTradedPrices: BigNumber[];
        universe: string;
        numTicks: BigNumber;
        feeDivisor: BigNumber;
        affiliateFeeDivisor: BigNumber;
        endTime: BigNumber;
        numOutcomes: BigNumber;
        validityBond: BigNumber;
        reportingFeeDivisor: BigNumber;
        outcomeVolumes: BigNumber[];
      })[]
    >;

    "getMarketsData(address,address[],address,address)"(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<
      ([
        string,
        string,
        string,
        string[],
        number,
        BigNumber[],
        string,
        number,
        BigNumber,
        BigNumber[],
        BigNumber,
        BigNumber,
        BigNumber[],
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber[]
      ] & {
        extraInfo: string;
        marketCreator: string;
        owner: string;
        outcomes: string[];
        marketType: number;
        displayPrices: BigNumber[];
        designatedReporter: string;
        reportingState: number;
        disputeRound: BigNumber;
        winningPayout: BigNumber[];
        volume: BigNumber;
        openInterest: BigNumber;
        lastTradedPrices: BigNumber[];
        universe: string;
        numTicks: BigNumber;
        feeDivisor: BigNumber;
        affiliateFeeDivisor: BigNumber;
        endTime: BigNumber;
        numOutcomes: BigNumber;
        validityBond: BigNumber;
        reportingFeeDivisor: BigNumber;
        outcomeVolumes: BigNumber[];
      })[]
    >;

    getReportingState(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<number>;

    "getReportingState(address,address)"(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<number>;

    getTotalValidityBonds(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTotalValidityBonds(address[])"(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getCurrentDisputeWindowData(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getCurrentDisputeWindowData(address,address)"(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getLastTradedPrices(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getLastTradedPrices(address,uint256,address)"(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarketData(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMarketData(address,address,address,address)"(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMarketsData(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getMarketsData(address,address[],address,address)"(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getReportingState(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getReportingState(address,address)"(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTotalValidityBonds(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTotalValidityBonds(address[])"(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getCurrentDisputeWindowData(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getCurrentDisputeWindowData(address,address)"(
      _augur: string,
      _universe: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLastTradedPrices(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getLastTradedPrices(address,uint256,address)"(
      _market: string,
      _numOutcomes: BigNumberish,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMarketData(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getMarketData(address,address,address,address)"(
      _augur: string,
      _market: string,
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMarketsData(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getMarketsData(address,address[],address,address)"(
      _augur: string,
      _markets: string[],
      _fillOrder: string,
      _orders: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getReportingState(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getReportingState(address,address)"(
      _augur: string,
      _market: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTotalValidityBonds(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTotalValidityBonds(address[])"(
      _markets: string[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
