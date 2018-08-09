import BigNumber from 'bignumber.js'

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

interface LiquidityChartRow {
  quantity: BigNumber,
  price: BigNumber,
}

interface LiquidityChartRows {
  [key: string]: LiquidityChartRow
}

export async function createLiquidity(orders: Array<LiquidityOrder>) {
  let askOrders: LiquidityChartRows = {};
  let bidOrders: LiquidityChartRows = {};
  let currentOrdersArray;
  for (let order of orders) {
    if (order.type == OrderType.Bid) {
      await expect(page).toClick("button", { text: "Buy" });
      currentOrdersArray = bidOrders;
    } else {
      await expect(page).toClick("button", { text: "Sell" });
      currentOrdersArray = askOrders;
    }
    if (!currentOrdersArray[order.price]) {
      currentOrdersArray[order.price.toString()] = {
        quantity: new BigNumber("0"),
        price: new BigNumber(order.price),
        // TODO: Ideally, we should also be calculating depth and verifying it
      };
    }
    currentOrdersArray[order.price.toString()].quantity = currentOrdersArray[order.price.toString()].quantity.plus(new BigNumber(order.quantity));

    if (await page.$(".create-market-form-liquidity-styles_CreateMarketLiquidity__outcomes-categorical") !== null) {
      await expect(page).toClick(".create-market-form-liquidity-styles_CreateMarketLiquidity__outcomes-categorical");

      let buttonIndex = 1;
      let foundOutcome = false;
      while (await page.$(".input-dropdown-styles_InputDropdown__list button:nth-child(" + buttonIndex + ")") !== null) {
        let outcomeName = await page.$eval(".input-dropdown-styles_InputDropdown__list button:nth-child(" + buttonIndex + ")", el => el.value);
        if (outcomeName === order.outcome) {
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
  await verifyLiquidityOrderBook(askOrders, bidOrders);
}

export async function verifyLiquidityOrderBook(askOrders: LiquidityChartRows, bidOrders: LiquidityChartRows, timeoutMilliseconds = 10000) {
  // Verify ask orders
  let rowNumber = 1
  while (await page.$(".market-outcome-charts--orders-styles_MarketOutcomeOrderBook__side--asks div div:nth-child(" + rowNumber + ")") !== null) {
    let quantity: string = await page.$eval(".market-outcome-charts--orders-styles_MarketOutcomeOrderBook__side--asks div div:nth-child(" + rowNumber + ") button:nth-child(1) span", el => el.textContent);
    let price: string = await page.$eval(".market-outcome-charts--orders-styles_MarketOutcomeOrderBook__side--asks div div:nth-child(" + rowNumber + ") button:nth-child(2) span", el => el.textContent);
    expect(quantity).toEqual(askOrders[price].quantity.toFixed(4));
    expect(price).toEqual(askOrders[price].price.toFixed(4));
    // TODO: Add check to verify that depth is correct
    rowNumber++;
  }

  // Verify bid orders
  rowNumber = 1
  while (await page.$(".market-outcome-charts--orders-styles_MarketOutcomeOrderBook__side--bids div div:nth-child(" + rowNumber + ")") !== null) {
    let quantity = await page.$eval(".market-outcome-charts--orders-styles_MarketOutcomeOrderBook__side--bids div div:nth-child(" + rowNumber + ") button:nth-child(1) span", el => el.textContent);
    let price = await page.$eval(".market-outcome-charts--orders-styles_MarketOutcomeOrderBook__side--bids div div:nth-child(" + rowNumber + ") button:nth-child(2) span", el => el.textContent);
    expect(quantity).toEqual(bidOrders[price].quantity.toFixed(4));
    expect(price).toEqual(bidOrders[price].price.toFixed(4));
    // TODO: Add check to verify that depth is correct
    rowNumber++;
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
