import {
    ACCOUNTS,
    makeDbMock,
    compileAndDeployToGanache,
    ContractAPI,
  } from "../../../libs";
import {API} from "@augurproject/state/src/api/API";
import {DB} from "@augurproject/state/src/db/DB";
import { convertDisplayAmountToOnChainAmount } from "@augurproject/api";
import { GenericAugurInterfaces } from "@augurproject/core";
import { ethers } from "ethers";
import { stringTo32ByteHex } from "../../../libs/Utils";
import { BigNumber } from "bignumber.js";
import * as _ from "lodash";

const ZERO_BYTES = stringTo32ByteHex("");

const ZERO = 0;
const ONE = 1;
const TWO = 2;

const BID = ZERO;
const LONG = ZERO;
const ASK = ONE;
const SHORT = ONE;
const YES = TWO;
const NO = ONE;

const DEFAULT_MIN_PRICE = new BigNumber(ZERO);
const DEFAULT_DISPLAY_RANGE = new BigNumber(ONE);

export interface TradeData {
    direction: number;
    outcome: number;
    quantity: number;
    price: number;
    position: number;
    avgPrice: number;
    realizedPL: number;
    frozenFunds: number;
}

const mock = makeDbMock();

beforeEach(async () => {
  mock.cancelFail();
});

let db: DB<any>;
let api: API<any>;
let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const {provider, addresses} = await compileAndDeployToGanache(ACCOUNTS);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = await mock.makeDB(john.augur, ACCOUNTS);
  api = new API<any>(john.augur, db);
}, 60000);

test("State API :: Users :: getUserTradingPositions binary-1", async () => {
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();

    const market = await john.createReasonableYesNoMarket(john.augur.contracts.universe);

    const trades: Array<TradeData> = [
        {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 10,
            "price": .65,
            "position": -10,
            "avgPrice": .65,
            "realizedPL": 0,
            "frozenFunds": 3.5
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 3,
            "price": .58,
            "position": -7,
            "avgPrice": .65,
            "realizedPL": .21,
            "frozenFunds": 2.45
        }, {
            "direction": SHORT,
            "outcome": YES,
            "quantity": 13,
            "price": .62,
            "position": -20,
            "avgPrice": .6305,
            "realizedPL": .21,
            "frozenFunds": 7.39
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 10,
            "price": .5,
            "position": -10,
            "avgPrice": .6305,
            "realizedPL": 1.515,
            "frozenFunds": 3.695
        }, {
            "direction": LONG,
            "outcome": YES,
            "quantity": 7,
            "price": .15,
            "position": -3,
            "avgPrice": .6305,
            "realizedPL": 4.8785,
            "frozenFunds": 1.1085
        }
    ]

    await processTrades(trades, market, john.augur.contracts.universe.address);
}, 60000);

async function processTrades(tradeData: Array<TradeData>, market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, universe: string, minPrice: BigNumber = DEFAULT_MIN_PRICE, displayRange: BigNumber = DEFAULT_DISPLAY_RANGE) : Promise<void> {
    for (let trade of tradeData) {
        const numTicks = new BigNumber((await market.getNumTicks_()).toNumber());
        const price = new BigNumber(trade.price);
        const tickSize = displayRange.dividedBy(numTicks);
        const quantity = convertDisplayAmountToOnChainAmount(new BigNumber(trade.quantity), tickSize);

        const onChainLongPrice = price.minus(minPrice).multipliedBy(numTicks).dividedBy(displayRange);
        const onChainShortPrice = numTicks.minus(onChainLongPrice);
        const direction = trade.direction === SHORT ? BID : ASK;
        const longCost = quantity.multipliedBy(onChainLongPrice);
        const shortCost = quantity.multipliedBy(onChainShortPrice);
        const fillerCost = trade.direction === ASK ? longCost : shortCost;

        const orderID = await john.placeOrder(market.address, new ethers.utils.BigNumber(direction), new ethers.utils.BigNumber(quantity.toFixed()), new ethers.utils.BigNumber(onChainLongPrice.toFixed()), new ethers.utils.BigNumber(trade.outcome), ZERO_BYTES, ZERO_BYTES, ZERO_BYTES);

        await mary.fillOrder(orderID, new ethers.utils.BigNumber(fillerCost.toFixed()), new ethers.utils.BigNumber(quantity.toFixed()), "");

        await db.sync(
            john.augur,
            mock.constants.chunkSize,
            0,
        );

        const { tradingPositions, tradingPositionsPerMarket, frozenFundsTotal } = await api.route("getUserTradingPositions", {
            universe,
            account: mary.account,
            marketId: market.address,
        });
        await expect(tradingPositions[0].netPosition).toEqual(trade.position.toString());
        await expect(tradingPositions[0].averagePrice).toEqual(trade.avgPrice.toString());
        await expect(tradingPositions[0].realized).toEqual(trade.realizedPL.toString());
        await expect(tradingPositions[0].frozenFunds).toEqual(trade.frozenFunds.toString());
    };
}
