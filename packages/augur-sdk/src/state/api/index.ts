import {Markets} from "./Markets";
import {Augur} from "../../Augur";
import {DB} from "../db/DB";

type GetterFunction = (augur: Augur, db: DB, params: any) => Promise<any>;
export type GetterParamType<T extends GetterFunction> = Parameters<T>[2];
type ReturnPromiseType<T> = T extends (...args: any) => Promise<infer R> ? R : any;
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type GetterFunctionParameterTypes<T> = {
  [P in FunctionPropertyNames<T>]: T[P] extends GetterFunction ? GetterParamType<T[P]> : never
};
type GetterFunctionReturnTypes<T> = {
  [P in FunctionPropertyNames<T>]: T[P] extends GetterFunction ? ReturnPromiseType<T[P]> : never
};

export type MarketGetterParamTypes = GetterFunctionParameterTypes<typeof Markets>;
export type MarketGetterReturnTypes = GetterFunctionReturnTypes<typeof Markets>;

