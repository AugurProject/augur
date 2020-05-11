export function showIndexedDbSize() {
  'use strict';

  function openDatabases(...dbnames) {
    console.log('dbnames', dbnames);
    return Promise.all(
      dbnames.map(dbname =>
        new Promise(function(resolve, reject) {
          var request = window.indexedDB.open(dbname);
          request.onsuccess = function(event) {
            const db = event.target.result;
            resolve(db);
          };
        }).then(async db => {
          var PromiseArray = [];
          console.log('total:', db.objectStoreNames.length);
          for (var i = 0; i < db.objectStoreNames.length; i++) {
            PromiseArray.push(
              await getObjectStoreData(db, db.objectStoreNames[i], i)
            );
          }
          console.log('done', JSON.stringify(PromiseArray));

          return PromiseArray;
        })
      )
    ).then(amount => {
      return [].concat(...amount);
    });
  }

  function getObjectStoreData(db, storename) {
    return new Promise(function(resolve, reject) {
      var trans = db.transaction(storename, IDBTransaction.READ_ONLY);
      var store = trans.objectStore(storename);
      var items = [];
      trans.oncomplete = function(evt) {
        var szBytes = toSize(items);
        var szMBytes = (szBytes / 1024 / 1024).toFixed(2);

        resolve({
          'Store Name': storename,
          Items: items.length,
          Size: szMBytes + 'MB (' + szBytes + ' bytes)',
        });
      };
      var cursorRequest = store.openCursor();
      cursorRequest.onerror = function(error) {
        reject(error);
      };
      cursorRequest.onsuccess = function(evt) {
        var cursor = evt.target.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        }
      };
    });
  }

  function toSize(items) {
    var size = 0;
    for (var i = 0; i < items.length; i++) {
      var objectSize = JSON.stringify(items[i]).length;
      size += objectSize * 2;
    }
    return size;
  }

  function process(storesizes) {
    console.table(storesizes);
  }

  openDatabases(
    './data',
    'data/blocks',
    'data/datastore',
    'data/keys',
    '0x-mesh-db',
    'augur-42'
  ).then(process);
}
