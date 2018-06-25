import * as repl from "repl";
import { augurEmitter } from "./events";
import "./runServer";

const replServer = repl.start();
replServer.context.augurEmitter = augurEmitter;
