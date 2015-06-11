module.exports = [{
    "name": "getCreationFee(int256)",
    "type": "function",
    "inputs": [{ "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getCreator(int256)",
    "type": "function",
    "inputs": [{ "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "getDescription(int256)",
    "type": "function",
    "inputs": [{ "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "bytes" }]
},
{
    "name": "getDescriptionLength(int256)",
    "type": "function",
    "inputs": [{ "name": "ID", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
},
{
    "name": "setInfo(int256,bytes,int256,int256)",
    "type": "function",
    "inputs": [{ "name": "ID", "type": "int256" }, { "name": "description", "type": "bytes" }, { "name": "creator", "type": "int256" }, { "name": "fee", "type": "int256" }],
    "outputs": [{ "name": "out", "type": "int256" }]
}];
