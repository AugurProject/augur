import { retry } from 'async';
import * as Comlink from 'comlink';
import 'localstorage-polyfill';
import type { BrowserMesh } from '@augurproject/sdk';
import './MeshTransferHandler';

// @ts-ignore
self.window = self;

// @ts-ignore
self.document = {
  createEvent: (type) => new CustomEvent(type),
};

const {
  loadMeshStreamingWithURLAsync,
  Mesh,
} = require('@0x/mesh-browser-lite');

let mesh: BrowserMesh | null = null;

const loadMesh = async () => loadMeshStreamingWithURLAsync('zerox.wasm');
Comlink.expose({
  loadMesh: () =>
    new Promise((resolve, reject) =>
      retry(5, loadMesh, (err, result) => {
        if (err) reject(err);
        resolve(result);
      })
    ),
  onOrderEvents(cb) {
    if (mesh) mesh.onOrderEvents(cb);
  },
  startAsync() {
    if (mesh) return mesh.startAsync();
  },
  startMesh(meshConfig, sendAsync) {
    mesh = new Mesh({
      ...meshConfig,
      web3Provider: {
        sendAsync: (args, cb) => {
          sendAsync(args, Comlink.proxy(cb));
        },
      },
    });
  },
  getOrdersAsync() {
    if (mesh) return mesh.getOrdersAsync();
    return [];
  },
  addOrdersAsync(orders, pinned?) {
    if (mesh) return mesh.addOrdersAsync(orders, pinned);
  },
  onError(cb) {
    if (mesh) return mesh.onError(cb);
  },
});
