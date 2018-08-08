export enum OrderType {
  Bid = "BID",
  Ask = "ASK",
}

export interface LiquidityOrder {
  type: OrderType;
  outcome: string;
  quantity: string;
  price: string;
}

export async function createLiquidity(orders: Array<LiquidityOrder>) {
  for (let order of orders) {
    if (order.type == OrderType.Bid) {
      await expect(page).toClick("button", { text: "Buy" });
    } else {
      await expect(page).toClick("button", { text: "Sell" });
    }
    if (await page.$(".create-market-form-liquidity-styles_CreateMarketLiquidity__outcomes-categorical") !== null) {
      await expect(page).toClick(".create-market-form-liquidity-styles_CreateMarketLiquidity__outcomes-categorical");

      let buttonIndex = 1;
      let foundOutcome = false;
      while (await page.$(".input-dropdown-styles_InputDropdown__list button:nth-child(" + buttonIndex + ")") !== null) {
        let outcomeName = await page.$eval(".input-dropdown-styles_InputDropdown__list button:nth-child(" + buttonIndex + ")", el => el.value);
        if (outcomeName === order.outcome) {
          console.log(outcomeName);
          console.log(buttonIndex);
          await expect(page).toClick(".input-dropdown-styles_InputDropdown__list button:nth-child(" + buttonIndex + ")");
          foundOutcome = true;
          break;
        }
        buttonIndex++;
      }
      expect(foundOutcome).toEqual(true);
    }
    await expect(page).toFill("#cm__input--quantity", order.quantity);
    await expect(page).toFill("#cm__input--limit-price", order.price);
    await expect(page).toClick("button", { text: "Add Order" });
  }
}

export async function verifyLiquidity(orders: Array<LiquidityOrder>, timeoutMilliseconds = 10000) {
  for (let i = 0; i < orders.length; i++) {
    let row = i + 1;
    await expect(page).toMatchElement(".market-positions-list-styles_MarketPositionsList__table-body .market-positions-list--order-styles_Order:nth-child(" + row + ") li:nth-child(1)", { text: orders[i].outcome, timeout: timeoutMilliseconds });
    let sign = null
    if (orders[i].type == OrderType.Bid) {
      sign = "+"
    } else {
      sign = "-"
    }
    await expect(page).toMatchElement(".market-positions-list-styles_MarketPositionsList__table-body .market-positions-list--order-styles_Order:nth-child(" + row + ") li:nth-child(3) span", { text: sign, timeout: timeoutMilliseconds });
    await expect(page).toMatchElement(".market-positions-list-styles_MarketPositionsList__table-body .market-positions-list--order-styles_Order:nth-child(" + row + ") li:nth-child(3)", { text: orders[i].quantity, timeout: timeoutMilliseconds });
    await expect(page).toMatchElement(".market-positions-list-styles_MarketPositionsList__table-body .market-positions-list--order-styles_Order:nth-child(" + row + ") li:nth-child(4)", { text: orders[i].price, timeout: timeoutMilliseconds });
  }
}
