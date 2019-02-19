import { TrackedUsers } from "./TrackedUsers";
import { PouchDBFactory } from "./AbstractDB";


const TEST_NETWORK_ID = 4;
const DB_FACTORY = PouchDBFactory({ adapter: "memory" });


test("track a user", async () => {
    const trackedUsers = new TrackedUsers(TEST_NETWORK_ID, DB_FACTORY);

    expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
        ok: true,
        id: "mock",
        rev: expect.any(String)
    });
    await trackedUsers.getUsers();
    expect(await trackedUsers.getUsers()).toEqual(["mock"]);
});
