module.exports = [{
    "name": "buyShares(int256,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }, { "name": "nonce", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getNonce(int256)",
    "type": "function",
    "inputs": [{ "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "sellShares(int256,int256,int256,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "branch", "type": "int256" }, { "name": "market", "type": "int256" }, { "name": "outcome", "type": "int256" }, { "name": "amount", "type": "int256" }, { "name": "nonce", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "pricePaid(int256,int256,int256,int256)",
    "type": "event",
    "inputs": [{ "name": "user", "type": "int256", "indexed": false }, { "name": "market", "type": "int256", "indexed": false }, { "name": "outcome", "type": "int256", "indexed": false }, { "name": "paid", "type": "int256", "indexed": false }]
},
{
    "name": "priceSold(int256,int256,int256,int256)",
    "type": "event",
    "inputs": [{ "name": "user", "type": "int256", "indexed": false }, { "name": "market", "type": "int256", "indexed": false }, { "name": "outcome", "type": "int256", "indexed": false }, { "name": "paid", "type": "int256", "indexed": false }]
},
{
    "name": "updatePrice(int256,int256,int256,int256)",
    "type": "event",
    "inputs": [{ "name": "user", "type": "int256", "indexed": false }, { "name": "market", "type": "int256", "indexed": false }, { "name": "outcome", "type": "int256", "indexed": false }, { "name": "price", "type": "int256", "indexed": false }]
}];
