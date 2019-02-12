from os import path
from textwrap import dedent

from solc import compile_standard

from specifics import add_all


# TODO resolve relative source paths from the sources directory, not this directory
# used to resolve relative paths
BASE_PATH = path.dirname(path.abspath(__file__))
def resolve_relative_path(relativeFilePath):
    return path.abspath(path.join(BASE_PATH, relativeFilePath))
COMPILATION_CACHE = resolve_relative_path('./compilation_cache')


class ContractDescription(object):
    def __init__(self, contract_name, solidity_version):
        self.name = contract_name
        self.version = solidity_version
        self.imports = set()
        self.variables = {}
        self.functions = {}
        self.events = set()

    @classmethod
    def from_abi(cls, solidity_version, contract_name, abi):
        self = cls(contract_name, solidity_version)

        for thing in abi:
            # print json.dumps(thing, indent=2, separators=',:')
            type_ = thing['type']
            if type_ == 'constructor':
                inputs = thing['inputs']
                state_mutability = thing['stateMutability']  # TODO can be public or internal
                payable = thing['payable']  # TODO constructor can be payable
                constructor = cls.make_constructor(inputs)
                self.functions[''] = constructor
            elif type_ == 'function':
                name = thing['name']
                inputs = thing['inputs']
                outputs = thing['outputs']
                state_mutability = thing['stateMutability']
                constant = thing['constant']  # TODO how does this relate to stateMutability?
                payable = thing['payable']  # TODO how does this relate to stateMutability?
                new_variables, new_functions = cls.make_function(name, inputs, outputs, state_mutability)
                self.variables.update(new_variables)
                self.functions.update(new_functions)
            elif type_ == 'event':
                name = thing['name']
                inputs = thing['inputs']
                anonymous = thing['anonymous']  # TODO is this useful when we know 'name'?
                event = cls.make_event(name, inputs)
                self.events.add(event)

            else:
                raise ValueError('Unexpected abi type "{}" in: {}'.format(type_, abi))

        return self

    @staticmethod
    def make_version(version):
        return 'pragma solidity {};'.format(version)

    @staticmethod
    def make_event(name, inputs):
        params = ', '.join('{} {}'.format(i['type'], i['name']) for i in inputs)
        return "event {name}({params});".format(name=name, params=params)

    @staticmethod
    def make_constructor(inputs):
        params = ', '.join('{} {}'.format(i['type'], i['name']) for i in inputs)
        return "constructor({params}) public {{ }}".format(
            params=params
        )

    @staticmethod
    def make_function(function_name, inputs, outputs, state_mutability):
        var_descriptions = [
            {'name': 'mock_{}_{}_{}'.format(
                function_name,
                o['name'] or index,
                '_'.join([t['type'] for t in inputs]).replace('[', '_').replace(']', '_')
            ),
                'type': o['type']}
            for index, o in enumerate(outputs)
        ]

        functions = {}

        params = ', '.join('{} {}'.format(i['type'], i['name']) for i in inputs)
        returns_header = ', '.join('{} {}'.format(o['type'], o['name']) for o in outputs)
        returns = ','.join(v['name'] for v in var_descriptions)
        mutability = "" if state_mutability == "nonpayable" else state_mutability
        mutability = "" if mutability == "pure" else mutability  # TODO handle pure fns
        functions[function_name] = (dedent("""\
            function {name}({params}) public {mutability} returns ({returns_header}) {{
                return ({returns});
            }}
        """.format(
            name=function_name,
            params=params,
            mutability=mutability,
            returns_header=returns_header,
            returns=returns
        )))

        variables = {}
        for v in var_descriptions:
            functions[v['name']] = dedent("""\
                function set_{name}({vartype} thing) public {{
                    {name} = thing;
                }}
            """.format(
                name=v['name'],
                vartype=v['type']
            ))
            variables[v['name']] = '{vartype} private {name};'.format(name=v['name'], vartype=v['type'])

        return variables, functions

    def write(self, test_dir):
        with open('{}/{}.sol'.format(test_dir, self.name), 'w') as f:
            f.write(self.render())

    def render(self):
        source = self.make_version(self.version)
        source += '\n\n'
        source += '\n'.join("import '{}';".format(imp) for imp in self.imports)
        source += '\n'
        source += "contract {name} {{\n".format(name=self.name)
        source += '\n'
        source += '\n'.join(self.events)
        source += '\n'
        source += '\n'.join(self.variables.values())
        source += '\n\n'
        source += '\n'.join(self.functions.values())
        source += '}'
        return source


def generate_mock_contracts(solidity_version, contracts):
    return add_all({
        'Mock{}'.format(name): ContractDescription.from_abi(solidity_version, 'Mock{}'.format(name), abi)
        for name, abi
        in contracts.items()
        if len(abi) != 0
    })


def compile_contract(source_filepath, outputs, contracts_path, test_contracts_path):
    compiler_parameter = {
        'language': 'Solidity',
        'sources': {
            source_filepath: {
                'urls': [source_filepath]
            }
        },
        'settings': {
            # TODO: Remove 'remappings' line below and update 'sources' line above
            'remappings': [
                '=%s/' % contracts_path,
            ],
            'optimizer': {
                'enabled': True,
                'runs': 200
            },
            'outputSelection': {
                "*": {
                    '*': outputs
                }
            }
        }
    }
    if test_contracts_path:
        # TODO: Remove 'remappings' line below and update 'sources' line above
        compiler_parameter['settings']['remappings'].append(
            'TEST=%s/' % test_contracts_path
        )

    return compile_standard(compiler_parameter, allow_paths=resolve_relative_path("../../"))
