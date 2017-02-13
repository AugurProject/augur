export const savePersistentAccountToLocalStorage = (account) => {
  const localStorageRef = typeof window !== 'undefined' && window.localStorage;
  if (localStorageRef && localStorageRef.setItem) {
    const persistentAccount = { ...account };
    if (Buffer.isBuffer(persistentAccount.privateKey)) {
      persistentAccount.privateKey = persistentAccount.privateKey.toString('hex');
    }
    if (Buffer.isBuffer(persistentAccount.derivedKey)) {
      persistentAccount.derivedKey = persistentAccount.derivedKey.toString('hex');
    }
    localStorageRef.setItem('account', JSON.stringify(persistentAccount));
  }
};
