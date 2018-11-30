import * as repl from "repl";
import { augurEmitter } from "./events";
import "./runServer";

const replServer = repl.start();

Object.defineProperty(replServer.context, 'augurEmitter', {
  configurable: false,
  enumerable: true,
  value: augurEmitter
});

