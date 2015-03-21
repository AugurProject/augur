var stub = {

	web3: {
		eth: {

		},

		net: {

		},
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

		call: function() { return stub.contract }
	},

	events: {

		1: {
			desc: 'ISIL is a CIA funded, puppet terroist organization',
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

	branches: {

		1010101: {
			desc: 'General',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(2),
				new BigNumber(2000),
				new BigNumber(1),
				new BigNumber(0)
			],
			rep: new BigNumber(200).times(new BigNumber(2).toPower(64))
		},

		1010102: {
			desc: 'Politics',
			info: [
				new BigNumber(1),
				new BigNumber(100),
				new BigNumber(2),
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
				new BigNumber(2),
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
				new BigNumber(2),
				new BigNumber(1000),
				new BigNumber(1),
				new BigNumber(0)
			],
			rep: new BigNumber(35).times(new BigNumber(2).toPower(64))
		}
	}
}