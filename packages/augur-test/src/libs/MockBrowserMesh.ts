import { BigNumber } from "bignumber.js";
import {
    BrowserMesh,
    BrowserMeshConfiguration,
    WrapperOrderEvent,
    ZeroXTradeOrder,
    WrapperValidationResults,
    WrapperAcceptedOrderInfo,
    WrapperSignedOrder
} from '@augurproject/sdk';
import { WSClient } from '@0x/mesh-rpc-client';
import * as _ from 'lodash';

export class MockBrowserMesh {
    readonly meshClient: WSClient;
    readonly orders: {[orderHash: string]: WrapperAcceptedOrderInfo};
    private errorCallback: (err: Error) => void = console.log;
    private orderEventsCallback: (events: WrapperOrderEvent[]) => void;

    constructor(meshClient: WSClient) {
        this.meshClient = meshClient;
        this.orders = {};
    }

    async startAsync(): Promise<void> {
        return;
    }

    onError(handler: (err: Error) => void): void {
        this.errorCallback = handler;
    }

    onOrderEvents(handler: (events: WrapperOrderEvent[]) => void): void {
        this.orderEventsCallback = handler;
    }

    async addOrdersAsync(orders: WrapperSignedOrder[]): Promise<WrapperValidationResults> {
        const accepted = [];
        const rejected = [];
        try {
            for (const order of orders) {
                const storedOrder: WrapperAcceptedOrderInfo = {
                    orderHash: order.orderHash,
                    signedOrder: order,
                    fillableTakerAssetAmount: order.takerAssetAmount,
                    isNew: true
                }
                this.orders[order.orderHash] = storedOrder;
                accepted.push(storedOrder);
            }
            this.broadcastOrders(orders);
        } catch (err) {
            if (this.errorCallback) {
                this.errorCallback(err);
            }
        }
        this.notifySubscribersOrderAdded(accepted);
        return {
            accepted,
            rejected
        }
    }

    broadcastOrders(orders: WrapperSignedOrder[]): void {
        const clientOrders = _.map(orders, (order) => {
            return Object.assign(order, {
                makerAssetAmount: new BigNumber(order.makerAssetAmount),
                takerAssetAmount: new BigNumber(order.takerAssetAmount),
                makerFee: new BigNumber(order.makerFee),
                takerFee: new BigNumber(order.takerFee),
                expirationTimeSeconds: new BigNumber(order.expirationTimeSeconds),
                salt: new BigNumber(order.salt),
            })
        })
        this.meshClient.addOrdersAsync(clientOrders);
    }

    notifySubscribersOrderAdded(orders: WrapperOrderEvent[]): void {
        if (this.orderEventsCallback) {
            this.orderEventsCallback(orders);
        }
    }
}