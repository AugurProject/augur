import Dexie, {
  Collection, IndexableType,
  PromiseExtended,
  ThenShortcut,
} from 'dexie';
import { queue, timeout } from 'async';

interface ToArrayQueueTask<T, R> {
  cb?: ThenShortcut<T[], R>;
  collection: Collection<T>;
};

export function CollectionQueueAddOn (db: Dexie) {
  const originalToArray = db.Collection.prototype.toArray;
  const toArrayQueue = queue<ToArrayQueueTask<any, any>>(({collection, cb}, callback) => {
    return timeout(async (args) => {
      console.log('Reading Query');
      return originalToArray.call(collection, cb);
    }, 2500)(callback);
  }, 2);

  db.Collection.prototype.toArray = function toArray<R>(cb?): PromiseExtended<any[]> {
    return new Dexie.Promise((resolve, reject) => {
      toArrayQueue.push({ collection: this, cb }, (err, result:any[]) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

// Register the addon to be included by default (optional)
Dexie.addons.push(CollectionQueueAddOn);
