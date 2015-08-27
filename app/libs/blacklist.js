// blacklist markets & events by network id then branch id

// initialize blacklists with network ids
var markets = { 0: {}, 7:{} };
var events = { 0: {}, 7:{} };

// [ network id ][ branch id ]
markets['0']['1010101'] = [
    "7960c1fb48ac30c060c143666520ac11822a7337a0fe86807ea73675c4b7b65",
    "82a2883b413003b790398230f1793a49b66f51190ff0a64bf37ff0feec1e458",
    "8a36bb791ceb1d80da3bbe6b02a55030bb0c5d8233e7d2b8e9742d2b1ac4a1b",
    "-679dd23af25d5053c639e2f17789cc4838a8bbef7fc4275e2e4f6ba59b365ab",
    "-baecbd5912a5365e499c58f66d8a7b0362b139ff55d766c00194bdf255762fb0",
    "-9d16373030c5ee68f4df240edfae9ed3ad853fbaef21a757e879527be03f71b",
    "-5bfeea0efc754add5e4d11d8a57666f5210a7f5d46437e406b127971b28ac381",
    "-144a8d4b00f0ec1d5b2ac030c23c39e8e99acdc91ff37d8298380c9eb4bdf8d4",
    "-7c3e6010123bff906d24b946dce575ee854c02fc895e7d0b1a6e0c1cda1de64d",
    "-81635174e39d2ddf7e978e7891ecdba821fd3cae44e0351f64c8dedc383bb771",
    "-78e4a8b5dbd3a013a42cf8976654045ad1614e2882515791ba43876922b37802",
    "-e055740a84abada89dfc997cb33083f24f1fd2d5788088888d3f41febaece0c5"
];

markets['7']['1010101'] = [

];

module.exports = {
	markets: markets,
	events: events
};
