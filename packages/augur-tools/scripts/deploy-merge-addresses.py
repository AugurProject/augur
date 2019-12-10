#!/usr/bin/env python3

import json
import os
from pathlib import Path, PurePath

# packages/augur-artifacts/src/addresses.json
# packages/augur-artifacts/src/local-addresses.json

basepath = PurePath(os.path.split(os.path.realpath(__file__))[0]).parent

addressfile = basepath.joinpath('..', 'augur-artifacts', 'src', 'addresses.json')
localaddressfile = basepath.joinpath('..', 'augur-artifacts', 'src', 'local-addresses.json')
uploadblockfile = basepath.joinpath('..', 'augur-artifacts', 'src', 'upload-block-numbers.json')
localuploadblockfile = basepath.joinpath('..', 'augur-artifacts', 'src', 'local-upload-block-numbers.json')

with open(addressfile, 'r') as f:
    addresses = json.load(f)

with open(localaddressfile, 'r') as f:
    localaddress = json.load(f)

with open(uploadblockfile, 'r') as f:
    uploadblocks = json.load(f)

with open(localuploadblockfile, 'r') as f:
    localuploadblocks = json.load(f)

for network in localaddress:
    if network in addresses:
        print('Old addresses')
        print(addresses[network])
        print('New addresses')
        print(localaddress[network])
        print('New upload blocks')
        print(localuploadblocks[network])
        addresses[network] = localaddress[network]
        uploadblocks[network] = localuploadblocks[network]

with open(addressfile, 'w', encoding='utf-8') as f:
    json.dump(addresses, f, ensure_ascii=False, indent=1)

with open(uploadblockfile, 'w', encoding='utf-8') as f:
    json.dump(uploadblocks, f, ensure_ascii=False, indent=2)
