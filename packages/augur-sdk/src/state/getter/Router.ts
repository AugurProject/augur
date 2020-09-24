import { logger, LoggerLevels } from '@augurproject/utils/build';
import { AsyncQueue, queue } from 'async';

import * as t from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { Augur } from '../../Augur';
import { AddressFormatReviver } from '../../state/AddressFormatReviver';
import { DB } from '../db/DB';

interface RequestQueueTask {
  name: string;
  params: any;
}

export function Getter(alternateInterface?: string) {
  return (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void => {
    if (!target || !target.name) {
      throw new Error(
        `Getter function on ${target.constructor.name} must be declared public static`
      );
    }

    if (alternateInterface) {
      if (!Object(target)[alternateInterface]) {
        throw new Error(`No params object for ${target.name} getter`);
      }

      Router.Add(
        propertyKey,
        descriptor.value,
        Object(target)[alternateInterface]
      );
    } else {
      if (!Object(target)[target.name + 'Params']) {
        throw new Error(`No params object for ${target.name}Params getter`);
      }

      Router.Add(
        propertyKey,
        descriptor.value,
        Object(target)[target.name + 'Params']
      );
    }

    Object.defineProperty(Object(target)[propertyKey], 'name', {
      value: propertyKey,
      writable: false,
    });
  };
}

type GetterFunction<T, TBigNumber> = (db: DB, params: T) => Promise<unknown>;

export class Router {
  static Add<T, R, TBigNumber>(
    name: string,
    getterFunction: GetterFunction<T, TBigNumber>,
    decodedParams: t.Validation<T>
  ) {
    Router.routings.set(name, { func: getterFunction, params: decodedParams });
  }

  private static routings = new Map();

  private readonly augur: Augur;
  private readonly db: Promise<DB>;
  private requestQueue: AsyncQueue<RequestQueueTask>;

  constructor(augur: Augur, db: Promise<DB>) {
    this.augur = augur;
    this.db = db;

    this.requestQueue = queue(
      async (task: RequestQueueTask) => {
        return this.executeRoute(task.name, task.params);
      },
      10
    );
  }

  async route(name: string, params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ name, params }, (err, results) => {
        if (err) {
          reject(err);
        }
          resolve(results);
      });
    });
  }

  async executeRoute(name: string, params: any): Promise<any> {
    const timerName = `getter: ${name} called at ${Date.now()}`;

    logger.time(LoggerLevels.debug, timerName);
    if (name !== 'getMostRecentWarpSync' && name !== 'getWarpSyncStatus' && process.env.NODE_ENV !== 'test') {
      const cachedResult = await (await this.db).getterCache.getCachedResponse(name, params);
      if (cachedResult !== null) {
        console.log(`CACHE HIT: ${name}`);
        logger.timeEnd(LoggerLevels.debug, timerName);
        return cachedResult.response;
      } else {
        console.log(`CACHE MISS: ${name}`);
      }
    }

    const getter = Router.routings.get(name);

    if (!getter) {
      throw new Error(`Invalid request ${name}`);
    }

    if (!getter.params) {
      throw new Error('no params type for getter ${name}');
    }

    const decodedParams = getter.params.decode(params);

    if (!decodedParams.isRight()) {
      throw new Error(
        `Invalid request object: ${PathReporter.report(decodedParams)}`
      );
    }

    for (const key in decodedParams.value) {
      decodedParams.value[key] = AddressFormatReviver(
        key,
        decodedParams.value[key]
      );
    }

    const db = await this.db;
    const result = await getter.func(this.augur, db, decodedParams.value);

    if (name !== "getMostRecentWarpSync" && name !== 'getWarpSyncStatus' && process.env.NODE_ENV !== 'test') {
      await (await this.db).getterCache.cacheResponse(name, params, result);
    }

    logger.timeEnd(LoggerLevels.debug, timerName);
    return result;
  }
}
