import Dexie, {
  PromiseExtended,
} from 'dexie';
import { queue } from 'async';

export function CollectionQueueAddOn (db: Dexie) {
  const originalToArray = db.Collection.prototype.toArray;
  const toArrayQueue = queue(async ({collection, cb}) => {
    console.log('Reading Query');
    return originalToArray.call(collection, cb)
  }, 1);

  db.Collection.prototype.toArray = function toArray(cb?): PromiseExtended<any[]> {
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
