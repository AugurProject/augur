import {makeTestAugur, makeAdditionalTestAugur, ACCOUNTS} from "../../libs/LocalAugur";
import {API} from "@augurproject/state/src/api/API";
import {DB} from "@augurproject/state/src/db/DB";
import {makeDbMock} from "../../libs/MakeDbMock";
import {Augur} from "@augurproject/api";
import {ContractAPI} from "../../libs/ContractAPI";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import * as _ from "lodash";

const BID = 0;
const LONG = 0;
const ASK = 1;
const SHORT = 1;

export interface TradeData {
    direction: 0 | 1;
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

let augur: Augur<any>;
let augur_2: Augur<any>;
let db: DB<any>;
let api: API<any>;
let contractAPI: ContractAPI;
let contractAPI_2: ContractAPI;

beforeAll(async () => {
  augur = await makeTestAugur(ACCOUNTS);
  augur_2 = await makeAdditionalTestAugur(ACCOUNTS[1], augur.provider, augur.addresses);
  db = await mock.makeDB(augur, ACCOUNTS);
  api = new API<any>(augur, db);
  contractAPI = new ContractAPI(augur, augur.provider as EthersProvider, ACCOUNTS[0].publicKey);
  contractAPI_2 = new ContractAPI(augur_2, augur_2.provider as EthersProvider, ACCOUNTS[1].publicKey);
}, 60000);

test("server/getters/get-user-trading-positions#Binary-1", () => {
    // Create Binary Market

    // Create Orders

    // Fill Orders

    // Call getter

    // Verify Results
});

export function process_trades(tradeData: Array<TradeData>, market: GenericAugurInterfaces.Market<ethers.utils.BigNumber>, contractAPI: ContractAPI, minPrice: number = 0, displayRange: number = 1) : void {
    _.forEach(tradeData, (trade: TradeData) => {
        const onChainLongPrice = (trade.price - minPrice) * market.getNumTicks() / displayRange;
        const onChainShortPrice = market.getNumTicks() - onChainLongPrice;
        const direction = trade.direction === SHORT ? BID : ASK;
        const longCost = trade.quantity * onChainLongPrice;
        const shortCost = trade.quantity * onChainShortPrice;
        const creatorCost = trade.direction === BID ? longCost : shortCost;
        const fillerCost = trade.direction === ASK ? longCost : shortCost;

        await contractAPI.faucet(creatorCost)
        const orderID = await createOrder.publicCreateOrder(direction, trade['quantity'], onChainLongPrice, market.address, trade['outcome'], longTo32Bytes(0), longTo32Bytes(0), longTo32Bytes(42), False, nullAddress, sender = tester.k1)

        const avgPrice = math.ceil((trade['avgPrice'] - minPrice) * market.getNumTicks() / displayRange)
        const realizedProfit = math.ceil(trade['realizedPL'] * market.getNumTicks() / displayRange)
        const frozenFunds = math.ceil(trade['frozenFunds'] * market.getNumTicks() / displayRange)

        await contractAPI.faucet(fillerCost)
        await fillOrder.publicFillOrder(orderID, trade['quantity'], longTo32Bytes(42), False, "0x0000000000000000000000000000000000000000", sender = tester.k2)

        const { tradingPositions } = await getUserTradingPositions({
            universe,
            account,
            marketId,
            outcome: null,
            sortBy: null,
            isSortDescending: null,
            limit: null,
            offset: null,
        });
    
        expect(tradingPositions[0].netPosition).toEqual(trade.position);
        expect(tradingPositions[0].averagePrice).toEqual(avgPrice);
        expect(tradingPositions[0].realized).toEqual(realizedProfit);
        expect(tradingPositions[0].frozenFunds).toEqual(frozenFunds);
    })
}        
