import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import {
  _beforeAll,
  _beforeEach,
  doTradeTakerView,
  LONG,
  SHORT,
  THIRTY,
  MakerTakerTrade,
  TradeData,
  PLResultData,
} from './common';
import { formatBytes32String } from 'ethers/utils';
import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { repeat } from '@augurproject/utils';
import {
  MarketInfo,
  MarketList,
} from '@augurproject/sdk-lite';

const INVALID = 0;
const NO = 1;
const YES = 2;
const OUTCOME_A = 1;
const OUTCOME_B = 2;
const OUTCOME_C = 3;
const SCALAR_LONG = 1;
const SCALAR_SHORT = 2;

const ZERO = new BigNumber(0);
const HOUR = 60 * 60;
const DAY = HOUR * 24;
const defaultPL = {
  unrealizedPL: 0,
  unrealizedPercent: 0,
  realizedPL: 0,
  realizedPercent: 0,
};
describe('State API :: Users :: PL :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;
  let jasmine: TestContractAPI;
  let fred: TestContractAPI;
  let baseProvider: TestEthersProvider;

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider });
    john = state.john;
    mary = state.mary;
    bob = state.bob;
    jasmine = state.jasmine;
    fred = state.fred;
  });

  describe('Realized Profit & Loss Position Tests', () => {
    test('NBA (Point Spread): Chicago Bulls to win by more than 2.5 points over the Cleveland Cavaliers?', async () => {
      // NBA (Point Spread): Chicago Bulls to win by more than 2.5 points over the Cleveland Cavaliers?
      // Outcomes		              Position Type	  Quantity	  Avg Price	  Total Cost  Last Price  Total Returns ($)	Total Returns (%)	Winning Outcome
      // Chicago Bulls -2.5		    Short	          20	        $0.60	      $8.00		    $1.00	      -$8.00	          -100.00%	        Bulls
      // Cleveland Cavaliers +2.5	Long	          50	        $0.30	      $15.00		  $0.00	      -$15.00	          -100.00%
      // No Contest							                                                      $0.00	      $0.0              -100.00%
      // Invalid							                                                        $0.00	      $0.00
      // 								                                                                          -$23.00
      const market = await createCategoricalMarket(john, {
        description:
          'NBA (Point Spread): Chicago Bulls to win by more than 2.5 points over the Cleveland Cavaliers?',
        outcomes: ['Chicago Bulls', 'Cleveland Cavaliers', 'No Contest'],
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 1,
          quantity: 20,
          price: 0.6,
        },
        {
          market,
          maker,
          taker,
          direction: LONG,
          outcome: 2,
          quantity: 50,
          price: 0.3,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await report(john, market, 1);
      await finalize(john, market);
      await maker.claimTradingProceeds(market);
      await taker.claimTradingProceeds(market);

      await verifyCash(john, market, {
        [maker.account.address]: 70e18,
        [taker.account.address]: 0,
      });

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -23.0,
          realizedPercent: -1.0,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 23.0,
          realizedPercent: 0.4894,
        },
      });
    });

    test('Week 1: Which NFL Team will win: San Francisco 49ers vs. New Orleans Saints?', async () => {
      // Week 1: Which NFL Team will win: San Francisco 49ers vs. New Orleans Saints?
      // Estimated scheduled start time: Apr 2, 2020 12:00 PM (EDT)
      // Outcomes		    Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // SF 49ers		    Short	        100	      $0.10	    $90.00	    $1.00	      -$90.00 	        -100.00%	        SF 49ers
      // NO Saints						                                        $0.00     	$0.00
      // Tie/No Contest					                                     	$0.00	      $0.00
      // Invalid					                                           	$0.00	      $0.00
      // 					                                                		            -$90.00
      const market = await createCategoricalMarket(john, {
        description:
          'Week 1: Which NFL Team will win: San Francisco 49ers vs. New Orleans Saints?',
        outcomes: ['SF 49ers', 'NO Saints', 'Tie/No Contest'],
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 1,
          quantity: 100,
          price: 0.1,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await report(john, market, 1);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, {
        [maker.account.address]: 100e18,
        [taker.account.address]: 0,
      });

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -90.0,
          realizedPercent: -1.0,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 90.0,
          realizedPercent: 9,
        },
      });
    });

    test('Who will win best actor in the 2020 Academy Awards?', async () => {
      // Who will win best actor in the 2020 Academy Awards?
      // Outcomes		        Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // Joaquin Phoenix		Long	        10	      $0.20	    $2.00	      $1.00	      $8.00	            400.00%	          Joaquin Phoenix
      // Leonardo DiCaprio						                                    $0.00	      $0.00
      // Jonathon Pryce  					                                        $0.00	      $0.00
      // Other(field)    				                                          $0.00     	$0.00
      // Invalid			                                               			$0.00     	$0.00
      // 					                                                           	      	$8.00
      const market = await createCategoricalMarket(john, {
        description: 'Who will win best actor in the 2020 Academy Awards?',
        outcomes: [
          'Joaquin Phoenix',
          'Leonardo DiCaprio',
          'Jonathon Pryce',
          'Other(field)',
        ],
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: LONG,
          outcome: 1,
          quantity: 10,
          price: 0.2,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await report(john, market, 1);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, {
        [maker.account.address]: 0,
        [taker.account.address]: 10e18,
      });

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 8,
          realizedPercent: 4,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -8,
          realizedPercent: -1,
        },
      });
    });

    test('PGA: Which golfer will win the 2020 Masters Tournament?', async () => {
      // PGA: Which golfer will win the 2020 Masters Tournament?
      // Outcomes		              Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // Tiger Woods		          Short	        50	      0.2	      40	        $0.00	      $10.00	          25.00%
      // Phil Mickelson	          Short	        30	      0.15	    25        	$0.00	      $4.50           	17.65%
      // Rory Mcllroy			              	            	                      	$0.00	      $0.00
      // Jordan Spieth			              		                                 	$0.00	      $0.00
      // Dustin Johnson			          		                                     	$0.00	      $0.00
      // Other(field)		          Short	        50	      0.1	      45	        $1.00	      -$45.00	          -100.00%	        Other(field)
      // No Contest					        	                          $0.00	      $0.00
      // Invalid
      //        						                                                  	-$30.50   	-27.60%
      const market = await createCategoricalMarket(john, {
        description: 'PGA: Which golfer will win the 2020 Masters Tournament?',
        outcomes: [
          'Tiger Woods',
          'Phil Mickelson',
          'Rory Mcllroy',
          'Jordan Spieth',
          'Dustin Johnson',
          'Other(field)',
          'No Contest',
        ],
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 1,
          quantity: 50,
          price: 0.2,
        },
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 2,
          quantity: 30,
          price: 0.15,
        },
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 6,
          quantity: 50,
          price: 0.1,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);

      await report(john, market, 6);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [maker.account.address]: 50e18 });
      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -30.5,
          realizedPercent: -0.276,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 30.5,
          realizedPercent: 1.5641,
        },
      });
    });

    test('Week 5: Which NFL Team will win: Los Angeles Chargers vs. Denver Broncos?', async () => {
      // Week 5: Which NFL Team will win: Los Angeles Chargers vs. Denver Broncos?
      // Estimated scheduled start time: Apr 2, 2020 6:00 PM (EDT)
      // Outcomes		     Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // LA Chargers		  Short	        50	      $0.60	    $20.00	    $0.00	      $30.00	          150.00%
      // Denver Broncos	  Short	        200	      $0.30	    $140.00	    $1.00     	-$140.00	        -100.00%	        Denver Broncos
      // Tie/No Contest				                                      		$0.00	      $0.00	            -68.75%
      // Invalid						                                            $0.00	      $0.00
      // 							                                                             -$110.00
      const market = await createCategoricalMarket(john, {
        description:
          'Week 5: Which NFL Team will win: Los Angeles Chargers vs. Denver Broncos?',
        outcomes: ['LA Chargers', 'Denver Broncos', 'Tie/No Contest'],
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 1,
          quantity: 50,
          price: 0.6,
        },
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 2,
          quantity: 200,
          price: 0.3,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);

      await report(john, market, 2);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);
      await verifyCash(john, market, { [maker.account.address]: 200e18 });

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -110,
          realizedPercent: -0.6875,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 110,
          realizedPercent: 1.2222,
        },
      });
    });

    test("Men's Singles Tennis: Which player will win the 2020 BNP Paribas Open?", async () => {
      // Outcomes		    Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // Agassi	      	Short	        20	      $0.10	    $18.00	    $0.00	      $2.00
      // Federer						                                          $0.00	      $0.00
      // Sampres		    Long	        100     	$0.10	    $10.00    	$0.00	      -$10.00
      // Becker						                                            $0.00     	$0.00
      // Mcenroe		    Short       	50	      $0.30   	$35.00	    $1.00     	-$35.00	                        	  Mcenroe
      // Other(field)						                                      $0.00	      $0.00
      // Invalid							                                                    -$43.00
      const market = await createCategoricalMarket(john, {
        description:
          "Men's Singles Tennis: Which player will win the 2020 BNP Paribas Open?",
        outcomes: [
          'Agassi',
          'Federer',
          'Sampres',
          'Becker',
          'Mcenroe',
          'Other(field)',
        ],
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 1,
          quantity: 20,
          price: 0.1,
        },
        {
          market,
          maker,
          taker,
          direction: LONG,
          outcome: 3,
          quantity: 100,
          price: 0.1,
        },
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 5,
          quantity: 50,
          price: 0.3,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, { [taker.account.address]: 20e18 }, false);

      await report(john, market, 5);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [taker.account.address]: 20e18 }, false);
      await verifyCash(john, market, { [maker.account.address]: 150e18 });

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -43.0,
          realizedPercent: -0.6825,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 43,
          realizedPercent: 0.4019,
        },
      });
    });

    test('Scalar Range (0-82)', async () => {
      // Scalar	Range (0-82)
      // NBA: Total number of wins the Golden State Warriors will finish the 2019-20 regular season with?
      // Outcomes		Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // Wins		    Short	        10	      $60.00	  $220.00	    $67.00	    -$70.00	                            67
      // Invalid
      const market = await createScalarMarket(john, {
        description: 'Scalar Range (0-82)',
        prices: [0, 82e18],
        numTicks: 82,
      });
      const [maker, taker] = [mary, bob];

      await mkTrade(john, 0, [
        {
          market,
          maker,
          taker,
          direction: SHORT,
          outcome: 1,
          quantity: 10,
          price: 60,
          minPrice: 0,
          maxPrice: 82,
        },
      ]);
      await verifyThirtyDayPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, {
        [taker.account.address]: 0,
        [maker.account.address]: 0,
      });

      await reportScalar(john, market, 67);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [taker.account.address]: 150e18 });
      await verifyCash(john, market, { [maker.account.address]: 670e18 });

      await verifyThirtyDayPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -70.0,
          realizedPercent: -0.3182,
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 70,
          realizedPercent: 0.1167,
        },
      });
    });
  });

  describe('Unrealized Profit & Loss Position Tests', () => {
    // Source: https://docs.google.com/document/d/1UNoJrBZkmoP5h0XesIIWfxTKuDir5g7NlyiPGngRRuM/edit

    test('Scenario 1', async () => {
      const [anyone, A, B, C] = [john, mary, bob, jasmine];
      const market = await createYesNoMarket(anyone, {});

      await trade({
        market,
        buyer: A,
        seller: B,
        outcome: YES,
        quantity: 100,
        price: 0.4,
      });
      await anyone.advanceTimestamp(HOUR);
      await verifyThirtyDayPL(anyone, {
        [A.account.address]: defaultPL,
        [B.account.address]: defaultPL,
        [C.account.address]: defaultPL,
      });

      await trade({
        market,
        buyer: C,
        seller: B,
        outcome: YES,
        quantity: 100,
        price: 0.6,
      });
      await anyone.advanceTimestamp(HOUR);
      await verifyThirtyDayPL(anyone, {
        [A.account.address]: {
          unrealizedPL: 20,
          unrealizedPercent: 0.5,
          realizedPL: 0,
          realizedPercent: 0,
        },
        [B.account.address]: {
          unrealizedPL: -20,
          unrealizedPercent: -0.2,
          realizedPL: 0,
          realizedPercent: 0,
        },
        [C.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 0,
          realizedPercent: 0,
        },
      });
    });

    test('Scenario 2', async () => {
      const [anyone, A, B] = [john, mary, bob];
      const market = await createYesNoMarket(anyone, {});

      await trade({
        market,
        buyer: A,
        seller: B,
        outcome: NO,
        quantity: 50,
        price: 0.35,
      });
      await trade({
        market,
        buyer: A,
        seller: B,
        outcome: NO,
        quantity: 100,
        price: 0.3,
      });
      await trade({
        market,
        buyer: A,
        seller: B,
        outcome: NO,
        quantity: 50,
        price: 0.25,
      });
      await anyone.advanceTimestamp(HOUR);
      await verifyThirtyDayPL(anyone, {
        [A.account.address]: {
          unrealizedPL: -10,
          unrealizedPercent: -0.1667,
          realizedPL: 0,
          realizedPercent: 0,
        },
        [B.account.address]: {
          unrealizedPL: 10,
          unrealizedPercent: 0.0714,
          realizedPL: 0,
          realizedPercent: 0,
        },
      });
    });
  });

  // Scenario 3 is functionally identical to Scenario 2 because these tests are
  // written based on trades, not orders. So it's been skipped.

  test('Scenario 4', async () => {
    const [anyone, A, B, C] = [john, mary, bob, jasmine];
    const market = await createCategoricalMarket(anyone, {
      outcomes: ['A', 'B', 'C'],
    });

    await trade({
      market,
      buyer: A,
      seller: B,
      outcome: OUTCOME_A,
      quantity: 20,
      price: 0.3,
    });
    await trade({
      market,
      buyer: A,
      seller: B,
      outcome: OUTCOME_B,
      quantity: 30,
      price: 0.2,
    });
    await trade({
      market,
      buyer: B,
      seller: A,
      outcome: OUTCOME_C,
      quantity: 10,
      price: 0.5,
    });
    await trade({
      market,
      buyer: C,
      seller: B,
      outcome: OUTCOME_A,
      quantity: 20,
      price: 0.5,
    });
    await trade({
      market,
      buyer: C,
      seller: B,
      outcome: OUTCOME_B,
      quantity: 10,
      price: 0.4,
    });
    await trade({
      market,
      buyer: B,
      seller: C,
      outcome: OUTCOME_C,
      quantity: 10,
      price: 0.3,
    });

    await anyone.advanceTimestamp(HOUR);
    await verifyThirtyDayPL(anyone, {
      [A.account.address]: {
        unrealizedPL: 12,
      },
      [B.account.address]: {
        unrealizedPL: -12,
      },
      [C.account.address]: {
        unrealizedPL: 0,
      },
    });
  });

  test('Scenario 5', async () => {
    const [anyone, A, B, C] = [john, mary, bob, jasmine];
    const market = await createCategoricalMarket(anyone, {
      outcomes: ['A', 'B', 'C'],
    });

    await trade({
      market,
      buyer: A,
      seller: B,
      outcome: OUTCOME_A,
      quantity: 20,
      price: 0.3,
    });
    await trade({
      market,
      buyer: A,
      seller: B,
      outcome: OUTCOME_B,
      quantity: 30,
      price: 0.2,
    });
    await trade({
      market,
      buyer: B,
      seller: A,
      outcome: OUTCOME_C,
      quantity: 10,
      price: 0.5,
    });
    await trade({
      market,
      buyer: C,
      seller: B,
      outcome: OUTCOME_A,
      quantity: 20,
      price: 0.1,
    });
    await trade({
      market,
      buyer: C,
      seller: B,
      outcome: OUTCOME_B,
      quantity: 10,
      price: 0.4,
    });
    await trade({
      market,
      buyer: B,
      seller: C,
      outcome: OUTCOME_C,
      quantity: 10,
      price: 0.3,
    });

    await anyone.advanceTimestamp(HOUR);
    await verifyThirtyDayPL(anyone, {
      [A.account.address]: {
        unrealizedPL: 4,
      },
      [B.account.address]: {
        unrealizedPL: -4,
      },
      [C.account.address]: {
        unrealizedPL: 0,
      },
    });
  });

  test('Scenario 6', async () => {
    const [anyone, A, B, C] = [john, mary, bob, jasmine];
    const market = await createScalarMarket(anyone, {
      numTicks: 250 - 50,
      prices: [50e18, 250e18],
    });

    await trade({
      market,
      minPrice: 50,
      maxPrice: 250,
      buyer: A,
      seller: B,
      outcome: SCALAR_LONG,
      quantity: 10,
      price: 105,
    });
    await trade({
      market,
      minPrice: 50,
      maxPrice: 250,
      buyer: A,
      seller: B,
      outcome: SCALAR_LONG,
      quantity: 5,
      price: 99,
    });

    await anyone.advanceTimestamp(HOUR);
    await verifyThirtyDayPL(anyone, {
      [A.account.address]: {
        unrealizedPL: -60,
      },
      [B.account.address]: {
        unrealizedPL: 60,
      },
      [C.account.address]: {
        unrealizedPL: 0,
      },
    });
  });

  describe('Partial closing of user positions', () => {
    test('Scenario 1: Multiple orders partial closing position', async () => {
      const [anyone, A, B] = [john, mary, bob];
      const market = await createYesNoMarket(anyone, {});

      await trade({
        market,
        buyer: B,
        seller: A,
        outcome: YES,
        quantity: 100,
        price: 0.31,
      });
      await trade({
        market,
        buyer: B,
        seller: A,
        outcome: YES,
        quantity: 200,
        price: 0.35,
      });
      // B should be long 300 @ 0.33666666666 + fee
      await trade({
        market,
        buyer: A,
        seller: B,
        outcome: YES,
        quantity: 100,
        price: 0.3,
      });
      // B should have closed out 100 shares @ 0.3 for a loss of 3.66666
      await B.advanceTimestamp(HOUR);
      await verifyThirtyDayPL(B, {
        [B.account.address]: {
          unrealizedPL: -7.333333333333333,
          unrealizedPercent: -0.1089,
          realizedPL: -3.6736666666666666,
          realizedPercent: -0.1091,
        }
      });
    });
  });
});

interface DirectedTrade {
  market: Market;
  buyer: TestContractAPI;
  seller: TestContractAPI;
  outcome: number;
  quantity: number;
  price: number;
  // scalar market only
  minPrice?: number;
  maxPrice?: number;
}

// Note that this is doing on-chain/native trades, not 0x trades.
async function trade(trade_: DirectedTrade): Promise<void> {
  const tradeData = directedTradeToTradeData(trade_);
  await doTradeTakerView(trade_.buyer, trade_.seller, tradeData, trade_.market);
}

// Note that this is doing on-chain/native trades, not 0x trades.
async function mkTrade(
  user: TestContractAPI,
  timeDelta: number,
  trades: MakerTakerTrade[]
): Promise<void> {
  await user.advanceTimestamp(timeDelta);

  for (const trade_ of trades) {
    const tradeData = makerTakerTradeToTradeData(trade_);
    await doTradeTakerView(
      trade_.maker,
      trade_.taker,
      tradeData,
      trade_.market
    );
  }
}

async function verifyThirtyDayPL(
  user: TestContractAPI,
  result: { [address: string]: Partial<PLResultData> }
) {
  await user.sync();
  for (const address of _.keys(result)) {
    const plResult = result[address];
    const profitLossSummary = await user.api.route('getProfitLossSummary', {
      universe: user.augur.contracts.universe.address,
      account: address,
    });

    const thirtyDayPLSummary = profitLossSummary[THIRTY];
    if (typeof plResult.realizedPL !== 'undefined') {
      await expect(Number.parseFloat(thirtyDayPLSummary.realized)).toEqual(
        plResult.realizedPL
      );
    }
    if (typeof plResult.realizedPercent !== 'undefined') {
      await expect(
        Number.parseFloat(thirtyDayPLSummary.realizedPercent)
      ).toEqual(plResult.realizedPercent);
    }
    if (typeof plResult.unrealizedPL !== 'undefined') {
      await expect(Number.parseFloat(thirtyDayPLSummary.unrealized)).toEqual(
        plResult.unrealizedPL
      );
    }
    if (typeof plResult.unrealizedPercent !== 'undefined') {
      await expect(
        Number.parseFloat(thirtyDayPLSummary.unrealizedPercent)
      ).toEqual(plResult.unrealizedPercent);
    }
  }
}

async function getMarket(
  user: TestContractAPI,
  market: string
): Promise<MarketInfo> {
  await user.sync();
  const marketList: MarketList = await user.api.route('getMarkets', {
    universe: user.config.addresses.Universe,
  });
  return marketList.markets.find(m => m.id === market);
}

function directedTradeToTradeData({
  outcome,
  quantity,
  price,
  minPrice,
  maxPrice,
}: DirectedTrade): TradeData {
  const direction = SHORT; // assumes call like doTradeTakerView(buyer, seller, ...)
  return { direction, outcome, quantity, price, minPrice, maxPrice };
}

function makerTakerTradeToTradeData(trade: MakerTakerTrade): TradeData {
  const { direction, outcome, quantity, price, minPrice, maxPrice } = trade;
  return { direction, outcome, quantity, price, minPrice, maxPrice };
}

// Verifies users' balances less any fees.
async function verifyCash(
  user: TestContractAPI,
  market: Market,
  balances: Balances,
  feeAdjustment = true
): Promise<Balances> {
  const marketFeeDivisor = (await market.getMarketCreatorSettlementFeeDivisor_()).toNumber();
  const reportingFeeDivisor = (await user.augur.contracts.universe.getOrCacheReportingFeeDivisor_()).toNumber();
  const actualBalances: Balances = {};
  for (const address in balances) {
    const balance = balances[address];
    const reportingFee = reportingFeeDivisor
      ? balance / reportingFeeDivisor
      : 0;
    const marketFee = marketFeeDivisor ? balance / marketFeeDivisor : 0;
    const expectedBalance = feeAdjustment
      ? balance - reportingFee - marketFee
      : balance;
    const actualBalance = (await user.getCashBalance(address)).toNumber();
    expect(actualBalance).toEqual(expectedBalance);
    actualBalances[address] = actualBalance;
  }
  return actualBalances;
}
interface Balances {
  [address: string]: number;
}

async function createYesNoMarket(
  user: TestContractAPI,
  {
    timeDelta = DAY,
    marketFee = 0,
    affiliateFee = 25,
    designatedReporter,
    categories = ['test', 'fake', 'YesNo'],
    description = 'test market',
    faucet = true,
  }: {
    timeDelta?: number;
    marketFee?: number;
    affiliateFee?: number;
    designatedReporter?: string;
    categories?: string[];
    description?: string;
    faucet?: boolean;
  } = {}
): Promise<Market> {
  return user.createYesNoMarket(
    {
      endTime: (await user.getTimestamp()).plus(timeDelta),
      feePerCashInAttoCash: new BigNumber(marketFee),
      affiliateFeeDivisor: new BigNumber(affiliateFee),
      designatedReporter: designatedReporter || user.account.address,
      extraInfo: JSON.stringify({
        categories,
        description,
      }),
    },
    faucet
  );
}

async function createCategoricalMarket(
  user: TestContractAPI,
  {
    timeDelta = DAY,
    marketFee = 0,
    affiliateFee = 25,
    designatedReporter,
    categories = ['test', 'fake', 'Categorical'],
    description = 'test market',
    outcomes = ['outcome1', 'outcome2', 'outcome3'],
    formatOutcomes = true,
    faucet = true,
  }: {
    timeDelta?: number;
    marketFee?: number;
    affiliateFee?: number;
    designatedReporter?: string;
    categories?: string[];
    description?: string;
    outcomes?: string[];
    formatOutcomes?: boolean;
    faucet?: boolean;
  } = {}
): Promise<Market> {
  return user.createCategoricalMarket(
    {
      endTime: (await user.getTimestamp()).plus(timeDelta),
      feePerCashInAttoCash: new BigNumber(marketFee),
      affiliateFeeDivisor: new BigNumber(affiliateFee),
      designatedReporter: designatedReporter || user.account.address,
      extraInfo: JSON.stringify({
        categories,
        description,
      }),
      outcomes: formatOutcomes ? outcomes.map(formatBytes32String) : outcomes,
    },
    faucet
  );
}

async function createScalarMarket(
  user: TestContractAPI,
  {
    timeDelta = DAY,
    marketFee = 0,
    affiliateFee = 25,
    designatedReporter,
    prices = [0, 100],
    numTicks = 100,
    categories = ['test', 'fake', 'Categorical'],
    description = 'test market',
    faucet = true,
  }: {
    timeDelta?: number;
    marketFee?: number;
    affiliateFee?: number;
    designatedReporter?: string;
    categories?: string[];
    description?: string;
    prices?: Array<number | BigNumber>;
    numTicks?: number;
    faucet?: boolean;
  } = {}
): Promise<Market> {
  return user.createScalarMarket(
    {
      endTime: (await user.getTimestamp()).plus(timeDelta),
      feePerCashInAttoCash: new BigNumber(marketFee),
      affiliateFeeDivisor: new BigNumber(affiliateFee),
      designatedReporter: designatedReporter || user.account.address,
      prices: prices.map(p => new BigNumber(p)),
      numTicks: new BigNumber(numTicks),
      extraInfo: JSON.stringify({
        categories,
        description,
      }),
    },
    faucet
  );
}

async function finalize(user: TestContractAPI, market: Market): Promise<void> {
  await user.advanceTimestamp(DAY * 2);
  await market.finalize();
  await user.advanceTimestamp(DAY * 2);
}

async function report(user: TestContractAPI, market: Market, outcome: number) {
  const endTime = await market.getEndTime_();
  await user.setTimestamp(endTime.plus(1));

  const numTicks = await market.getNumTicks_();
  const numOutcomes = (await market.getNumberOfOutcomes_()).toNumber();
  const outcomeList = repeat(ZERO, numOutcomes);
  outcomeList[outcome] = numTicks;
  await user.doInitialReport(market, outcomeList);
}

async function reportScalar(
  user: TestContractAPI,
  market: Market,
  outcome: number | 'invalid'
) {
  const endTime = await market.getEndTime_();
  await user.setTimestamp(endTime.plus(1));

  const numTicks = await market.getNumTicks_();
  const other = numTicks.minus(outcome);
  const outcomeList =
    outcome === 'invalid'
      ? [numTicks, ZERO, ZERO]
      : [ZERO, new BigNumber(outcome), other];
  await user.doInitialReport(market, outcomeList);
}

async function claimProceeds(market: Market, users: TestContractAPI[]) {
  for (const user of users) {
    await user.claimTradingProceeds(market);
  }
}
