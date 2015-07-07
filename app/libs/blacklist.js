// blacklist markets & events by network id then branch id

// initialize blacklists with network ids
var markets = { 0: {}, 1010101:{} };
var events = { 0: {}, 1010101:{} };

// [ network id ][ branch id ]
markets['0']['1010101'] = [
    "-5dde797afe63c50d8307d5eb7add333e1c522cb94387de7e053456ec1916cc26",
    "12d32e7bdff4e264ce098f3ea197cf70fdc13a94dfa1ac2e0c262255206513e1",
    "-4f7e57337649767d2097543bfd6b83e0d0b0322302b35dcd12b9e6ba2ed42cb5",
    "-473bf9b150afd0ac2eefaf118f8d26d5beeb5fe66d01714b0acaf6dc126f6a97",
    "-2d0684a81feca5e3d09ff793d9dbd377a2a1cb12218ac3897e865773ba929b09",
    "7cddd710b40631b55b29e434cb821480ad096abe73bec01f75b172cbbb1e138a",
    "7f96eaf4546da93f6f3be17768b6a780633914f84b2995e7ace2b33643b47686"
];

module.exports = {
	markets: markets,
	events: events
};
