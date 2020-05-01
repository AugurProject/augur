export async function persist(): Promise<boolean> {
  return navigator?.storage?.persist();
}

export async function isStoragePersisted(): Promise<boolean> {
  return navigator?.storage?.persisted();
}

export function canPersist(): boolean {
  return Boolean(navigator?.storage);
}

export async function tryToPersistStorage() {
  if (canPersist()) {
    const storagePersisted = await isStoragePersisted();
    if (storagePersisted) {
      console.log('Storage is successfully persisted.');
    } else {
      console.warn('Storage is not persisted.');
      console.log('Trying to persist..:');
      if (await persist()) {
        console.log('Successfully turned the storage to be persisted.');
      } else {
        console.error('Failed to make storage persisted');
      }
    }
  } else {
    console.log('Storage persistence is not supported.');
  }
}
