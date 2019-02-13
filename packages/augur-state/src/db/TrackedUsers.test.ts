import { TrackedUsers } from "./TrackedUsers";
import { AbstractDB } from "./AbstractDB";


async function wipeDb(DbClass: new () => AbstractDB) {
    const dbInstance = new DbClass();
    await dbInstance["db"].destroy();
}


beforeEach(async () => {
    await wipeDb(TrackedUsers);
});


test("track a user", async () => {
    const trackedUsers = new TrackedUsers();

    expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
        ok: true,
        id: "mock",
        rev: expect.any(String)
    });
    expect(await trackedUsers.getUsers()).toEqual(["mock"]);
});
