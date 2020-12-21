const fs = require('fs');
const mustache = require('mustache');

function buildit(contractName) {
  const abi = require(`../abis/${contractName}.json`);
  return {
    name: contractName,
    events: abi.filter((item) => {
      return item.type === "event"
    }).map((item) => {
      const inputs = item.inputs.map((item) => {
        if (item.indexed) {
          return `indexed ${item.type}`;
        } else {
          return item.type;
        }
      }).join(',');

      return {
        name: item.name,
        inputs: `${item.name}(${inputs})`
      }
    })
  }
};

const template = fs.readFileSync('./templates/subgraph.template.mustache').toString();
const contractPartial = fs.readFileSync('./templates/subgraph.contract.partial.mustache').toString();
const result = mustache.render(template,{
  entities: [
    buildit('Augur'),
    buildit('AugurTrading'),
    buildit(`ShareToken`),
  ]
}, {
  contractPartial
});

fs.writeFileSync(`./subgraph.template.yaml`, result);
