import { API } from "./API";
import { Augur } from "@augurproject/api";
import { DB } from "../db/DB";
import { PathReporter } from "io-ts/lib/PathReporter";

import * as t from "io-ts";

export function Getter(alternateInterface?: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
    if (alternateInterface) {
      Router.Add(propertyKey, descriptor.value, Object(target)[alternateInterface]);

    } else {
      Router.Add(propertyKey, descriptor.value, Object(target)[target.name + "Params"]);
    }
  };
}

type GetterFunction<T, TBigNumber> = (db: DB<TBigNumber>, params: T) => Promise<unknown>;

export class Router<TBigNumber> {
  public static Add<T, R, TBigNumber>(name: string, getterFunction: GetterFunction<T, TBigNumber>, decodedParams: t.Validation<T>) {
    Router.routings.set(name, { func: getterFunction, params: decodedParams });
  }

  private static routings = new Map();

  private readonly augurAPI: Augur<TBigNumber>;
  private readonly db: DB<TBigNumber>;

  constructor(augurAPI: Augur<TBigNumber>, db: DB<TBigNumber>) {
    this.augurAPI = augurAPI;
    this.db = db;

    console.log("Blah de blah");
  }

  public route(name: string, params: any): Promise<any> {
    const getter = Router.routings.get(name);
    const decodedParams = getter.params.decode(params);

    if (!decodedParams.isRight()) {
      throw new Error(`Invalid request object: ${PathReporter.report(decodedParams)}`);
    }

    return getter.func(this.db, decodedParams);
  }
}
