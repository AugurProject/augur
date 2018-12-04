import { processFavorites } from "modules/markets/helpers/favorites-processor";

describe("modules/markets/helpers/favorites-processor.js", () => {
  const networkId = "networkId1";
  const universeId = "universeId1";
  it("Should handle blank/null/undefined favorites data", () => {
    const expectedOutput = {
      [networkId]: { [universeId]: {} }
    };
    assert.deepEqual(
      processFavorites({}, {}, networkId, universeId),
      expectedOutput
    );
    assert.deepEqual(
      processFavorites(null, null, networkId, universeId),
      expectedOutput
    );
    assert.deepEqual(
      processFavorites(undefined, undefined, networkId, universeId),
      expectedOutput
    );
  });

  it("Should handle old style favorites in both state and store", () => {
    const expectedOutput = {
       [networkId]: { [universeId]: { someMarket: 1 } }
    };
    assert.deepEqual(
      processFavorites(
        { someMarket: 1 },
        { someMarket: 1 },
        networkId,
        universeId
      ),
      expectedOutput
    );
  });

  it("should handle store with different universe than state", () => {
    const expectedOutput = {
      differentNetwork: { differentUniverse: { differentMarket: 3 } },
      [networkId]: { [universeId]: { someMarket: 1, anotherMarket: 2 } }
    };
    assert.deepEqual(
      processFavorites(
        { someMarket: 1, anotherMarket: 2 },
        {
          differentNetwork: { differentUniverse: { differentMarket: 3 } }
        },
        networkId,
        universeId
      ),
      expectedOutput
    );
  });

  it("should handle store with new format", () => {
    const expectedOutput = { [networkId]: { [universeId]: { someMarket: 1 } } };
    assert.deepEqual(
      processFavorites(
        {},
        {
          [networkId]: {
            [universeId]: { someMarket: 1 }
          }
        },
        networkId,
        universeId
      ),
      expectedOutput
    );
  });
});
