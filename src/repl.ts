import * as repl from "repl";
import { augurEmitter } from "./events";
import "./index";

const replServer = repl.start();
replServer.context.augurEmitter = augurEmitter;
