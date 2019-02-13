import { TrackedUsers } from "./TrackedUsers";
import { AbstractDB } from "./AbstractDB";

const TEST_NETWORK_ID = 4;


async function wipeDb(DbClass: new (networkId: number) => TrackedUsers, networkId: number) {
    const dbInstance = new DbClass(networkId);
    await dbInstance["db"].destroy();
}


beforeEach(async () => {
    await wipeDb(TrackedUsers, TEST_NETWORK_ID);
});


test("track a user", async () => {
    const trackedUsers = new TrackedUsers(TEST_NETWORK_ID);

    expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
        ok: true,
        id: "mock",
        rev: expect.any(String)
    });
    expect(await trackedUsers.getUsers()).toEqual(["mock"]);
});