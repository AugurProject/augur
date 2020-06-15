import * as Comlink from 'comlink';

import './MeshTransferHandler';
import 'localstorage-polyfill';
import { retry } from 'async';

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

const loadMesh = async () => loadMeshStreamingWithURLAsync('zerox.wasm');
Comlink.expose({
  loadMesh,
  Mesh,
});
