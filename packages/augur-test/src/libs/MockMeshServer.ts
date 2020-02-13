import { SignedOrder } from '@0x/types';
import { logUtils } from '@0x/utils';
import * as http from 'http';
import * as _ from 'lodash';
import * as WebSocket from 'websocket';

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
    let port = SERVER_PORT + Math.floor(Math.random() * 1000);
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
            keepalive: true,
            disableNagleAlgorithm: false,
        });

        server.on('listening', () => {
            resolve({port, wsServer});
        })

        server.on('error', (e: any) => {
            if (e.code === 'EADDRINUSE') {
                port = SERVER_PORT + Math.floor(Math.random() * 1000);
                server.close();
                server.listen(port);
            }
        });

        server.listen(port);
    });
}

/**
 * Stops the test WS server
 */
export function stopServer(): void {
    try {
        server.close()
        wsServer.shutDown();
    } catch (e) {
        logUtils.log('stopServer threw', e);
    }
}

export class MockMeshServer {
    readonly orders: {[orderHash: string]: StoredOrder};
    readonly server: WebSocket.Server;
    private _subInterval: any = null;

    constructor(wsServer: WebSocket.Server) {
        this.server = wsServer;
        this.orders = {};
        this.initialize();
    }

    static async create(): Promise<{port: number, meshServer: MockMeshServer }> {
        const { port, wsServer } = await setupServerAsync();
        const meshServer = new MockMeshServer(wsServer);
        return { port, meshServer };
    }

    initialize(): void {
        let self = this;
        this.server.on('connect', ((connection: WebSocket.connection) => {
            connection.on('message', ((message: WSMessage) => {
                const jsonRpcRequest = JSON.parse(message.utf8Data);
                let response = "";
                if (jsonRpcRequest.method == "mesh_getOrders") response = self.getOrders(jsonRpcRequest.id, jsonRpcRequest.params);
                else if (jsonRpcRequest.method == "mesh_addOrders") response = self.addOrders(jsonRpcRequest.id, jsonRpcRequest.params, connection);
                else if (jsonRpcRequest.method == "mesh_subscribe") response = self.subscribe(jsonRpcRequest.id, jsonRpcRequest.params, connection);
                else throw new Error(`Bad Request: ${jsonRpcRequest.method}`);
                connection.sendUTF(response);
            }) as any);
        }) as any);
    }

    subscribe(id: number, params: string[], connection: WebSocket.connection): string {
        let subscription =  "0xdeadbeefdeadbeefdeadbeefdeadbeef";
        const heartbeatSub =  "0xab1a3e8af590364c09d0fa6a12103ada";

        if (params[0] === "heartbeat") {
            subscription = heartbeatSub;
            if (this._subInterval !== null) {
              throw new Error("Attempting to subscribe twice to the mock relayer. Make sure tests unsubscribe.")
            }

            this._subInterval = setInterval(() => {
                connection.sendUTF(JSON.stringify({
                    jsonrpc: "2.0",
                    method: "mesh_subscription",
                    params: {
                        subscription: heartbeatSub,
                        result: "tick"
                    }
                }))
            }, 10000);
        }

        return JSON.stringify({
            id,
            jsonrpc: "2.0",
            result: subscription
        });
    }

    unsubscribe(id: number): string {
      clearInterval(this._subInterval);
      this._subInterval = null;

      return JSON.stringify({
        id,
        jsonrpc: '2.0',
        result: '0xab1a3e8af590364c09d0fa6a12103ada'
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

    addOrders(id: number, params: any[][], connection: WebSocket.connection): string {
        const newOrders = params[0];
        const accepted = [];
        for (const order of newOrders) {
            const storedOrder: StoredOrder = {
                orderHash: order.hash,
                signedOrder: order,
                fillableTakerAssetAmount: order.takerAssetAmount,
            }
            this.orders[order.hash] = storedOrder;
            accepted.push(storedOrder);
            this.notifySubscribersOrderAdded(storedOrder, connection);
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

    // We're just assuming we're subscribed since for our tests cases we always are. Passing around the connection like this normally isnt how itd be handled.
    notifySubscribersOrderAdded(order: StoredOrder, connection: WebSocket.connection): void {
        const response = {
            jsonrpc: "2.0",
            method: "mesh_subscription",
            params: {
                subscription: "0xab1a3e8af590364c09d0fa6a12103ada",
                result: [
                    Object.assign(order, {
                        "kind": "ADDED",
                        "txHash": "0x9e6830a7044b39e107f410e4f765995fd0d3d69d5c3b3582a1701b9d68167560"
                    })
                ]
            }
        }
        connection.sendUTF(JSON.stringify(response));
    }
}
