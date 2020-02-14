#!/usr/bin/env python3

import json
import os
from pathlib import Path, PurePath

# packages/augur-artifacts/src/environments.json

basepath = PurePath(os.path.split(os.path.realpath(__file__))[0]).parent

environmentsfile = basepath.joinpath('..', 'augur-artifacts', 'src', 'environments.json')
localenvironmentsfile = basepath.joinpath('..', 'augur-artifacts', 'src', 'local-environments.json')

with open(environmentsfile, 'r') as f:
    environments = json.load(f)

with open(localenvironmentsfile, 'r') as f:
    localenvironments = json.load(f)

for network in localenvironments:
    if network in environments:
        print('Old environment config')
        print(environments[network])
        print('New environment config')
        print(localenvironments[network])
        environments[network] = localenvironments[network]

with open(environmentsfile, 'w', encoding='utf-8') as f:
    json.dump(environments, f, ensure_ascii=False, indent=2)
