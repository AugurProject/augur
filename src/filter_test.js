var config = {
    http: "http://localhost:8545",
    ws:  null,
}

var async = require("async");
var augur = require("./");
augur.connect(config);
//augur.connect();

/*var marketID="0x0807a0345698411821136062648d381ab7cbb48783430ca7b4da60315de93b58";
var start = new Date().getTime();
augur.getMarketInfo(marketID);
var end = new Date().getTime();
var time = end - start;

console.log(time);
*/
augur.filters.listen({
    marketCreated: function (msg) {
        console.log("market created filter:", msg);
    },
    //foo: function (msg){
    //    console.log("foo filter: ", msg);
   // }
}, function (filters) {
	console.log("first complete:", filters);
	augur.filters.listen({
    	marketCreated: function (msg) {
        	console.log("market created filter2:", msg);
    	}
	}, function (filters) {
		console.log("second complete:", filters);
	});
});
