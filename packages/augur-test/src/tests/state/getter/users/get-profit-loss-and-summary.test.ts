import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';

import {
  _beforeAll,
  _beforeEach,
  LONG,
  SHORT,
  createCategoricalMarket,
  trade,
  verifyPL,
  createScalarMarket,
  report,
  verifyCash,
  claimProceeds,
  finalize,
  reportScalar,
} from './common';


const defaultPL = {
  unrealizedPL: 0,
  unrealizedPercent: 0,
  realizedPL: 0,
  realizedPercent: 0
};
describe('State API :: Users :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;
  let jasmine: TestContractAPI;
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
  });

  describe('Profit & Loss Position Tests', () => {
    test('NBA (Point Spread): Chicago Bulls to win by more than 2.5 points over the Cleveland Cavaliers?', async () => {
      // NBA (Point Spread): Chicago Bulls to win by more than 2.5 points over the Cleveland Cavaliers?
      // Outcomes		              Position Type	  Quantity	  Avg Price	  Total Cost  Last Price  Total Returns ($)	Total Returns (%)	Winning Outcome
      // Chicago Bulls -2.5		    Short	          20	        $0.60	      $8.00		    $1.00	      -$8.00	          -100.00%	        Bulls
      // Cleveland Cavaliers +2.5	Long	          50	        $0.30	      $15.00		  $0.00	      -$15.00	          -100.00%
      // No Winner							                                                      $0.00	      $0.0              -100.00%
      // Invalid							                                                        $0.00	      $0.00
      // 								                                                                          -$23.00
      const market = await createCategoricalMarket(john, {
        description: 'NBA (Point Spread): Chicago Bulls to win by more than 2.5 points over the Cleveland Cavaliers?',
        outcomes: ['Chicago Bulls', 'Cleveland Cavaliers', 'No Winner'],
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: SHORT, outcome: 1, quantity: 20, price: 0.60 },
        { market, maker, taker, direction: LONG, outcome: 2, quantity: 50, price: 0.30 },
      ]);
      await verifyPL(john, {
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

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -23.00,
          realizedPercent: -1.00
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 23.00,
          realizedPercent: 0.4894
        },
      });
    });

    test('Week 1: Which NFL Team will win: San Francisco 49ers vs. New Orleans Saints?', async () => {
      // Week 1: Which NFL Team will win: San Francisco 49ers vs. New Orleans Saints?
      // Estimated scheduled start time: Apr 2, 2020 12:00 PM (EDT)
      // Outcomes		    Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // SF 49ers		    Short	        100	      $0.10	    $90.00	    $1.00	      -$90.00 	        -100.00%	        SF 49ers
      // NO Saints						                                        $0.00     	$0.00
      // Tie/No Winner					                                     	$0.00	      $0.00
      // Invalid					                                           	$0.00	      $0.00
      // 					                                                		            -$90.00
      const market = await createCategoricalMarket(john, {
        description: 'Week 1: Which NFL Team will win: San Francisco 49ers vs. New Orleans Saints?',
        outcomes: ['SF 49ers', 'NO Saints', 'Tie/No Winner'],
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: SHORT, outcome: 1, quantity: 100, price: 0.10 },
      ]);
      await verifyPL(john, {
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

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -90.00,
          realizedPercent: -1.00
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 90.00,
          realizedPercent: 9
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
        outcomes: ['Joaquin Phoenix', 'Leonardo DiCaprio', 'Jonathon Pryce', 'Other(field)'],
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: LONG, outcome: 1, quantity: 10, price: 0.20 },
      ]);
      await verifyPL(john, {
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

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 8,
          realizedPercent: 4
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -8,
          realizedPercent: -1
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
      // No Winner/Event Cancelled					        	                          $0.00	      $0.00
      // Invalid
      //        						                                                  	-$30.50   	-27.60%
      const market = await createCategoricalMarket(john, {
        description: 'PGA: Which golfer will win the 2020 Masters Tournament?',
        outcomes: ['Tiger Woods', 'Phil Mickelson', 'Rory Mcllroy', 'Jordan Spieth', 'Dustin Johnson', 'Other(field)', 'No Winner/Event Cancelled'],
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: SHORT, outcome: 1, quantity: 50, price: 0.20 },
        { market, maker, taker, direction: SHORT, outcome: 2, quantity: 30, price: 0.15 },
        { market, maker, taker, direction: SHORT, outcome: 6, quantity: 50, price: 0.10 },
      ]);
      await verifyPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);

      await report(john, market, 6);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [maker.account.address]: 50e18 });
      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -30.50,
          realizedPercent: -0.2760
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 30.50,
          realizedPercent: 1.5641
        },
      });
    });

    test('Week 5: Which NFL Team will win: Los Angeles Chargers vs. Denver Broncos?', async () => {
      // Week 5: Which NFL Team will win: Los Angeles Chargers vs. Denver Broncos?
      // Estimated scheduled start time: Apr 2, 2020 6:00 PM (EDT)
      // Outcomes		     Position Type	Quantity	Avg Price	Total Cost	Last Price 	Total Returns ($)	Total Returns (%)	Winning Outcome
      // LA Chargers		  Short	        50	      $0.60	    $20.00	    $0.00	      $30.00	          150.00%
      // Denver Broncos	  Short	        200	      $0.30	    $140.00	    $1.00     	-$140.00	        -100.00%	        Denver Broncos
      // Tie/No Winner				                                      		$0.00	      $0.00	            -68.75%
      // Invalid						                                            $0.00	      $0.00
      // 							                                                             -$110.00
      const market = await createCategoricalMarket(john, {
        description: 'Week 5: Which NFL Team will win: Los Angeles Chargers vs. Denver Broncos?',
        outcomes: ['LA Chargers', 'Denver Broncos', 'Tie/No Winner'],
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: SHORT, outcome: 1, quantity: 50, price: 0.60 },
        { market, maker, taker, direction: SHORT, outcome: 2, quantity: 200, price: 0.30 },
      ]);
      await verifyPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);

      await report(john, market, 2);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [taker.account.address]: 50e18 }, false);
      await verifyCash(john, market, { [maker.account.address]: 200e18 });

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -110,
          realizedPercent: -0.6875
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 110,
          realizedPercent: 1.2222
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
        description: "Men's Singles Tennis: Which player will win the 2020 BNP Paribas Open?",
        outcomes: ['Agassi', 'Federer', 'Sampres', 'Becker', 'Mcenroe', 'Other(field)'],
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: SHORT, outcome: 1, quantity: 20, price: 0.10 },
        { market, maker, taker, direction: LONG, outcome: 3, quantity: 100, price: 0.10 },
        { market, maker, taker, direction: SHORT, outcome: 5, quantity: 50, price: 0.30 },
      ]);
      await verifyPL(john, {
        [taker.account.address]: defaultPL,
        [maker.account.address]: defaultPL,
      });

      await verifyCash(john, market, { [taker.account.address]: 20e18 }, false);

      await report(john, market, 5);
      await finalize(john, market);
      await claimProceeds(market, [maker, taker]);

      await verifyCash(john, market, { [taker.account.address]: 20e18 }, false);
      await verifyCash(john, market, { [maker.account.address]: 150e18 });

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -43.00,
          realizedPercent: -0.6825
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 43,
          realizedPercent: 0.4019
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
        description: 'Scalar Range (0-82)' ,
        prices: [0, 82e18],
        numTicks: 82,
      });
      const [ maker, taker ] = [ mary, bob ];

      await trade(john, 0, [
        { market, maker, taker, direction: SHORT, outcome: 1, quantity: 10, price: 60, minPrice: 0, maxPrice: 82 },
      ]);
      await verifyPL(john, {
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

      await verifyPL(john, {
        [taker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -70.00,
          realizedPercent: -0.3182
        },
        [maker.account.address]: {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: 70,
          realizedPercent: 0.1167
        },
      });
    });

  });
});
