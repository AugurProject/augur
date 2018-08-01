#!/usr/bin/env python3

import hashlib
import os
import requests
import signal
import sys

try:
    from cursesmenu import SelectionMenu
except ImportError:
    print('for a better experience install curses-menu')
    print('pip install curses-menu')

# headers
try:
    GH_TOKEN = os.environ['GH_TOKEN']
except KeyError:
    print('no github token')
    print('https://github.com/settings/tokens')
    sys.exit(0)

headers = {"Authorization": "token " + GH_TOKEN}


class colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    RED = '\033[31m'


def signal_handler(sig, frame):
    print('\nsee ya.')
    sys.exit(0)


def augur_app_all_releases():
    request = requests.get('https://api.github.com/repos/AugurProject/augur-app/releases', headers=headers)
    if request.status_code == 200:
        return request.json()


def all_release_versions(release_info):
    all_versions = []
    for release in all_release_info:
        all_versions.append(release['name'])
    return all_versions


# return a list of hashes containing all the assets for a version
def assets_for_version(releases, version):
    for release in releases:
        if version in release['name']:
            return release['assets']


# main starts here for now
signal.signal(signal.SIGINT, signal_handler)

all_release_info = augur_app_all_releases()
release_versions = all_release_versions(all_release_info)

# promt for version
if 'cursesmenu' in sys.modules:
    selection = SelectionMenu.get_selection(release_versions)
    if selection < len(release_versions):
        version = release_versions[selection]
    else:
        sys.exit(0)
else:
    print('  '.join(release_versions))
    version = input('enter version to sanity check')

file_extensions = ['dmg', 'deb', 'exe', 'snap']
assets = assets_for_version(all_release_info, '1.1.0-snapshot')

headers['Accept'] = 'application/octet-stream'

comparison = {}
for asset in assets:
    for x in file_extensions:
        if asset['name'].endswith(x):
            print(asset['name'])
            if x not in comparison:
                comparison[x] = {}
            url = asset['url']
            r = requests.get(url, headers=headers, stream=True)
            r.raise_for_status()
            comparison[x]['sha'] = sha = hashlib.sha256(r.content).hexdigest()
        if asset['name'].endswith('{}.sha256'.format(x)):
            print(asset['name'])
            if x not in comparison:
                comparison[x] = {}
            url = asset['url']
            r = requests.get(url, headers=headers)
            r.raise_for_status()
            shasum = r.text.split(' ')[0]
            comparison[x]['shasum'] = shasum


for file, v in comparison.items():
    sha = v['sha']
    shasum = v['shasum']
    if sha is shasum:
        color = colors.OKGREEN
    else:
        color = colors.RED
    print("{file}:\n\t   sha: {color}{sha}{endcolor}\n\tshasum: {color}{shasum}{endcolor}".format(file=file, sha=sha, shasum=shasum, color=color, endcolor=colors.ENDC))

