export async function persist() {
    return await navigator.storage && navigator.storage.persist && navigator.storage.persist();
}

export async function isStoragePersisted() {
    return await navigator.storage && navigator.storage.persisted && navigator.storage.persisted();
}

export async function tryToPersistStorage() {
    const storagePersisted = await isStoragePersisted();
    if (storagePersisted) {
        console.log("Storage is successfully persisted.");
    } else {
        console.warn("Storage is not persisted.");
        console.log("Trying to persist..:");
        if (await persist()) {
            console.log("Successfully turned the storage to be persisted.");
        } else {
            console.error("Failed to make storage persisted");
        }
    }
}