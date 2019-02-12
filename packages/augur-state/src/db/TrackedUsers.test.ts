import { TrackedUsers } from "./TrackedUsers";


class WrappedTrackedUsers extends TrackedUsers {
    async wipe() {
        await this.destroy();
        this.db = this.makeDb();
    }
}


test("track a user", async () => {
    const trackedUsers = new WrappedTrackedUsers();
    await trackedUsers.wipe();

    expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
        ok: true,
        id: "mock",
        rev: expect.any(String)
    });
    expect(await trackedUsers.getUsers()).toEqual(["mock"]);
});
