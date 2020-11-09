const fs = require('fs');
const mustache = require('mustache');

const augur = require('@augurproject/subgraph/abis/Augur.json');
const shareToken = require('@augurproject/subgraph/abis/ShareToken.json');
const augurTrading = require('@augurproject/subgraph/abis/AugurTrading.json');

const paraDeployer = require('@augurproject/subgraph/abis/ParaDeployer.json');
const paraShareToken = require('@augurproject/subgraph/abis/ParaShareToken.json');

function buildit(abi) {
  return abi.filter((item) => {
    return item.type === "event"
  }).map((event) => {

    return {
      ...event
    };
  });
}

const template = fs.readFileSync('./templates/handlers.mustache').toString();
const buildFile = (name, abi) => {
  const result = mustache.render(template, {
    Name: name,
    Entities: buildit(abi),
    GetTemplateForType: function() {
      return function(...args) {
        switch (this.type) {
          case "bytes32[]":
          case "bytes32":
          case "boolean":
          case "bool":
          case "string":
            return `event.params.${this.name}`;
          case "address[]":
            return `mapAddressArray(event.params.${this.name})`;
          case "uint256[]":
          case "int256[]":
            return `mapArray(event.params.${this.name})`;
          case "uint8":
            return `event.params.${this.name}`;
        }

        return `event.params.${this.name}.toHexString()`;
      }
    }
  });

  fs.writeFileSync(`./src/${name}.ts`, result);
}

buildFile("Augur", augur);

buildFile("AugurTrading", augurTrading);

buildFile("ShareToken", shareToken);
