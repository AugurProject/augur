#!/usr/bin/env node
/**
 * Create a handful of canned, non-madlibs markets for us to test with.
 */

"use strict";

var async = require("async");
var chalk = require("chalk");
var augur = require("../src");
var DEBUG = false;

augur.options.debug.trading = DEBUG;

var closingBell = new Date();
closingBell.setHours(20, 0, 0, 0);

var midnightTomorrow = new Date();
midnightTomorrow.setDate(midnightTomorrow.getDate() + 1);
midnightTomorrow.setHours(0, 0, 0, 0);

var today = new Date();

var cannedMarkets = [{
    description: "What will the maximum temperature be (in degrees Fahrenheit) on " + today.toLocaleDateString() + " at the San Francisco International Airport, as reported by Weather Underground?",
    expDate: parseInt(midnightTomorrow.getTime() / 1000, 10),
    minValue: -10,
    maxValue: 120,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["weather", "temperature", "SFO"],
    extraInfo: "https://www.penny-arcade.com/comic/2001/12/12",
    resolution: "https://www.wunderground.com/history/airport/KSFO/" + [today.getUTCFullYear(), today.getUTCMonth() + 1, today.getUTCDate()].join('/') + "/DailyHistory.html"
}, {
    description: "Which candidate will be leading in the polls in the 2016 U.S. Presidential election at midnight PST " + midnightTomorrow.toDateString() + ", according to the RealClearPolitics 4-way polling average?~|>Clinton|Trump|Johnson|Stein",
    expDate: parseInt(midnightTomorrow.getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 4,
    takerFee: "0.025",
    makerFee: "0.005",
    tags: ["politics", "US elections", "polling"],
    extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
    resolution: "http://www.realclearpolitics.com/epolls/2016/president/us/general_election_trump_vs_clinton_vs_johnson_vs_stein-5952.html"
}, {
    description: "Will the Dow Jones Industrial Average close at a higher price on " + today.toLocaleDateString() + " than it closed at the previous day?",
    expDate: parseInt(closingBell.getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.05",
    makerFee: "0.015",
    tags: ["Dow Jones", "stock market", "DJIA"],
    extraInfo: "The Daily Dow market lives again! https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average",
    resolution: "https://www.google.com/finance?q=INDEXDJX:.DJI"
}, {
    description: "Will Augur's live release happen by the end of 2016?",
    expDate: parseInt(new Date("1/1/2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.03",
    makerFee: "0.01",
    tags: ["Augur", "release date", "Ethereum"],
    extraInfo: "https://www.augur.net",
    resolution: "https://www.augur.net"
}, {
    description: "Who will win the University of Georgia vs. University of Florida football game in 2016?~|>Georgia|Florida|Vanderbilt",
    expDate: parseInt(new Date("10/30/2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 3,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["college football", "football", "Jacksonville"],
    extraInfo: "",
    resolution: ""
}, {
    description: "Will Tony Sakich win the 2016 annual Augur breakdancing competition?",
    expDate: parseInt(midnightTomorrow.getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.11",
    makerFee: "0.001",
    tags: ["Augur", "breakdancing", "Tony Swish"],
    extraInfo: "",
    resolution: "https://www.augur.net"
}, {
    description: "Will REP tokens be worth more than 100 USD each any time on or before 1.1.2017 on CoinMarketCap?",
    expDate: parseInt(new Date("1/1/2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.09",
    makerFee: "0.04",
    tags: ["Augur", "Reputation", "REP"],
    extraInfo: "https://www.reddit.com/r/reptrader",
    resolution: "http://coinmarketcap.com"
}, {
    description: "Who will win the 2016 U.S. Presidential election?~|>Hillary Clinton|Donald Trump|Gary Johnson|Jill Stein|someone else",
    expDate: parseInt(new Date("1/2/2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 5,
    takerFee: "0.08",
    makerFee: "0.0225",
    tags: ["politics", "US elections", "president"],
    extraInfo: "The United States presidential election of 2016, scheduled for Tuesday, November 8, 2016, will be the 58th quadrennial U.S. presidential election.",
    resolution: ""
}, {
    description: "Will Ethereum trade at $15 or higher by midnight EST on November 30, 2016?",
    expDate: parseInt(new Date("12/1/2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "http://coinmarketcap.com/currencies/ethereum",
    tags: ["ethereum", "trading", "currencies"],
    resolution: "http://coinmarketcap.com"
}, {
    description: "Will SpaceX successfully complete a manned flight to the International Space Station by the end of 2018?",
    expDate: parseInt(new Date("1/1/2019").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "SpaceX hit a big milestone on Friday with NASA confirming on Friday that the Elon Musk-led space cargo business will launch astronauts to the International Space Station by 2017.\n\nLast year, the space agency tentatively awarded a $2.6 billion contract to SpaceX to carry crew to space. NASA’s announcement on Friday formalizes the deal, which involves SpaceX loading its Crew Dragon spacecraft with astronauts and sending them beyond the stratosphere.",
    tags: ["space", "Dragon", "ISS"],
    resolution: "http://www.spacex.com"
}, {
    description: "Will Gary Johnson be included in at least one nationally televised Presidential debate in 2016, in which Hillary Clinton and Donald Trump also participate?",
    expDate: parseInt(new Date("11/8/2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    extraInfo: "Candidates must be polling at 15% or higher to be included in the Presidential debates.",
    tags: ["politics", "US elections", "presidential debates"],
    resolution: ""
}, {
    description: "Which city will have the highest median single-family home price for September 2017?~|>London|New York|Los Angeles|San Francisco|Tokyo|Palo Alto|Hong Kong|other",
    expDate: parseInt(new Date("10-2-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 8,
    takerFee: "0.03",
    makerFee: "0.005",
    tags: ["housing", "economy", "bubble"]
}, {
    description: "What will the high temperature (in degrees Fahrenheit) be in San Francisco, California, on July 1, 2017?",
    expDate: parseInt(new Date("7-2-2017").getTime() / 1000, 10),
    minValue: -10,
    maxValue: 120,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "http://forecast.weather.gov",
    tags: ["temperature", "San Francisco", "weather"]
}, {
    description: "Will the Larsen B ice shelf collapse by November 1, 2017?",
    expDate: parseInt(new Date("11-2-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "",
    tags: ["climate change", "Antartica", "warming"]
}, {
    description: "How many marine species will go extinct between January 1, 2016 and January 1, 2018?",
    expDate: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
    minValue: 0,
    maxValue: 10000,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "science!",
    tags: ["climate", "extinction", "marine biology"]
}, {
    description: "What will the average tropospheric methane concentration (in parts-per-billion) be between January 1, 2017 and January 1, 2018?",
    expDate: parseInt(new Date("1-2-2018").getTime() / 1000, 10),
    minValue: 700,
    maxValue: 5000,
    numOutcomes: 2,
    extraInfo: "Vast quantities of methane are normally locked into the Earth's crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller \"burps\" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis",
    tags: ["climate", "methane", "atmosphere"],
    takerFee: "0.02",
    makerFee: "0.01",
    resolution: "EPA"
}, {
    description: "How many new antibiotics will be approved by the FDA between March 1, 2016 and the end of 2020?",
    expDate: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
    minValue: 0,
    maxValue: 30,
    numOutcomes: 2,
    resolution: "FDA",
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["antibiotics", "medicine", "science"],
    extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
}, {
    description: "Will antibiotics be outlawed for agricultural use in China by the end of 2020?",
    expDate: parseInt(new Date("1-1-2021").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["antibiotics", "China", "science policy"],
    extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?"
}, {
    description: "What will be the number one killer in the United States by January 1, 2025?~|>cancer|heart attacks|infectious diseases|starvation|lava|other",
    expDate: parseInt(new Date("1-2-2025").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 6,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["mortality", "United States", "science"],
    extraInfo: "Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?",
    resolution: "CDC"
}, {
    description: "Who will win the NFL Rookie of the year Award?~|>Carson Wentz|Dak Prescott|Ezekiel Elliott|Will Fuller|Field (Anyone else)",
    expDate: parseInt(new Date("2-5-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 5,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["football", "NFL", "sports"],
    extraInfo: "",
    resolution: "espn.com",
    orderBook: {
        buy: {
            "1": [
                {shares: "200", price: "0.21"},
                {shares: "100", price: "0.18"},
                {shares: "100", price: "0.16"}
            ],
            "2": [
                {shares: "200", price: "0.22"},
                {shares: "100", price: "0.2"},
                {shares: "100", price: "0.18"}
            ],
            "3": [
                {shares: "250", price: "0.3"},
                {shares: "200", price: "0.25"},
                {shares: "100", price: "0.22"}
            ],
            "4": [
                {shares: "200", price: "0.15"},
                {shares: "100", price: "0.12"},
                {shares: "150", price: "0.08"}
            ],
            "5": [
                {shares: "250", price: "0.1"},
                {shares: "200", price: "0.075"},
                {shares: "200", price: "0.05"}
            ]
        },
        sell: {
            "1": [
                {shares: "200", price: "0.24"},
                {shares: "100", price: "0.28"},
                {shares: "100", price: "0.3"}
            ],
            "2": [
                {shares: "100", price: "0.25"},
                {shares: "200", price: "0.28"},
                {shares: "150", price: "0.32"}
            ],
            "3": [
                {shares: "150", price: "0.33"},
                {shares: "200", price: "0.36"},
                {shares: "100", price: "0.38"}
            ],
            "4": [
                {shares: "100", price: "0.18"},
                {shares: "100", price: "0.22"},
                {shares: "200", price: "0.25"}
            ],
            "5": [
                {shares: "100", price: "0.15"},
                {shares: "200", price: "0.18"},
                {shares: "150", price: "0.2"}
            ]
        }
    }
}, {
    description: "Who will win the NFC East Conference?~|>Cowboys|Redskins|Eagles|Giants",
    expDate: parseInt(new Date("1-8-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 4,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["football", "NFL", "sports"],
    extraInfo: "",
    resolution: "espn.com",
    orderBook: {
        buy: {
            "1": [
                {shares: "200", price: "0.34"},
                {shares: "150", price: "0.32"},
                {shares: "200", price: "0.3"}
            ],
            "2": [
                {shares: "50", price: "0.23"},
                {shares: "100", price: "0.26"},
                {shares: "150", price: "0.24"}
            ],
            "3": [
                {shares: "100", price: "0.21"},
                {shares: "150", price: "0.22"},
                {shares: "100", price: "0.2"}
            ],
            "4": [
                {shares: "100", price: "0.2"},
                {shares: "200", price: "0.18"},
                {shares: "300", price: "0.16"}
            ]
        },
        sell: {
            "1": [
                {shares: "100", price: "0.4"},
                {shares: "150", price: "0.45"},
                {shares: "200", price: "0.5"}
            ],
            "2": [
                {shares: "100", price: "0.28"},
                {shares: "200", price: "0.32"},
                {shares: "250", price: "0.36"}
            ],
            "3": [
                {shares: "150", price: "0.25"},
                {shares: "250", price: "0.29"},
                {shares: "200", price: "0.33"}
            ],
            "4": [
                {shares: "50", price: "0.25"},
                {shares: "150", price: "0.28"},
                {shares: "100", price: "0.3"}
            ]
        }
    }
}, {
    description: "Who will win the MLB World Series?~|>Indians|Blue Jays|Dodgers|Cubs",
    expDate: parseInt(new Date("11-5-2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 4,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["baseball", "MLB", "sports"],
    extraInfo: "",
    resolution: "espn.com",
    orderBook: {
        buy: {
            "1": [
                {shares: "100", price: "0.33"},
                {shares: "200", price: "0.3"},
                {shares: "150", price: "0.26"}
            ],
            "2": [
                {shares: "50", price: "0.14"},
                {shares: "100", price: "0.1"},
                {shares: "100", price: "0.06"}
            ],
            "3": [
                {shares: "100", price: "0.25"},
                {shares: "100", price: "0.22"},
                {shares: "200", price: "0.18"}
            ],
            "4": [
                {shares: "200", price: "0.26"},
                {shares: "100", price: "0.24"},
                {shares: "200", price: "0.2"}
            ]
        },
        sell: {
            "1": [
                {shares: "100", price: "0.38"},
                {shares: "200", price: "0.42"},
                {shares: "150", price: "0.46"}
            ],
            "2": [
                {shares: "200", price: "0.18"},
                {shares: "250", price: "0.2"},
                {shares: "300", price: "0.24"}
            ],
            "3": [
                {shares: "100", price: "0.3"},
                {shares: "200", price: "0.34"},
                {shares: "200", price: "0.38"}
            ],
            "4": [
                {shares: "100", price: "0.3"},
                {shares: "150", price: "0.34"},
                {shares: "200", price: "0.38"}
            ]
        }
    }
}, {
    description: "Who will win the PGA Tournament of Champions?~|>Jason Day|Jordan Spieth|Dustin Johnson|Rory Mcllroy|Henrik Stenson|Field",
    expDate: parseInt(new Date("1-10-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 6,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["golf", "PGA", "sports"],
    extraInfo: "",
    resolution: "espn.com",
    orderBook: {
        buy: {
            "1": [
                {shares: "200", price: "0.16"},
                {shares: "100", price: "0.14"},
                {shares: "100", price: "0.12"}
            ],
            "2": [
                {shares: "200", price: "0.14"},
                {shares: "100", price: "0.14"},
                {shares: "100", price: "0.11"}
            ],
            "3": [
                {shares: "250", price: "0.15"},
                {shares: "200", price: "0.12"},
                {shares: "100", price: "0.1"}
            ],
            "4": [
                {shares: "200", price: "0.15"},
                {shares: "100", price: "0.12"},
                {shares: "150", price: "0.08"}
            ],
            "5": [
                {shares: "250", price: "0.11"},
                {shares: "200", price: "0.08"},
                {shares: "200", price: "0.05"}
            ],
            "6": [
                {shares: "250", price: "0.27"},
                {shares: "150", price: "0.25"},
                {shares: "200", price: "0.22"}
            ]
        },
        sell: {
            "1": [
                {shares: "200", price: "0.22"},
                {shares: "100", price: "0.25"},
                {shares: "100", price: "0.3"}
            ],
            "2": [
                {shares: "100", price: "0.18"},
                {shares: "200", price: "0.22"},
                {shares: "150", price: "0.25"}
            ],
            "3": [
                {shares: "150", price: "0.18"},
                {shares: "200", price: "0.22"},
                {shares: "100", price: "0.26"}
            ],
            "4": [
                {shares: "100", price: "0.19"},
                {shares: "100", price: "0.22"},
                {shares: "200", price: "0.25"}
            ],
            "5": [
                {shares: "100", price: "0.15"},
                {shares: "200", price: "0.18"},
                {shares: "150", price: "0.2"}
            ],
            "6": [
                {shares: "200", price: "0.3"},
                {shares: "100", price: "0.34"},
                {shares: "150", price: "0.38"}
            ]
        }
    }
}, {
    description: "How many strokes will the winner of the PGA Tournament of Champions win by?~|>0 - will be decided by playoff|1|2|3|4|5 or more",
    expDate: parseInt(new Date("1-10-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 6,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["golf", "PGA", "sports"],
    extraInfo: "",
    resolution: "espn.com",
    orderBook: {
        buy: {
            "1": [
                {shares: "150", price: "0.3"},
                {shares: "200", price: "0.25"}
            ],
            "2": [
                {shares: "200", price: "0.2"},
                {shares: "100", price: "0.16"}
            ],
            "3": [
                {shares: "50", price: "0.18"},
                {shares: "100", price: "0.16"}
            ],
            "4": [
                {shares: "125", price: "0.14"},
                {shares: "150", price: "0.1"}
            ],
            "5": [],
            "6": [
                {shares: "100", price: "0.08"},
                {shares: "250", price: "0.04"}
            ]
        },
        sell: {
            "1": [
                {shares: "50", price: "0.34"},
                {shares: "150", price: "0.38"}
            ],
            "2": [
                {shares: "100", price: "0.25"},
                {shares: "50", price: "0.28"}
            ],
            "3": [
                {shares: "100", price: "0.22"},
                {shares: "200", price: "0.26"}
            ],
            "4": [
                {shares: "100", price: "0.18"},
                {shares: "50", price: "0.2"}
            ],
            "5": [
                {shares: "250", price: "0.14"},
                {shares: "300", price: "0.18"}
            ],
            "6": [
                {shares: "200", price: "0.12"},
                {shares: "250", price: "0.14"}
            ]
        }
    }
}, {
    description: "Will the NY Giants finish with a better regular season record than the NY Jets?",
    expDate: parseInt(new Date("1-2-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["football", "NFL", "sports"],
    extraInfo: "",
    resolution: "espn.com",
    orderBook: {
        buy: {
            "2": [
                {shares: "150", price: "0.56"},
                {shares: "250", price: "0.52"},
                {shares: "200", price: "0.48"}
            ],
            "1": []
        },
        sell: {
            "2": [
                {shares: "50", price: "0.6"},
                {shares: "200", price: "0.65"},
                {shares: "250", price: "0.68"}
            ],
            "1": []
        }
    }
}, {
    description: "Will WTI crude oil finish the year trading below $50.00/barrel? (After hours trading will not be considered on 12/30/2016.)",
    expDate: parseInt(new Date("1-1-2017").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["crude oil", "energy", "Nymex"],
    extraInfo: "",
    resolution: "http://www.bloomberg.com/energy",
    orderBook: {
        buy: {
            "2": [
                {shares: "100", price: "0.48"},
                {shares: "150", price: "0.44"},
                {shares: "250", price: "0.4"}
            ],
            "1": []
        },
        sell: {
            "2": [
                {shares: "100", price: "0.52"},
                {shares: "150", price: "0.56"},
                {shares: "200", price: "0.6"}
            ],
            "1": []
        }
    }
}, {
    description: "Who will win the popular vote in the 2016 Presidential Election?~|>Hillary Clinton|Donald Trump|other",
    expDate: parseInt(new Date("11-10-2016").getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 3,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["US politics", "elections", "President"],
    extraInfo: "",
    resolution: "realclearpolitics.com",
    orderBook: {
        buy: {
            "1": [
                {shares: "100", price: "0.48"},
                {shares: "50", price: "0.45"},
                {shares: "200", price: "0.42"}
            ],
            "2": [
                {shares: "150", price: "0.44"},
                {shares: "200", price: "0.4"},
                {shares: "200", price: "0.36"}
            ],
            "3": [
                {shares: "100", price: "0.02"},
                {shares: "100", price: "0.01"}
            ]
        },
        sell: {
            "1": [
                {shares: "100", price: "0.52"},
                {shares: "200", price: "0.56"},
                {shares: "250", price: "0.6"}
            ],
            "2": [
                {shares: "100", price: "0.49"},
                {shares: "100", price: "0.53"},
                {shares: "200", price: "0.56"}
            ],
            "3": [
                {shares: "100", price: "0.05"},
                {shares: "500", price: "0.1"}
            ]
        }
    }
}, {
    description: "Will AAPL settle above $117.00 today?",
    expDate: parseInt(midnightTomorrow.getTime() / 1000, 10),
    minValue: 1,
    maxValue: 2,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["AAPL", "NASDAQ", "stocks"],
    extraInfo: "",
    resolution: "https://www.google.com/finance?q=NASDAQ:AAPL",
    orderBook: {
        buy: {
            "2": [
                {shares: "100", price: "0.48"},
                {shares: "150", price: "0.44"},
                {shares: "250", price: "0.4"}
            ],
            "1": []
        },
        sell: {
            "2": [
                {shares: "100", price: "0.52"},
                {shares: "150", price: "0.56"},
                {shares: "200", price: "0.6"}
            ],
            "1": []
        }
    }
}, {
    description: "How many regular season wins will the NY Jets finish with in the 2016-2017 season?",
    expDate: parseInt(new Date("1-2-2017").getTime() / 1000, 10),
    minValue: 0,
    maxValue: 16,
    numOutcomes: 2,
    takerFee: "0.02",
    makerFee: "0.01",
    tags: ["sports", "NFL", "Jets"],
    extraInfo: "",
    resolution: "http://www.footballdb.com/teams/nfl/new-york-jets/results",
    orderBook: {
        buy: {
            "2": [
                {shares: "50", price: "6"},
                {shares: "200", price: "5.5"},
                {shares: "250", price: "5"}
            ],
            "1": []
        },
        sell: {
            "2": [
                {shares: "100", price: "7"},
                {shares: "150", price: "7.5"},
                {shares: "200", price: "8"}
            ],
            "1": []
        }
    }
}];

augur.connect({
    http: "http://127.0.0.1:8545",
    ipc: process.env.GETH_IPC,
    ws: "ws://127.0.0.1:8546"
}, function (connected) {
    if (!connected) return console.error("connect failed:", connected);
    augur.setCash(augur.from, "10000000000000", augur.utils.noop, function (r) {
        console.debug("setCash success:", r.callReturn);
        async.eachSeries(cannedMarkets, function (market, nextMarket) {
            market.branchId = augur.constants.DEFAULT_BRANCH_ID;
            market.onSent = function (r) {
                if (DEBUG) console.debug("createSingleEventMarket sent:", r);
            };
            market.onSuccess = function (r) {
                var i;
                if (DEBUG) console.debug("createSingleEventMarket success:", r.callReturn);
                console.log(chalk.green(r.callReturn), chalk.cyan.dim(market.description));
                var initialFairPrices = new Array(market.numOutcomes);
                var isScalar = false;
                if (market.numOutcomes === 2 && (market.minValue !== 1 || market.maxValue !== 2)) {
                    var midpoint = ((market.maxValue - market.minValue) / 2).toString();
                    initialFairPrices[0] = midpoint;
                    initialFairPrices[1] = midpoint;
                    isScalar = true;
                } else {
                    for (i = 0; i < market.numOutcomes; ++i) {
                        initialFairPrices[i] = (1 / market.numOutcomes).toString();
                    }
                }
                var marketID = r.callReturn;
                if (!market.orderBook) {
                    var orderBookParams = {
                        market: marketID,
                        liquidity: 100,
                        initialFairPrices: initialFairPrices,
                        startingQuantity: 5,
                        bestStartingQuantity: 10,
                        priceWidth: "0.2"
                    };
                    console.log(chalk.blue.bold("Generating order book:"), chalk.cyan.dim(JSON.stringify(orderBookParams, null, 2)));
                    augur.generateOrderBook(orderBookParams, {
                        onBuyCompleteSets: function (res) {
                            if (DEBUG) console.log("onBuyCompleteSets", res);
                        },
                        onSetupOutcome: function (res) {
                            if (DEBUG) console.log("onSetupOutcome", res);
                            console.log(chalk.white.dim(" - Outcome"), chalk.cyan(res.outcome));
                        },
                        onSetupOrder: function (res) {
                            if (DEBUG) console.log("onSetupOrder", res);
                        },
                        onSuccess: function (res) {
                            console.log(chalk.blue.bold("Order book generated:"));
                            console.log("  " + chalk.cyan(Object.keys(res.sell).length.toString() + " asks"));
                            console.log("  " + chalk.green(Object.keys(res.buy).length.toString() + " bids"));
                            nextMarket();
                        },
                        onFailed: function (err) {
                            console.error(chalk.red.bold("generateOrderBook failed:"), err);
                            nextMarket();
                        }
                    });
                } else {
                    var scalarMinMax = null;
                    if (isScalar) {
                        scalarMinMax = {minValue: market.minValue, maxValue: market.maxValue};
                    }
                    var largestOutcomeShares = 0;
                    for (var outcomeID in market.orderBook.sell) {
                        if (!market.orderBook.sell.hasOwnProperty(outcomeID)) continue;
                        var sellOrders = market.orderBook.sell[outcomeID];
                        if (sellOrders && sellOrders.length) {
                            var outcomeShares = 0;
                            for (i = 0; i < sellOrders.length; ++i) {
                                outcomeShares += parseInt(sellOrders[i].shares, 10);
                            }
                            if (outcomeShares > largestOutcomeShares) {
                                largestOutcomeShares = outcomeShares;
                            }
                        }
                    }
                    // console.log('largestOutcomeShares:', largestOutcomeShares);
                    augur.buyCompleteSets({
                        market: marketID,
                        amount: "0x" + largestOutcomeShares.toString(16),
                        onSent: function (res) {
                            // console.log("buyCompleteSets sent:", res.txHash);
                        },
                        onSuccess: function (res) {
                            // console.log("buyCompleteSets success:", res.callReturn);
                            async.forEachOfSeries(market.orderBook, function (orders, orderType, nextOrderType) {
                                async.forEachOfSeries(orders, function (outcomeOrders, outcome, nextOutcome) {
                                    async.each(outcomeOrders, function (order, nextOrder) {
                                        if (orderType === "buy") {
                                            augur.buy({
                                                amount: order.shares,
                                                price: order.price,
                                                market: marketID,
                                                outcome: outcome,
                                                scalarMinMax: scalarMinMax,
                                                onSent: function (res) {
                                                    // console.log("buy sent:", orderType, outcome, order, res.callReturn, res.txHash);
                                                },
                                                onSuccess: function (res) {
                                                    // console.log("buy success:", orderType, outcome, order, res.callReturn, res.hash);
                                                    nextOrder();
                                                },
                                                onFailed: function (err) {
                                                    console.error("buy failed:", orderType, outcome, order);
                                                    nextOrder(err);
                                                }
                                            });
                                        } else {
                                            augur.sell({
                                                amount: order.shares,
                                                price: order.price,
                                                market: marketID,
                                                outcome: outcome,
                                                scalarMinMax: scalarMinMax,
                                                onSent: function (res) {
                                                    // console.log("sell sent:", orderType, outcome, order, res.callReturn, res.txHash);
                                                },
                                                onSuccess: function (res) {
                                                    // console.log("sell success:", orderType, outcome, order, res.callReturn, res.hash);
                                                    nextOrder();
                                                },
                                                onFailed: function (err) {
                                                    console.error("sell failed:", orderType, outcome, order);
                                                    nextOrder(err);
                                                }
                                            });
                                        }
                                    }, function (err) {
                                        if (err) console.error("each order:", err);
                                        nextOutcome();
                                    });
                                }, function (err) {
                                    if (err) console.error("each outcome:", err);
                                    nextOrderType();
                                });
                            }, function (err) {
                                if (err) console.error("each order type:", err);
                                nextMarket();
                            });
                        },
                        onFailed: function (err) {
                            console.error("buyCompleteSets failed:", err);
                            nextMarket();
                        }
                    });
                }
            };
            market.onFailed = function (e) {
                console.error(chalk.red.bold("createSingleEventMarket failed:"), e);
                nextMarket();
            };
            augur.createSingleEventMarket(market);
        }, process.exit);
    }, process.exit);
});
