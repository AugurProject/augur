const fs = require('fs');
const mustache = require('mustache');

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
const baseIDtemplate = fs.readFileSync('./templates/handlers.baseID.mustache').toString();
const rollupIDtemplate = fs.readFileSync('./templates/handlers.rollupID.mustache').toString();

function generateTemplateForType(type, name) {
  switch (type) {
    case "bytes32[]":
    case "bytes32":
    case "boolean":
    case "bool":
    case "string":
      return `event.params.${name}`;
    case "address[]":
      return `mapAddressArray(event.params.${name})`;
    case "address":
      return `toChecksumAddress(event.params.${name})`;
    case "uint256[]":
    case "int256[]":
      return `mapArray(event.params.${name})`;
    case "uint8":
      return `event.params.${name}`;
  }

  return `bigIntToHexString(event.params.${name})`;
}

const buildFile = (contractName, {
  pathPrefix = "",
  rolledupLogs = []
}) => {
  const abi = require(`../abis/${contractName}.json`);
  const result = mustache.render(template, {
    pathPrefix,
    Name: contractName,
    Entities: buildit(abi),
    GenerateIdTemplate: function() {
      return function() {
        const [rolledupLog] = rolledupLogs.filter((item) => item.name === this.name);
        if(typeof rolledupLog === "undefined") {
          return mustache.render(
            baseIDtemplate, {
              name: this.name
            }
          )
        } else {
          const inputs = this.inputs.filter((item) =>
            rolledupLog.primaryKey.includes(item.name));


          return mustache.render(
            rollupIDtemplate, {
              name: this.name,
              inputs,
              GetTemplateForType: function() {
                return function() {
                  return generateTemplateForType(this.type, this.name);
                }
              },
              GenerateIdStringTemplate: function() {
                return function() {
                  return rolledupLog.primaryKey.join(` + "-" + `);
                }
              }
            }
          )
        }
      }
    },
    GetTemplateForType: function() {
      return function() {
        return generateTemplateForType(this.type, this.name);
      }
    }
  });

  fs.writeFileSync(`./src/${contractName}.ts`, result);
}

buildFile("Augur", {
  rolledupLogs: [
    {
      name: "MarketOIChanged",
      primaryKey: [
        "market"
      ]
    },
    {
      name: "TokenBalanceChanged",
      primaryKey: [
        "owner",
        "token"
      ]
    },
    {
      name: "ShareTokenBalanceChanged",
      primaryKey: [
        "account",
        "market",
        "outcome"
      ]
    }
  ]

});
buildFile("AugurTrading", {
  rolledupLogs: [
    {
      name: "MarketVolumeChanged",
      primaryKey: [
        "market"
      ]
    }
  ]
});
buildFile("ShareToken", {});
