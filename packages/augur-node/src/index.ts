import Knex from "knex";
import * as getters  from "./server/getters";
import {Augur} from "./types";

type GetterFunction = (db: Knex, augur: Augur, params: any) => Promise<any>;
type GetterParamType<T extends GetterFunction> = Parameters<T>[2];
type ReturnPromiseType<T> = T extends (...args: any) => Promise<infer R> ? R : any;
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type GetterFunctionParameterTypes<T> = {
  [P in FunctionPropertyNames<T>]: T[P] extends GetterFunction ? GetterParamType<T[P]> : never
};
type GetterFunctionReturnTypes<T> = {
  [P in FunctionPropertyNames<T>]: T[P] extends GetterFunction ? ReturnPromiseType<T[P]> : never
};

export type Params = GetterFunctionParameterTypes<typeof getters>;
export type Return = GetterFunctionReturnTypes<typeof getters>;

export * from "./constants";
export * from "./controller";
