import * as _ from 'lodash';
import { AbstractTable, BaseDocument } from './AbstractTable';
import { SyncStatus } from './SyncStatus';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { MarketData, MarketType } from '../logs/types';
import { OrderInfo, OrderEvent, BigNumber } from "@0x/mesh-rpc-client";
import { getAddress } from 'ethers/utils/address';
import { defaultAbiCoder, ParamType } from 'ethers/utils';
import { SignedOrder } from '@0x/types';
import { BigNumber as BN} from 'ethers/utils';
import moment, { Moment } from 'moment';

// This database clears its contents on every sync.
// The primary purposes for even storing this data are:
// 1. To recalculate liquidity metrics. This can be stale so when the derived market DB is synced it should not wait for this to complete (it will already have recorded liquidity data from previous syncs)
// 2. To cache market orderbooks so a complete pull isnt needed on every subsequent load.

const EXPECTED_ASSET_DATA_LENGTH = 650;

const DEFAULT_TRADE_INTERVAL = new BigNumber(10**17);
const TRADE_INTERVAL_VALUE = new BigNumber(10**19);

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
  kycToken: string;
}

export interface Document extends BaseDocument {
  blockNumber: number;
}

export interface SnapshotCounterDocument extends BaseDocument {
  snapshotCounter: number;
}

export interface StoredOrder extends OrderData {
  orderHash: string,
  signedOrder: StoredSignedOrder,
  amount: string,
  numberAmount: BigNumber,
  orderCreator: string,
}

export interface StoredSignedOrder {
  signature: string;
  senderAddress: string;
  makerAddress: string;
  takerAddress: string;
  makerFee: string;
  takerFee: string;
  makerAssetAmount: string;
  takerAssetAmount: string;
  makerAssetData: string;
  takerAssetData: string;
  salt: string;
  exchangeAddress: string;
  feeRecipientAddress: string;
  expirationTimeSeconds: string;
}

/**
 * Stores 0x orders
 */
export class ZeroXOrders extends AbstractTable {
  protected syncStatus: SyncStatus;
  protected stateDB: DB;
  private augur: Augur;
  readonly tradeTokenAddress: string;

  constructor(
    db: DB,
    networkId: number,
    augur: Augur
  ) {
    super(networkId, 'ZeroXOrders', db.dexieDB);
    this.syncStatus = db.syncStatus;
    this.stateDB = db;
    this.augur = augur;
    this.tradeTokenAddress = this.augur.addresses.ZeroXTrade.substr(2).toLowerCase(); // normalize and remove the 0x
  }

  static async create(db: DB, networkId: number, augur: Augur): Promise<ZeroXOrders> {
    const zeroXOrders = new ZeroXOrders(db, networkId, augur);
    await zeroXOrders.clearDB();
    await zeroXOrders.subscribeToMeshEvents();
    return zeroXOrders;
  }

  async subscribeToMeshEvents(): Promise<void> {
    return this.augur.zeroX.subscribeToMeshEvents(this.handleMeshEvent.bind(this));
  }

  async handleMeshEvent(orderEvents: OrderEvent[]): Promise<void> {
    if (orderEvents.length < 1) return;
    console.log('Mesh events recieved: ${JSON.stringify(orderEvents)}');
    const filteredOrders = _.filter(orderEvents, this.validateOrder.bind(this));
    let documents = _.map(filteredOrders, this.processOrder.bind(this));
    documents = _.filter(documents, this.validateStoredOrder.bind(this));
    await this.bulkUpsertDocuments(documents);
    for (const d of documents) {
      this.augur.events.emit('OrderEvent', d);
    }
  }

  async sync(): Promise<void> {
    const orders: OrderInfo[] = await this.augur.zeroX.getOrders();
    let documents;
    if (orders.length > 0) {
      documents = _.filter(orders, this.validateOrder.bind(this));
      documents = _.map(documents, this.processOrder.bind(this));
      const marketIds: string[] = _.uniq(_.map(documents, "market"));
      const markets = _.keyBy(await this.stateDB.Markets.where("market").anyOf(marketIds).toArray(), "market");
      documents = _.filter(documents, (document) => {
        return this.validateStoredOrder(document, markets);
      });
      await this.bulkUpsertDocuments(documents);
      for (const d of documents) {
        this.augur.events.emit('OrderEvent', d);
      }
    }
  }

  validateOrder(order: OrderInfo): boolean {
    if (order.signedOrder.makerAssetData.length !== EXPECTED_ASSET_DATA_LENGTH) return false;
    if (order.signedOrder.makerAssetData !== order.signedOrder.takerAssetData) return false;
    if (order.signedOrder.makerAssetData.substr(34, 40) !== this.tradeTokenAddress) return false;
    return true;
  }

  validateStoredOrder(storedOrder: StoredOrder, markets: _.Dictionary<MarketData>): boolean {
    // Validate the order is a multiple of the recommended trade interval
    let tradeInterval = DEFAULT_TRADE_INTERVAL;
    const marketData = markets[storedOrder.market];
    if (marketData && marketData.marketType == MarketType.Scalar) {
      tradeInterval = TRADE_INTERVAL_VALUE.dividedBy(marketData.numTicks);
    }
    if (!storedOrder["numberAmount"].mod(tradeInterval).isEqualTo(0)) return false;
    console.log(storedOrder.orderHash);
    console.log("Banana");
    if (storedOrder["numberAmount"] == new BigNumber(0)) {
      this.table.where('orderHash').equals(storedOrder.orderHash).delete();
      return false;
    }
    if (parseInt(storedOrder.signedOrder.expirationTimeSeconds) - moment.now() < 60) { 
      this.table.where('orderHash').equals(storedOrder.orderHash).delete();
      return false;
    };
    return true;
  }

  processOrder(order: OrderInfo): StoredOrder {
    const augurOrderData = this.parseAssetData(order.signedOrder.makerAssetData);
    // Currently the API for mesh browser and the client API diverge here but we dont want to do string parsing per order to be compliant for the browser case
    const signedOrder = order.signedOrder;
    return {
      market: augurOrderData.market,
      price: augurOrderData.price,
      outcome: augurOrderData.outcome,
      orderType: augurOrderData.orderType,
      kycToken: augurOrderData.kycToken,
      orderHash: order.orderHash,
      amount: order.fillableTakerAssetAmount.toFixed(),
      numberAmount: order.fillableTakerAssetAmount,
      orderCreator: getAddress(signedOrder.makerAddress),
      signedOrder: {
        signature: signedOrder.signature,
        senderAddress: getAddress(signedOrder.senderAddress),
        makerAddress: getAddress(signedOrder.makerAddress),
        takerAddress: getAddress(signedOrder.takerAddress),
        makerFee: signedOrder.makerFee.toFixed(),
        takerFee: signedOrder.takerFee.toFixed(),
        makerAssetAmount: signedOrder.makerAssetAmount.toFixed(),
        takerAssetAmount: signedOrder.takerAssetAmount.toFixed(),
        makerAssetData: signedOrder.makerAssetData,
        takerAssetData: signedOrder.takerAssetData,
        salt: signedOrder.salt.toFixed(),
        exchangeAddress: getAddress(signedOrder.exchangeAddress),
        feeRecipientAddress: signedOrder.feeRecipientAddress,
        expirationTimeSeconds: signedOrder.expirationTimeSeconds.toFixed(),
      },
    }
  }

  parseAssetData(assetData: string): OrderData {
    // Remove the first 10 characters because assetData is prefixed in 0x, and then contains a selector.
    // Drop the selector and add back to 0x prefix so the AbiDecoder will treat it properly as hex.
    const decoded = defaultAbiCoder.decode(erc1155AssetDataAbi, `0x${assetData.slice(10)}`);
    const address = decoded[0] as string;
    const ids = decoded[1] as BigNumber[];
    const values = decoded[2] as BigNumber[];
    const callbackData = decoded[3] as string;
    const kycToken = getAddress(`0x${assetData.substr(-40, assetData.length)}`);

    if (ids.length !== 1) {
      throw new Error("More than one ID passed into 0x order");
    }

    // No idea why the BigNumber instance returned here just wont serialize to hex
    const tokenid = new BN(`${ids[0].toString()}`).toHexString().substr(2);
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
      kycToken,
    };
  }
}
