import Dexie, {
  PromiseExtended,
} from 'dexie';

export function CollectionParaFilterAddOn (db: Dexie) {
  const originalToArray = db.Collection.prototype.toArray;
  // @todo Need to add the ignored types to Dexie type def.
  // @ts-ignore
  db.Collection.prototype.toArrayOriginal = originalToArray;
  db.Collection.prototype.toArray = function toArray<R>(cb?): PromiseExtended<any[]> {
    return originalToArray.call(this, cb).then((results) => {
      // Check if we need to filter para this table.
      // @ts-ignore
      if (db.paraEventNames.includes(this._ctx.table.name)) {
        return results.filter((log) => {
          // @ts-ignore
          if(typeof db.paraDeploy === 'string') {
            // @ts-ignore
            return log.para === db.paraDeploy
          } else {
            return typeof log.para === 'undefined';
          }
        });
      } else {
        return results;
      }
    });
  }
}

Dexie.addons.push(CollectionParaFilterAddOn);
