// TextEncoder/TextDecoder is in a different location in Browser vs NodeJS
const isBrowser = new Function("try {return this===window;}catch(e){ return false;}")
interface ITextEncoder { encode(input: string): Uint8Array }
interface ITextDecoder { decode(input: Uint8Array): string }
// browser
declare const TextEncoder: any, TextDecoder: any
// nodejs
let util: { TextEncoder: any, TextDecoder: any } = isBrowser() ? {} : require('util')
function createTextEncoder(): ITextEncoder { return isBrowser() ? new TextEncoder() : new util.TextEncoder() }
function createTextDecoder(): ITextDecoder { return isBrowser() ? new TextDecoder() : new util.TextDecoder() }

abstract class ByteArray extends Uint8Array {
  static fromByteArray<TConstructor extends typeof ByteArray & { new(): InstanceType<TConstructor> }>(this: TConstructor, bytes: Uint8Array | Array<number>, pad?: 'left' | 'right'): InstanceType<TConstructor> {
    let result = new this()
    // special case for variable sized types like `Bytes`
    if (result.length === 0) result = new this(bytes.length)
    if (bytes.length > result.length) throw new Error(`Source bytes are longer (${bytes.length}) than destination bytes ${result.length}\n${bytes}`)
    for (let byte of bytes) {
      if (byte > 0xff || byte < 0) throw new Error(`Source array must only include numbers between 0 and ${0xff}.\n${bytes}`)
    }
    result.set(bytes, (pad === 'left') ? result.length - bytes.length : 0)
    return result as InstanceType<TConstructor>
  }
  static fromHexString<TConstructor extends typeof ByteArray & { new(): InstanceType<TConstructor> }>(this: TConstructor, hex: string): InstanceType<TConstructor> {
    const match = /^(?:0x)?([a-fA-F0-9]*)$/.exec(hex)
    if (match === null) throw new Error(`Expected a hex string encoded byte array with an optional '0x' prefix but received ${hex}`)
    const normalized = match[1]
    if (normalized.length % 2) throw new Error(`Hex string encoded byte array must be an even number of charcaters long.`)
    const bytes = []
    for (let i = 0; i < normalized.length; i += 2) {
      bytes.push(Number.parseInt(`${normalized[i]}${normalized[i+1]}`, 16))
    }
    return this.fromByteArray(bytes)
  }
  static fromStringLiteral<TConstructor extends typeof ByteArray & { new(): InstanceType<TConstructor> }>(this: TConstructor, literal: string): InstanceType<TConstructor> {
    const encoded = createTextEncoder().encode(literal)
    return this.fromByteArray(encoded)

  }
  toString = () => this.reduce((result: string, byte: number) => result + ('0' + byte.toString(16)).slice(-2), '')
  to0xString = () => `0x${this.toString()}`
  equals = (other?: Uint8Array | null): boolean => {
    if (other === undefined || other === null) return false
    if (this.length !== other.length) return false
    for (let i = 0; i < this.length; ++i) {
      if (this[i] !== other[i]) return false
    }
    return true
  }
  static get [Symbol.species]() { return Uint8Array }
}

export class Address extends ByteArray { constructor() { super(20) }; Address: unknown }

export const abi = require("./abi.json");
export const Addresses = require("./addresses.json");
export const Contracts = require("./contracts.json");
export const UploadBlockNumbers = require("./upload-block-numbers.json");

export type NetworkId =
    '1'
    | '3'
    | '4'
    | '19'
    | '42'
    | '101'
    | '102'
    | '103'
    | '104'

export interface ContractAddresses {
    Universe: Address;
    Augur: Address;
    LegacyReputationToken: Address;
    CancelOrder: Address;
    Cash: Address;
    ClaimTradingProceeds: Address;
    CompleteSets: Address;
    CreateOrder: Address;
    FillOrder: Address;
    Order: Address;
    Orders: Address;
    ShareToken: Address;
    Trade: Address;
    Controller?: Address;
    OrdersFinder?: Address;
    OrdersFetcher?: Address;
    TradingEscapeHatch?: Address;
    Time?: Address;
    TimeControlled?: Address;
}

// TS doesn't allow mapping of any type but string or number so we list it out manually
export interface NetworkContractAddresses {
    1: ContractAddresses;
    3: ContractAddresses;
    4: ContractAddresses;
    19: ContractAddresses;
    42: ContractAddresses;
    101: ContractAddresses;
    102: ContractAddresses;
    103: ContractAddresses;
    104: ContractAddresses;
}

