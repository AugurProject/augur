var stubContract = {

	faucet: function() {

		return new BigNumber(1);
	},

	balance: function(foo) {

		return new BigNumber(10000).times(new BigNumber(2).toPower(64))
	},

	getBranches: function() {

		var b = [];
		_.each(Object.keys(branches), function(id) {
			b.push(new BigNumber(id));
		});
		return b;
	},

	getBranchInfo: function(id) {

		return branches[id]['info'];
	},

	getBranchDesc: function(id) {

		return branches[id]['desc'];
	},

	getRepBalance: function(id) {

		return branches[id]['rep'];
	},

	call: function() { return this }
}

var branches = {

	1010101: {
		desc: 'General',
		info: [
			new BigNumber(1),
			new BigNumber(100),
			new BigNumber(2),
			new BigNumber(200),
			new BigNumber(1),
			new BigNumber(0)
		],
		rep: new BigNumber(200).times(new BigNumber(2).toPower(64))
	}
}