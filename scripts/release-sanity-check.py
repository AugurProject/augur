#!/usr/bin/env python3

import getpass
import hashlib
import os
import requests
import signal
import sys

try:
    from github import Github
except ImportError:
    print('missing PyGithub')
    print('pip3 install PyGithub')
    sys.exit(0)


try:
    from cursesmenu import SelectionMenu
except ImportError:
    print('for a better experience install curses-menu')
    print('pip install curses-menu')

#
try:
    GH_TOKEN = os.environ['GH_TOKEN']
except KeyError:
    print('no github token')
    print('https://github.com/settings/tokens')
    sys.exit(0)

try:
    import gnupg
    HAS_GPG = True
except ImportError:
    print('python-gnupg not found')
    print('pip3 install python-gnupg')

# deleteme
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
    return [release['name'] for release in release_info]

def release_for_version(releases, version):
    for release in releases:
        if version in release['name']:
            return release

# return a list of hashes containing all the assets for a
def assets_for_version(releases, version):
    release = release_for_version(releases, version)
    return release['assets'] if release is not None else None

def delete_asset_if_exists(release_info, asset_name):
    asset_url = ""
    for asset in release_info['assets']:
        if asset_name in asset['name']:
            print('found ' + asset_name)
            asset_url = asset['url']
            print(asset_url)
            r = requests.delete(asset_url, headers=headers)

# upload asset
# https://uploads.github.com/repos/AugurProject/augur-app/releases/11907294/assets{?name,label}
def upload_release_asset(id, data, name):
    try:
        h = headers.copy()
        h['Content-Type'] = 'text/plain'
        request = requests.post('https://uploads.github.com/repos/AugurProject/augur-app/releases/%s/assets?name=%s' % (id, name),
                  data=data,
                  headers=h
                  )
        request.raise_for_status()
    except requests.exceptions.HTTPError as err:
        print(err)
        print(request.content)

def gpg_sanity_check():
    pass

# main starts here for
signal.signal(signal.SIGINT, signal_handler)

all_release_info = augur_app_all_releases()
release_versions = all_release_versions(all_release_info)

# promt for
if 'cursesmenu' in sys.modules:
    selection = SelectionMenu.get_selection(release_versions, title='Pick a release to verify')
    if selection < len(release_versions):
        version = release_versions[selection]
    else:
        sys.exit(0)
else:
    print('  '.join(release_versions))
    version = input('enter version to sanity check: ')

file_extensions = ['dmg', 'deb', 'exe', 'AppImage', 'zip']

release = release_for_version(all_release_info, version)
assets = assets_for_version(all_release_info, version)

comparison = {}
for asset in assets:
    for x in file_extensions:
        if asset['name'].endswith(x):
            print(asset['name'])
            if x not in comparison:
                comparison[x] = {}
            url = asset['url']
            try:
                r = requests.get(url, headers=dict(Accept='application/octet-stream', **headers), stream=True)
            except requests.exceptions.RequestException as e:
                print(e)
                break
            r.raise_for_status()
            comparison[x]['sha'] = sha = hashlib.sha256(r.content).hexdigest()
            comparison[x]['file'] = asset['name']
        if asset['name'].endswith('{}.sha256'.format(x)):
            print(asset['name'])
            if x not in comparison:
                comparison[x] = {}
            url = asset['url']
            try:
                r = requests.get(url, headers=dict(Accept='application/octet-stream', **headers))
            except requests.exceptions.RequestException as e:
                print(e)
                break
            r.raise_for_status()
            shasum = r.text.split(' ')[0]
            comparison[x]['shasum'] = shasum

message_to_sign = ''
for file, v in comparison.items():
    sha = str(v['sha'])
    shasum = str(v['shasum'])
    filename = str(v['file'])
    if sha == shasum:
        color = colors.OKGREEN
    else:
        color = colors.RED
    message_to_sign += '{shasum} {filename}\n'.format(shasum=shasum, filename=filename)
    print("{file}:\n\t   sha: {color}{sha}{endcolor}\n\tshasum: {color}{shasum}{endcolor}".format(file=file, sha=sha, shasum=shasum, color=color, endcolor=colors.ENDC))

print('going to sign this: ')
print(message_to_sign)

password = getpass.getpass()
gpg = gnupg.GPG()
signed_data = gpg.sign(message_to_sign, keyid='4ABBBBE0', passphrase=password)
print(str(signed_data))

delete_asset_if_exists(release, 'release-checksums.txt')
upload_release_asset(release['id'], str(signed_data), 'release-checksums.txt')
