import * as Comlink from 'comlink';

import './MeshTransferHandler';
import 'localstorage-polyfill';

// @ts-ignore
self.window = self;

// @ts-ignore
self.document = {
  createEvent: type => new CustomEvent(type),
};

const {
  loadMeshStreamingWithURLAsync,
  Mesh,
} = require('@0x/mesh-browser-lite');

Comlink.expose({
  loadMesh: () => loadMeshStreamingWithURLAsync('zerox.wasm'),
  Mesh,
});
