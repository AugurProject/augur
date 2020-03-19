
import * as _ from 'lodash';
import { AbstractTable, BaseDocument } from './AbstractTable';
import { SyncStatus } from './SyncStatus';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { MarketData, MarketType } from '../logs/types';
import { OrderEventType, SubscriptionEventName } from '../../constants';
import { getTradeInterval, convertDisplayAmountToOnChainAmount } from '../../utils';
import { OrderInfo, OrderEvent, BigNumber } from '@0x/mesh-rpc-client';
import { getAddress } from 'ethers/utils/address';
import { defaultAbiCoder, ParamType } from 'ethers/utils';
import { BigNumber as BN} from 'ethers/utils';

// This database clears its contents on every sync.
// The primary purposes for even storing this data are:
// 1. To recalculate liquidity metrics. This can be stale so when the derived market DB is synced it should not wait for this to complete (it will already have recorded liquidity data from previous syncs)
// 2. To cache market orderbooks so a complete pull isnt needed on every subsequent load.

const EXPECTED_ASSET_DATA_LENGTH = 2122;

const DEFAULT_TRADE_INTERVAL = new BigNumber(10**17);

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

export interface ParsedAssetDataResults {
  orderData: OrderData;
  multiAssetData: any;
}

export interface OrderData {
  market: string;
  price: string;
  outcome: string;
  orderType: string;
  invalidOrder?: boolean;
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
  orderId?: string,
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
  readonly cashAssetData: string;
  readonly shareAssetData: string;
  readonly takerAssetData: string;
  private pastOrders: _.Dictionary<StoredOrder>;

  constructor(
    db: DB,
    networkId: number,
    augur: Augur
  ) {
    super(networkId, 'ZeroXOrders', db.dexieDB);
    this.syncStatus = db.syncStatus;
    this.stateDB = db;
    this.augur = augur;
    this.tradeTokenAddress = this.augur.config.addresses.ZeroXTrade.substr(2).toLowerCase(); // normalize and remove the 0x
    const cashTokenAddress = this.augur.config.addresses.Cash.substr(2).toLowerCase(); // normalize and remove the 0x
    const shareTokenAddress = this.augur.config.addresses.ShareToken.substr(2).toLowerCase(); // normalize and remove the 0x
    this.cashAssetData = `0xf47261b0000000000000000000000000${cashTokenAddress}`;
    this.shareAssetData = `0xa7cb5fb7000000000000000000000000${shareTokenAddress}000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
    this.takerAssetData = `0xa7cb5fb7000000000000000000000000${this.tradeTokenAddress}000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;

    this.subscribeToOrderEvents();

    this.clearDBAndCacheOrders().then(() => {
      if (augur.zeroX.isReady()) {
        this.sync();
      } else {
        this.augur.events.once(SubscriptionEventName.ZeroXReady, this.sync.bind(this));
      }
    })
  }

  protected async saveDocuments(documents: BaseDocument[]): Promise<void> {
    return super.bulkPutDocuments(documents);
  }

  static create(db: DB, networkId: number, augur: Augur): ZeroXOrders {
    const zeroXOrders = new ZeroXOrders(db, networkId, augur);
    return zeroXOrders;
  }

  async clearDBAndCacheOrders(): Promise<void> {
    // Note: This does mean if a user reloads before syncing the old orders could be lost if they previous to that had not broadcast their orders completely somehow
    this.pastOrders = _.keyBy(await this.allDocs(), 'orderHash');
    await this.clearDB();
  }

  subscribeToOrderEvents() {
    // This only works if `zeroX` has been set on the augur instance and
    // it doesn't get over-written so... something.
    this.augur.events.on('ZeroX:Mesh:OrderEvent', (orderEvents) => this.handleOrderEvent(orderEvents));
    this.augur.events.on('ZeroX:RPC:OrderEvent', (orderEvents) => this.handleOrderEvent(orderEvents));
  }

  async handleOrderEvent(orderEvents: OrderEvent[]): Promise<void> {
    if (orderEvents.length < 1) return;

    const filteredOrders = _.filter(orderEvents, this.validateOrder.bind(this));
    let documents: StoredOrder[] = _.map(filteredOrders, this.processOrder.bind(this));

    // Remove Canceled, Expired, and Invalid Orders and emit event
    const canceledOrders = _.keyBy(
      _.filter(filteredOrders, (orderEvent => orderEvent.endState === 'CANCELLED' || orderEvent.endState === 'EXPIRED' || orderEvent.endState === 'INVALID' || orderEvent.endState === 'UNFUNDED')),
      'orderHash'
    );

    for (const d of documents) {
      if (canceledOrders[d.orderHash]) {
        documents = _.filter(documents, (orderEvent => orderEvent.orderHash !== d.orderHash));
        this.table.where('orderHash').equals(d.orderHash).delete();
        this.augur.events.emit('OrderEvent', {eventType: OrderEventType.Cancel, orderId: d.orderHash,...d});
        this.augur.events.emit('DB:updated:ZeroXOrders', {eventType: OrderEventType.Cancel, orderId: d.orderHash,...d});
      }
    }

    // Deal with partial fills and emit event
    const filledOrders = _.keyBy(
      _.filter(filteredOrders, (orderEvent => orderEvent.endState === 'FILLED' || orderEvent.endState === 'FULLY_FILLED')),
      'orderHash'
    );

    documents = _.filter(documents, this.validateStoredOrder.bind(this));
    await this.saveDocuments(documents);
    for (const d of documents) {
      const eventType = filledOrders[d.orderHash] ? OrderEventType.Fill : OrderEventType.Create;
      this.augur.events.emit('OrderEvent', {eventType, orderId: d.orderHash,...d});
      this.augur.events.emit('DB:updated:ZeroXOrders', {eventType, orderId: d.orderHash,...d});
    }
  }

  async sync(): Promise<void> {
    console.log('Syncing ZeroX Orders');
    const orders: OrderInfo[] = await this.augur.zeroX.getOrders();
    let documents;
    if (orders && orders.length > 0) {
      documents = _.filter(orders, this.validateOrder.bind(this));
      documents = _.map(documents, this.processOrder.bind(this));
      const marketIds: string[] = _.uniq(_.map(documents, 'market'));
      const markets = _.keyBy(await this.stateDB.Markets.where('market').anyOf(marketIds).toArray(), 'market');
      documents = _.filter(documents, (document) => {
        return this.validateStoredOrder(document, markets);
      });
      _.each(documents, (doc) => { delete this.pastOrders[doc.orderHash] });
      await this.saveDocuments(documents);
      for (const d of documents) {
        this.augur.events.emit('OrderEvent', {eventType: OrderEventType.Create, ...d});
      }
    }
    const chainId = Number(this.augur.config.networkId);
    const ordersToAdd = _.map(_.values(this.pastOrders), (order) => {
      const signedOrder = order.signedOrder;
      return Object.assign({
        chainId,
        makerFeeAssetData: '0x',
        takerFeeAssetData: '0x',
      }, signedOrder);
    });

    if (ordersToAdd.length > 0) await this.augur.zeroX.addOrders(ordersToAdd);
    console.log(`Synced ${orders.length } ZeroX Orders`);
  }

  validateOrder(order: OrderInfo): boolean {
    if (!order.signedOrder.makerAssetAmount.eq(order.signedOrder.takerAssetAmount)) return false;
    if (order.signedOrder.makerAssetData.length !== EXPECTED_ASSET_DATA_LENGTH) return false;
    if (order.signedOrder.takerAssetData !== this.takerAssetData) return false;
    return true;
  }

  validateStoredOrder(storedOrder: StoredOrder, markets: _.Dictionary<MarketData>): boolean {
    // Validate the order is a multiple of the recommended trade interval
    let tradeInterval = DEFAULT_TRADE_INTERVAL;
    const marketData = markets[storedOrder.market];
    if (storedOrder.invalidOrder) return false;
    if (marketData && marketData.marketType == MarketType.Scalar) {
      tradeInterval = getTradeInterval(new BigNumber(marketData.prices[0]), new BigNumber(marketData.prices[1]), new BigNumber(marketData.numTicks));
    }
    if (!storedOrder['numberAmount'].mod(tradeInterval).isEqualTo(0)) return false;

    if (storedOrder.numberAmount.isEqualTo(0)) {
      console.log('Deleting filled order');
      this.table.where('orderHash').equals(storedOrder.orderHash).delete();
      this.augur.events.emit('OrderEvent', {eventType: OrderEventType.Fill, orderId: storedOrder.orderHash,...storedOrder});
      this.augur.events.emit('DB:updated:ZeroXOrders', {eventType: OrderEventType.Fill, orderId: storedOrder.orderHash,...storedOrder});
      return false;
    }
    return true;
  }

  processOrder(order: OrderInfo): StoredOrder {
    const augurOrderData = this.parseAssetDataAndValidate(order.signedOrder.makerAssetData);
    const signedOrder = order.signedOrder;
    return {
      orderId: order.orderHash,
      market: augurOrderData.market,
      price: augurOrderData.price,
      outcome: augurOrderData.outcome,
      orderType: augurOrderData.orderType,
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

  parseAssetDataAndValidate(assetData: string): OrderData {
    try {
      const { orderData, multiAssetData } = ZeroXOrders.parseAssetData(assetData);
      orderData.invalidOrder = !this.isValidMultiAssetFormat(multiAssetData);
      return orderData;
    } catch(e) {
      throw new Error(`Validation raised error. Error: ${e}`);
    }
  }

  static parseAssetData(assetData: string): ParsedAssetDataResults {
    try {
      const multiAssetData = defaultAbiCoder.decode(multiAssetDataAbi, `0x${assetData.slice(10)}`);
      const nestedAssetData = multiAssetData[1] as string[];
      const orderData = ZeroXOrders.parseTradeAssetData(nestedAssetData[0]);
      return {
        orderData,
        multiAssetData
      };
    } catch(e) {
      throw new Error(`Order not in multi-asset format. Error: ${e}`);
    }
  }

  isValidMultiAssetFormat(multiAssetData: any): boolean {
    const amounts = multiAssetData[0] as BigNumber[];
    if (amounts.length !== 3) return false;
    if (!amounts[0].eq(1)) return false;
    if (!amounts[1].eq(0)) return false;
    if (!amounts[2].eq(0)) return false;
    const nestedAssetData = multiAssetData[1] as string[];
    const tradeTokenAssetData = nestedAssetData[0];
    const cashAssetData = nestedAssetData[1];
    const shareAssetData = nestedAssetData[2];
    if (tradeTokenAssetData.substr(34, 40) !== this.tradeTokenAddress) return false;
    if (cashAssetData !== this.cashAssetData) return false;
    if (shareAssetData !== this.shareAssetData) return false;
    return true;
  }

  static parseTradeAssetData(assetData: string): OrderData {
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
}
