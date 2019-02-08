// Create market, make a trade on it, designated reporter reports, market is finalized, traders settle shares, reporters redeem tokens.

// TODO: Add checks to ensure ETH redeemed for shares/reporting fees is correct, since fixture.getEthBalance returns the same amount every time it's called.

import { ethers } from "ethers";
import { expect } from "chai";
import "jest";
import { stringTo32ByteHex } from "../libraries/HelperFunctions";
import { TestFixture } from "./TestFixture";
import { ReportingUtils } from "./ReportingUtils";
import { Bytes32, UInt256, UInt8 } from "../";

describe("TradeAndReport", () => {
    let fixture: TestFixture;
    jest.setTimeout(1000000);
    beforeAll(async () => {
        fixture = await TestFixture.create();
    });
    it("#tradeAndReport", async () => {
        expect(true).to.be("true");

    });
});
