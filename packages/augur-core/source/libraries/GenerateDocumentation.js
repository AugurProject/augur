var fs = require("fs");
var path = require("path");
var _ = require("lodash");

function extractDocsPerDirectory(solcOutput, relativeTo = '') {
  const contractsPerFile = getContractsPerFile(solcOutput);
  const contractsPerDirectory = groupByDirectory(contractsPerFile, relativeTo);

  return _.mapValues(contractsPerDirectory, function (contracts) {
    const pairs = contracts.map(function (contract) {
      const docs = extractDocs(contract);
      return [docs.name, docs];
    });

    return _.fromPairs(pairs);
  });
}

function getContractsPerFile(solcOutput) {
  const contractsByAstNodeId = {};

  return _.mapValues(solcOutput.contracts, function (contracts, file) {
    return _.map(contracts, function (contract, name) {
      const { ast } = solcOutput.sources[file];

      const astNode = _(ast.nodes)
        .filter(['nodeType', 'ContractDefinition'])
        .find(['name', name]);

      return contractsByAstNodeId[astNode.id] = {
        astNode,
        name,
        get baseContracts() {
          return astNode.linearizedBaseContracts.slice(1).map(c =>
            contractsByAstNodeId[c]
          );
        },
        ...contract,
      };
    });
  });
}

function groupByDirectory(contractsPerFile, relativeTo = '') {
  const groupedContracts = {};

  for (const file of Object.keys(contractsPerFile)) {
    const dir = path.relative(relativeTo, path.dirname(file));

    if (!groupedContracts[dir]) {
      groupedContracts[dir] = [];
    }

    groupedContracts[dir].push(...contractsPerFile[file]);
  }

  return groupedContracts;
}

function getEvents(contract) {
  const ownEvents = getOwnEvents(contract);
  const inheritedEvents = getInheritedEvents(contract);
  return _.uniqBy(ownEvents.concat(inheritedEvents), 'signature');
}

function getOwnEvents(contract) {
  return _(contract.astNode.nodes)
    .filter(['nodeType', 'EventDefinition'])
    .map(function (astNode) {
      const { name, parameters: { parameters } } = astNode;
      const argTypes = _(parameters).map('typeDescriptions.typeString').join(',');

      const actualName = name;
      const signature = `${actualName}(${argTypes})`;

      const devdoc = parseDocumentation(astNode.documentation);

      const args = _(parameters).map(function (param) {
        if (param.name) {
          return `${param.typeDescriptions.typeString} ${param.name}`;
        } else {
          return param.typeDescriptions.typeString;
        }
      }).join(', ');

      const signatureWithNames = `${actualName}(${args})`;

      return {
        astNode,
        name,
        signature,
        signatureWithNames,
        devdoc,
      };
    })
    .value();
}

function getInheritedEvents(contract) {
  return _(contract.baseContracts)
    .map(function (baseContract) {
      return getOwnEvents(baseContract).map(function (fn) {
        return {
          inherited: true,
          get definedIn() {
            return baseContract.docs;
          },
          ...fn,
        };
      })
    })
    .flatten()
    .uniqBy('signature')
    .value();
}

function getOwnFunctions(contract) {
  return _(contract.astNode.nodes)
    .filter(['nodeType', 'FunctionDefinition'])
    .reject(['visibility', 'private'])
    .map(function (astNode) {
      const { name, visibility, kind } = astNode;

      const parameters = astNode.parameters.parameters;
      const returnParameters = astNode.returnParameters.parameters;

      const argTypes = _(parameters).map('typeDescriptions.typeString').join(',');
      const returnType = returnParameters.length == 0
        ? undefined
        : _(returnParameters).map('typeDescriptions.typeString').join(',');

      const isRegularFunction = kind === 'function';
      const actualName = isRegularFunction ? name : kind;
      const signature = `${actualName}(${argTypes})`;

      const devdoc = parseDocumentation(astNode.documentation);

      const args = _(parameters).map(function (param) {
        if (param.name) {
          return `${param.typeDescriptions.typeString} ${param.name}`;
        } else {
          return param.typeDescriptions.typeString;
        }
      }).join(', ');

      const signatureWithNames = `${actualName}(${args})`;

      return {
        astNode,
        visibility,
        name,
        signature,
        signatureWithNames,
        returnType,
        devdoc,
      };
    })
    .value();
}

function getInheritedFunctions(contract) {
  return _(contract.baseContracts)
    .map(function (baseContract) {
      return getOwnFunctions(baseContract).map(function (fn) {
        return {
          inherited: true,
          get definedIn() {
            return baseContract.docs;
          },
          ...fn,
        };
      })
    })
    .flatten()
    .uniqBy('signature')
    .value();
}

function getFunctions(contract) {
  const ownFunctions = getOwnFunctions(contract);
  const inheritedFunctions = getInheritedFunctions(contract);
  return _.uniqBy(ownFunctions.concat(inheritedFunctions), 'signature');
}

function parseDocumentation(documentation) {
  documentation = documentation || '';

  // compensates for a bug in solidity where double newlines are wrongly parsed
  documentation = documentation.replace(/\s+\*\s+/g, '\n\n');

  // extracts the first @dev NatSpec tag
  const matches = documentation.match(/^@dev\s+((?:(?!^@\w+).)*)/ms);
  documentation = matches ? matches[1] : '';

  return documentation;
}

function extractDocs(contract) {
  const { name } = contract;

  const functions = getFunctions(contract);
  const events = getEvents(contract);

  const devdoc = parseDocumentation(contract.astNode.documentation);

  return contract.docs = {
    name,
    devdoc,
    functions,
    events,
  };
}

(async function() {
  fs.readFile(__dirname + "/../../output/contracts/contracts_full.json", "utf8", function(err, data) {
    console.log(err);
    var solcOutput = JSON.parse(data);

    console.log(process.argv);
    console.log(extractDocsPerDirectory(solcOutput));
  });
})();