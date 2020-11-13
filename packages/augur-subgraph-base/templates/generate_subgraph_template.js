const fs = require('fs');
const mustache = require('mustache');

const augur = require('../abis/Augur.json');
const augurTrading = require('../abis/AugurTrading.json');
const paraDeployer = require('../abis/ParaDeployer.json');
const paraShareToken = require('../abis/ParaShareToken.json');
const shareToken = require('../abis/ShareToken.json');


function buildit(abi) {
  return abi.filter((item)=> {
    return item.type === "event"
  }).map((item) => {
    const inputs = item.inputs.map((item) => {
      if(item.indexed) {
        return `indexed ${item.type}`;
      } else {
        return item.type;
      }
    }).join(',');

    return {
      name: item.name,
      inputs: `${item.name}(${inputs})`
    }
  });

}


const template = fs.readFileSync('./templates/subgraph.template.mustache').toString();
const result = mustache.render(template,{
  Augur: buildit(augur),
  AugurTrading: buildit(augurTrading),
  ShareToken: buildit(shareToken),
  ParaDeployer: buildit(paraDeployer),
  ParaShareToken: buildit(paraShareToken)
});

fs.writeFileSync(`./subgraph.template.yaml`, result);
