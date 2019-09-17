import { calculatePayoutNumeratorsValue } from "@augurproject/sdk";

test("utils:calculatePayoutNumeratorsValue", async () => {
    const displayMaxPrice = "1100";
    const displayMinPrice= "100";
    const numTicks = "10000";
    const marketType = "scalar";
    const payout = ["0","6005","3995"];

    const outcomeValue = calculatePayoutNumeratorsValue(displayMaxPrice, displayMinPrice, numTicks, marketType, payout);

    expect(outcomeValue).toEqual("700.5");
});
