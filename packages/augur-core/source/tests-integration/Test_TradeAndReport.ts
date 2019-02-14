// Create market, make a trade on it, designated reporter reports, market is finalized, traders settle shares, reporters redeem tokens.

// TODO: Add checks to ensure ETH redeemed for shares/reporting fees is correct, since fixture.getEthBalance returns the same amount every time it's called.

import { expect } from "chai";
import "jest";
import { TestFixture } from "./TestFixture";

describe("TradeAndReport", () => {
    let fixture: TestFixture;
    jest.setTimeout(1000000);
    beforeAll(async () => {
        fixture = await TestFixture.create();
    });
    it("#tradeAndReport", async () => {
        expect(true).equals(true);
    });
});
