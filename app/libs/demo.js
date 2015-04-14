var BigNumber = require('bignumber.js');
var _ = require('lodash');

var demo = {

	web3: {

		setProvider: function() {},
		providers: { HttpProvider: function() {} },
		eth: {
			blockNumber: 1254,
			mining: 'on',
			accounts: [
				'0xDEM0'
			],
			filter: function(type) {
				return {
					watch: function(runMe) {
						runMe();
					}
				};
			},
			getBalance: function(account) {
				return new BigNumber(3123440000000000);
			},
			gasPrice: new BigNumber(10000000000000),
		},
		net: {
			peerCount: 24
		},
		shh: {
			filter: function() {
				return {
					watch: function() {}
				};
			}
		}
	},

	contract: {

		faucet: function() {

			return new BigNumber(1);
		},

		balance: function(foo) {

			return new BigNumber(10000).times(new BigNumber(2).toPower(64));
		},

		getBranches: function() {

			var b = [];
			_.each(Object.keys(demo.branches), function(id) {
				b.push(new BigNumber(id));
			});
			return b;
		},

		getBranchInfo: function(id) {

			return demo.branches[id]['info'];
		},

		getBranchDesc: function(id) {

			return demo.branches[id]['desc'];
		},

		getRepBalance: function(id) {

			return demo.branches[id]['rep'];
		},

		getEvents: function(branchId) {

			var e = [];
			_.each(Object.keys(demo.events), function(id) {
				if (demo.events[id]['info'][2].toNumber() == branchId) e.push(new BigNumber(id));
			});
			return e;
		},

		getEventInfo: function(id) {

			return demo.events[id]['info'];
		},

		getEventDesc: function(id) {

			return demo.events[id]['desc'];
		},

		getMarkets: function(branchId) {

			var m = [];
			_.each(Object.keys(demo.markets), function(id) {
				if (demo.markets[id]['branch'] == branchId) m.push(new BigNumber(id));
			});
			return m;
		},


		// placing here for for demo purposes
		getMarketComments: function(id) {
			return demo.markets[id]['comments'];
		},

		// placing here for for demo puporses
		getMarketHistory: function(id) {
			return demo.markets[id]['priceHistory'];
		},

		// placing here for for demo puporses
		getMarketVolume: function(id) {
			return demo.markets[id]['volume'];
		},

		// placing here for for demo puporses
		getMarketShares: function(id, account) {
			return demo.markets[id]['sharesHeld'][account];
		},

		getMarketInfo: function(id) {

			return demo.markets[id]['info'];
		},

		getMarketDesc: function(id) {

			return demo.markets[id]['desc'];
		},

		createMarket: function(branchId, text, alpha, initialLiquidity, tradingFee, events) {

			return new BigNumber(Object.keys(augur.data.markets).length + 1);
		},

		createEvent: function(branchId, text, block, min, max, num) {

			return new BigNumber(Object.keys(augur.data.events).length + 1);
		},

		call: function() { return demo.contract }
	},

	events: {

		1: {
			desc: 'True',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(1010101),
				new BigNumber(2030),
				null,
				new BigNumber(0),
				new BigNumber(1),
				new BigNumber(2)
			]
		},
		2: {
			desc:  'False',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(1010101),
				new BigNumber(2030),
				null,
				new BigNumber(0),
				new BigNumber(1),
				new BigNumber(2)
			]
		}
	},

	markets: {

		1: {
			desc: 'Hillary Clinton will win the electoral vote in the 2016 presidential election.',
			branch: 1010101,
			info: [
				new BigNumber(1),		// creator
				new BigNumber(100),		// creator fee
			    new BigNumber(1),  		// currentParticipant
			    new BigNumber(1),  		// alpha
			    new BigNumber(1),  		// cumulativeScale
			    new BigNumber(2),  		// numOutcomes
			    new BigNumber(20000) ,  // tradingPeriod
			    new BigNumber(10)     	// tradingFee
			],
			volume: 2303,
			comments: [
				{
					'date': new Date('08/16/2015'),
					'author': "0x37e540ac73bb38130ac73be540",
					'comment': "Her poll numbers haven't budged because 90% of voters have already made up their minds about her. We've all watched her trials and tribulations for decades. You either trust her or you don't. You either think the dozens of \"scandals\" she's had to deal with have been politically motivated or you believe them all to be true even if the accusations were proven false after lengthy investigations. People are not going to change their opinions because of this latest scandal or any scandal in the future. The only 2016 swing voters who don't already have strong opinions about Clinton are currently 16 years old and not following the email non-story."
				},
				{
					'date': new Date('07/12/2015'),
					'author': "0x37f540dc73040dc73403fadc7",
					'comment': "We don't trust her, but some will vote for her in a mindless allegiance to partisanship."
				},
				{
					'date': new Date('07/01/2015'),
					'author': "0x34e5247f540dc7304a3ccc81b",
					'comment': "RON PAUL 2012!!!!"
				},
				{
					'date': new Date('06/01/2015'),
					'author': "0x64252bb38130acaa7372fe819",
					'comment': "So she's leading in a primary where nobody is running, not even her?"
				}
			],
			sharesHeld: {
				'0xDEM0': [4]
			},
			priceHistory: [
	            ['7/20',  0.400],
	            ['7/21',  0.412],
	            ['7/22',  0.403],
	            ['7/23',  0.378],
	            ['7/24',  0.412],
	            ['7/25',  0.478],
	            ['7/26',  0.488],
	            ['7/27',  0.475],
	            ['7/28',  0.413],
	            ['7/29',  0.400],
	            ['7/30',  0.321],
	            ['8/1',  0.389],
	            ['8/2',  0.409],
	            ['8/3',  0.413],
	            ['8/4',  0.429],
	            ['8/5',  0.444],
	            ['8/6',  0.412],
	            ['8/7',  0.429],
	            ['8/8',  0.433],
	            ['8/9',  0.500],
	            ['8/10',  0.541],
	            ['8/11',  0.622],
	            ['8/12',  0.679]
			]
		}
	},

	branches: {

		1010101: {
			desc: 'General',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(0),
				new BigNumber(2000),
				new BigNumber(1),
				new BigNumber(0)
			],
			rep: new BigNumber(200).times(new BigNumber(2).toPower(64))
		}
	}
};

module.exports = demo;
