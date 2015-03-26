var stub = {

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
				}
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
				}
			}
		}
	},

	contract: {

		faucet: function() {

			return new BigNumber(1);
		},

		balance: function(foo) {

			return new BigNumber(10000).times(new BigNumber(2).toPower(64))
		},

		getBranches: function() {

			var b = [];
			_.each(Object.keys(stub.branches), function(id) {
				b.push(new BigNumber(id));
			});
			return b;
		},

		getBranchInfo: function(id) {

			return stub.branches[id]['info'];
		},

		getBranchDesc: function(id) {

			return stub.branches[id]['desc'];
		},

		getRepBalance: function(id) {

			return stub.branches[id]['rep'];
		},

		getEvents: function(branchId) {

			var e = [];
			_.each(Object.keys(stub.events), function(id) {
				if (stub.events[id]['info'][2].toNumber() == branchId) e.push(new BigNumber(id));
			});
			return e;
		},

		getEventInfo: function(id) {

			return stub.events[id]['info'];
		},

		getEventDesc: function(id) {

			return stub.events[id]['desc'];
		},

		getMarkets: function(branchId) {

			var m = [];
			_.each(Object.keys(stub.markets), function(id) {
				if (stub.markets[id]['branch'] == branchId) m.push(new BigNumber(id));
			});
			return m;
		},

		getMarketInfo: function(id) {

			return stub.markets[id]['info'];
		},

		getMarketDesc: function(id) {

			return stub.markets[id]['desc'];
		},

		createMarket: function(branchId, text, alpha, initialLiquidity, tradingFee, events) {

			return new BigNumber(Object.keys(augur.data.markets).length + 1);
		},

		createEvent: function(branchId, text, block, min, max, num) {

			return new BigNumber(Object.keys(augur.data.events).length + 1);
		},

		call: function() { return stub.contract }
	},

	events: {

		1: {
			desc: 'ISIL is a CIA funded, puppet terrorist organization',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(1010102), 
				new BigNumber(2030),
				null,
				new BigNumber(0), 
				new BigNumber(1), 
				new BigNumber(2)
			]
		},
		2: {
			desc:  'The Easter Bunny is a carnivore',
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
		3: {
			desc:  'Unicorns are real',
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
		4: {
			desc:  'The moon is made of pure, russian caviar',
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
			desc: 'Hillary Clinton will win the electorial vote in the 2016 presidential election.',
			branch: 1010102,
			info: [
				new BigNumber(1),		// creator
				new BigNumber(100),		// creator fee
			    new BigNumber(1),  		// currentParticipant
			    new BigNumber(1),  		// alpha
			    new BigNumber(1),  		// cumulativeScale
			    new BigNumber(2),  		// numOutcomes
			    new BigNumber(20000) ,  // tradingPeriod
			    new BigNumber(10)     	// tradingFee
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
		},

		1010102: {
			desc: 'U.S. Politics',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(0),
				new BigNumber(8000),
				new BigNumber(1),
				new BigNumber(0)
			],
			rep: new BigNumber(20).times(new BigNumber(2).toPower(64))
		},

		1010103: {
			desc: 'Commodities',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(0),
				new BigNumber(6000),
				new BigNumber(1),
				new BigNumber(0)
			],
			rep: new BigNumber(105).times(new BigNumber(2).toPower(64))
		},

		1010104: {
			desc: 'Sports',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(0),
				new BigNumber(1000),
				new BigNumber(1),
				new BigNumber(0)
			],
			rep: new BigNumber(35).times(new BigNumber(2).toPower(64))
		}
	}
}