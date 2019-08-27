import { logUtils } from '@0x/utils';
import { SignedOrder } from '@0x/types';
import * as http from 'http';
import * as WebSocket from 'websocket';
import * as _ from 'lodash';

const DEFAULT_STATUS_CODE = 404;
export const SERVER_PORT = 64321;
// tslint:disable-next-line:custom-no-magic-numbers
const sixtyFourMB = 64 * 1024 * 1024; // 64MiB

let server: http.Server;
let wsServer: WebSocket.server;

export interface WSMessage {
    type: string;
    utf8Data: string;
}

export interface StoredOrder {
    orderHash: string,
    signedOrder: SignedOrder,
    fillableTakerAssetAmount: string,
}

/**
 * Sets up a new test WS server
 * @return A WS server
 */
export async function setupServerAsync(): Promise<WebSocket.server> {
    return new Promise<WebSocket.server>((resolve, reject) => {
        server = http.createServer((_request, response) => {
            response.writeHead(DEFAULT_STATUS_CODE);
            response.end();
        });

        wsServer = new WebSocket.server({
            httpServer: server,
            autoAcceptConnections: true,
            maxReceivedFrameSize: sixtyFourMB,
            maxReceivedMessageSize: sixtyFourMB,
            fragmentOutgoingMessages: false,
            keepalive: false,
            disableNagleAlgorithm: false,
        });

        server.listen(SERVER_PORT, () => {
            resolve(wsServer);
        });
    });
}

/**
 * Stops the test WS server
 */
export function stopServer(): void {
    try {
        wsServer.shutDown();
        server.close();
    } catch (e) {
        logUtils.log('stopServer threw', e);
    }
}

export class MockMeshServer {
    readonly orders: {[orderHash: string]: StoredOrder};
    readonly server: WebSocket.Server;

    constructor(wsServer: WebSocket.Server) {
        this.server = wsServer;
        this.orders = {};
        this.initialize();
    }

    static async create(): Promise<MockMeshServer> {
        const wsServer = await setupServerAsync();
        const meshServer = new MockMeshServer(wsServer);
        return meshServer;
    }

    initialize(): void {
        let self = this;
        this.server.on('connect', ((connection: WebSocket.connection) => {
            connection.on('message', ((message: WSMessage) => {
                const jsonRpcRequest = JSON.parse(message.utf8Data);
                let response = "";
                if (jsonRpcRequest.method == "mesh_getOrders") response = self.getOrders(jsonRpcRequest.id, jsonRpcRequest.params);
                else if (jsonRpcRequest.method == "mesh_addOrders") response = self.addOrders(jsonRpcRequest.id, jsonRpcRequest.params);
                else if (jsonRpcRequest.method == "mesh_subscribe") response = self.subscribe(jsonRpcRequest.id);
                else throw new Error(`Bad Request: ${jsonRpcRequest.method}`);
                connection.sendUTF(response);
            }) as any);
        }) as any);
    }

    subscribe(id: number): string {
        return JSON.stringify({
            id,
            jsonrpc: "2.0",
            result: "0xab1a3e8af590364c09d0fa6a12103ada"
        });
    }

    getOrders(id: number, params: any[]): string {
        const page = params[0];
        const response = {
            id,
            jsonrpc: "2.0",
            result: {
                snapshotID: "123",
                ordersInfos: []
            }
        };
        if (page > 0) return JSON.stringify(response);

        _.forEach(this.orders, (order) => {
            response.result.ordersInfos.push(order);
        });
        return JSON.stringify(response);
    }

    addOrders(id: number, params: any[][]): string {
        const newOrders = params[0];
        const accepted = [];
        for (const order of newOrders) {
            const storedOrder: StoredOrder = {
                orderHash: order.orderHash,
                signedOrder: order,
                fillableTakerAssetAmount: order.takerAssetAmount,
            }
            this.orders[order.hash] = storedOrder;
            accepted.push(storedOrder);
        }
        return JSON.stringify({
            id,
            jsonrpc: "2.0",
            result: {
                accepted,
                rejected: []
            }
        });
    }
}