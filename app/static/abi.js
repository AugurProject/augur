module.exports =
[{
    "name": "api(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "dataStructure", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "arrayIndex", "type": "int256" }, { "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "balance(int256)",
    "type": "function",
    "inputs": [{ "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "buyShares(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "createEvent(int256,string,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "description", "type": "string" }, { "name": "expDate", "type": "int256" }, { "name": "minValue", "type": "int256" }, { "name": "maxValue", "type": "int256" }, { "name": "numOutcomes", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "createMarket(int256,string,int256,int256,int256,int256[])",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "description", "type": "string" }, { "name": "alpha", "type": "int256" }, { "name": "initialLiquidity", "type": "int256" }, { "name": "tradingFee", "type": "int256" }, { "name": "events", "type": "int256[]" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "createSubbranch(string,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "description", "type": "string" }, { "name": "periodLength", "type": "int256" }, { "name": "parent", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "faucet()",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getBranchDesc(int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "string" }]
},
{
    "name": "getBranchInfo(int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getBranches()",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getEventDesc(int256)",
    "type": "function",
    "inputs": [{ "name": "event", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "string" }]
},
{
    "name": "getEventInfo(int256)",
    "type": "function",
    "inputs": [{ "name": "event", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getEvents(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "expPeriod", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getMarketDesc(int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "string" }]
},
{
    "name": "getMarketEvents(int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getMarketInfo(int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getMarkets(int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "getRepBalance(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getReputation(int256)",
    "type": "function",
    "inputs": [{ "name": "address", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256[]" }]
},
{
    "name": "marketParticipantsApi(int256,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "participantIndex", "type": "int256" }, { "name": "itemNumber", "type": "int256" }, { "name": "eventID", "type": "int256" }, { "name": "outcomeNumber", "type": "int256" }, { "name": "marketID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "price(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sellShares(int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "send(int256,int256)",
    "type": "function",
    "inputs": [{ "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sendFrom(int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }, { "name": "from", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sendReputation(int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "recver", "type": "int256" }, { "name": "value", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "vote(int256,int256[],int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "report", "type": "int256[]" }, { "name": "votePeriod", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
}]