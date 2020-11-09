const fs = require('fs');
const mustache = require('mustache');

const augur = require('@augurproject/subgraph/abis/Augur.json');
const augurTrading = require('@augurproject/subgraph/abis/AugurTrading.json');
const paraDeployer = require('@augurproject/subgraph/abis/ParaDeployer.json');
const paraShareToken = require('@augurproject/subgraph/abis/ParaShareToken.json');
const shareToken = require('@augurproject/subgraph/abis/ShareToken.json');


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
const yep = mustache.render(template,{
  Augur: buildit(augur),
  AugurTrading: buildit(augurTrading),
  ShareToken: buildit(shareToken),
  ParaDeployer: buildit(paraDeployer),
  ParaShareToken: buildit(paraShareToken)
});

console.log(yep);
