const fs = require('fs');
const mustache = require('mustache');

const getTypeMapping = (abiType, abiName, eventName) => {
  const typeMap = {
    'address': 'String',
    'address[]': '[String!]!',
    'uint8': 'Int!',
    'int256': 'String!',
    'uint256': 'String!',
    'uint256[]': '[String!]!',
    'int256[]': '[String!]!',
    'bytes32': 'Bytes',
    'bytes32[]': '[Bytes!]!',
    'bool': 'Boolean!',
    'string': 'String!'
  };

  const t = typeMap[abiType];
  if (typeof t === 'string') return t;
  if (typeof t === 'undefined') throw new Error(`unable to find type for ${abiType} with name ${abiName} and event name ${eventName}`);

  const s = t[abiName];
  if (typeof s === 'undefined') throw new Error(`unable to find graph entity name for ${abiName} with type ${abiType} and event name ${eventName}`);
  return s;
}

function buildit(contractName) {
  const abi = require(`../abis/${contractName}.json`);
  return abi.filter((item) => {
    return item.type === "event"
  }).map((event) => {
    const inputs =  event.inputs.map((item) => {
      return {
        name: item.name,
        type: getTypeMapping(item.type, item.name, event.name)
      }
    }).filter((item) => item.name !== 'id');

    return {
      ...event,
      inputs
    };
  });
}

const template = fs.readFileSync('./templates/graphentity.mustache').toString();
const result = mustache.render(template,{
  Entities: [
    ...buildit('Augur'),
    ...buildit('AugurTrading'),
    ...buildit(`ShareToken`)
  ]
});

fs.writeFileSync("./schema.graphql", result);
