import { queue, retry, timeout } from 'async';
import Dexie, { Collection, PromiseExtended, Table } from 'dexie';

export enum WriteTaskType {
  ADD,
  PUT,
  UPSERT,
  CLEAR,
  READ,
}


interface DBQueueTask<T, R> {
  methodName: string;
  args: any[];
  scope: Collection<T> | Table<T>;
};

export function CollectionQueueAddOn (db: Dexie) {
  const originals = {
    'bulkAdd': db.table.prototype.bulkAdd,
    'bulkPut': db.table.prototype.bulkPut,
    'clear': db.table.prototype.clear,
    'toArray': db.Collection.prototype.toArray
  };

  const dbOperationQueue = queue<DBQueueTask<any, any>>(({args, methodName, scope}, callback) => {
    return retry(
      {
        times: 5,
        interval: function (retryCount) {
          return 100;
        },
        errorFilter: function (err) {
          return err['code'] === "ETIMEDOUT";
        }
      }, timeout(async function ReadOperation() {
        return originals[methodName].call(scope, ...args);
    }, 10000), callback);
  }, 10);

  const generateQueueCallback = (methodName) => function(...args): PromiseExtended<any[]> {
    return new Dexie.Promise((resolve, reject) => {
      // @ts-ignore
      dbOperationQueue.push({ scope: this, args, methodName  }, (err, result:any[]) => {
        if (err) {
          console.log('ReadOperationDied')
          reject(err);
        }
        resolve(result);
      });
    });
  }

  db.table.prototype.bulkAdd = generateQueueCallback('bulkAdd');
  db.table.prototype.bulkPut = generateQueueCallback('bulkPut');
  db.table.prototype.clear = generateQueueCallback('clear');
  db.Collection.prototype.toArray = generateQueueCallback('toArray');
}

// Register the addon to be included by default (optional)
Dexie.addons.push(CollectionQueueAddOn);
