"use strict";

// blacklist markets & events by network id then branch id

// initialize blacklists with network ids
var markets = {'0': {}, '1': {}, '2': {}, '7': {}, '10101': {}};
var events = {'0': {},  '1': {}, '2': {}, '7': {}, '10101': {}};

// [ network id ][ branch id ]
markets['0']['1010101'] = [];
markets['1']['1010101'] = [];
markets['2']['1010101'] = [];
markets['7']['1010101'] = [];
markets['10101']['1010101'] = [];

module.exports = {
	markets: markets,
	events: events
};
