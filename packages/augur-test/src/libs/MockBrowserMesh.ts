import { OrderInfo, WSClient, OrderEvent, AcceptedOrderInfo, SignedOrder } from '@0x/mesh-rpc-client';
import { ValidationResults, GetOrdersResponse } from '@0x/mesh-browser';
import { orderHashUtils } from '@0x/order-utils';

export class MockBrowserMesh {
    readonly meshClient: WSClient;
    readonly otherBrowserMeshes: MockBrowserMesh[];
    readonly orders: {[orderHash: string]: OrderInfo};
    private errorCallback: (err: Error) => void = console.log;
    private orderEventsCallback: (events: OrderEvent[]) => void;
    async getOrdersAsync(): Promise<GetOrdersResponse> {
        var x: GetOrdersResponse;
        return x;
    }

    constructor(meshClient: WSClient) {
        this.meshClient = meshClient;
        this.otherBrowserMeshes = [];
        this.orders = {};
    }

    addOtherBrowserMeshToMockNetwork(browserMesh: MockBrowserMesh): void {
        this.otherBrowserMeshes.push(browserMesh);
    }

    async startAsync(): Promise<void> {
        return;
    }

    onError(handler: (err: Error) => void): void {
        this.errorCallback = handler;
    }

    onOrderEvents(handler: (events: OrderEvent[]) => void): void {
        this.orderEventsCallback = handler;
    }

    async addOrdersAsync(orders: SignedOrder[], broadcast: boolean = true): Promise<ValidationResults> {
        const accepted = [];
        const rejected = [];
        try {
            for (const order of orders) {
                const orderHash = orderHashUtils.getOrderHashHex(order);
                const storedOrder: AcceptedOrderInfo = {
                    orderHash,
                    signedOrder: order,
                    fillableTakerAssetAmount: order.takerAssetAmount,
                    isNew: true
                }
                this.orders[orderHash] = storedOrder;
                accepted.push(storedOrder);
            }
            if (broadcast) this.broadcastOrders(orders);
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

    broadcastOrders(orders: SignedOrder[]): void {
        this.meshClient.addOrdersAsync(orders);
        for (const browserMesh of this.otherBrowserMeshes) {
            browserMesh.addOrdersAsync(orders, false);
        }
    }

    notifySubscribersOrderAdded(orders: OrderEvent[]): void {
        if (this.orderEventsCallback) {
            this.orderEventsCallback(orders);
        }
    }
}
