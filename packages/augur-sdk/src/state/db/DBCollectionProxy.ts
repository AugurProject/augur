import Dexie, {
  Collection, IndexableType,
  PromiseExtended,
  ThenShortcut,
} from 'dexie';
import { queue, timeout, retry } from 'async';

interface ToArrayQueueTask<T, R> {
  cb?: ThenShortcut<T[], R>;
  collection: Collection<T>;
};

export function CollectionQueueAddOn (db: Dexie) {
  const originalToArray = db.Collection.prototype.toArray;
  const toArrayQueue = queue<ToArrayQueueTask<any, any>>(({collection, cb}, callback) => {
    return retry(
      {
        times: 2,
        interval: function (retryCount) {
          return 100;
        },
        errorFilter: function (err) {
          return err['code'] === "ETIMEDOUT";
        }
      }, timeout(async function ReadOperation() {
      console.log('Reading Query');
      return originalToArray.call(collection, cb);
    }, 2500), callback);
  }, 1);

  db.Collection.prototype.toArray = function toArray<R>(cb?): PromiseExtended<any[]> {
    return new Dexie.Promise((resolve, reject) => {
      toArrayQueue.push({ collection: this, cb }, (err, result:any[]) => {
        if (err) {
          console.log('ReadOperationDied')
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

// Register the addon to be included by default (optional)
Dexie.addons.push(CollectionQueueAddOn);
