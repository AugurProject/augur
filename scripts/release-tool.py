#!/usr/bin/env python3

import argparse
import getpass
import glob
import hashlib
import os
import requests
import signal
import sys


try:
    from github import Github, GithubException
except ImportError:
    print('missing PyGithub')
    print('pip3 install PyGithub')
    sys.exit(0)

try:
    from cursesmenu import SelectionMenu
except ImportError:
    print('for a better experience install curses-menu')
    print('pip install curses-menu')

try:
    GH_TOKEN = os.environ['GH_TOKEN']
except KeyError:
    print('no github token')
    print('export GH_TOKEN=<TOKEN>')
    print('https://github.com/settings/tokens')
    sys.exit(0)

try:
    import gnupg
    HAS_GPG = True
except ImportError:
    print('python-gnupg not found')
    print('pip3 install python-gnupg')


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


def args():
    parser = argparse.ArgumentParser(
        description='augur-app release tool')
    parser.set_defaults(sign=True)
    parser.add_argument('-r', '--release',
                        dest='release',
                        help='release to sign/verify')
    sign = parser.add_mutually_exclusive_group()
    sign.add_argument('--sign',
                      dest='sign',
                      action='store_true',
                      default=True,
                      help='sign releases')
    sign.add_argument('--no-sign',
                      dest='sign',
                      action='store_false',
                      help='don\'t sign releases')
    args = parser.parse_args()
    return args


def return_release_array(repo):
    release_array = []
    for release in repo.get_releases():
        release_array.append(release.tag_name)
        print(release.tag_name)
    return release_array


def return_release_ids(repo):
    release_ids = {}
    for release in repo.get_releases():
        id = release.id
        tag = release.tag_name
        release_ids[tag] = id
    return release_ids


def pick_release(all_versions):
    releases = list(all_versions.keys())
    if 'cursesmenu' in sys.modules:
        selection = SelectionMenu.get_selection(releases, title='Pick a release to verify')
        if selection < len(releases):
            version = releases[selection]
        else:
            sys.exit(0)
    else:
        print('  '.join(releases))
        version = input('enter version to sanity check: ')
    return all_versions[version]


def tmp_local_dir(name):
    directory = '/tmp/augur-app-{name}'.format(name=name)
    if not os.path.exists(directory):
        os.makedirs(directory)
    return directory


def download_asset(asset_name, asset_url, directory):
    local_filename = directory + '/' + asset_name
    print(local_filename)
    r = requests.get(asset_url,
                     stream=True,
                     headers=dict(Accept='application/octet-stream',
                                  **HEADERS)
                     )
    with open(local_filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)
                f.flush()

def get_release_asset_obj(release, asset_name):
    for asset in release.get_assets():
        if asset.name == asset_name:
            return asset

def compare_checksums_in_dir(dir):
    comparison = {}
    for file in glob.iglob(os.path.join(dir, '*')):
        print(file)
        for x in FILE_EXTENSIONS:
            if file.endswith(x):
                if x not in comparison:
                    comparison[x] = {}
                sha256 = hashlib.sha256()
                with open(file, 'rb') as f:
                    while True:
                        buf = f.read(2**20)
                        if not buf:
                            break
                        sha256.update(buf)
                comparison[x]['sha'] = sha256.hexdigest()
                comparison[x]['file'] = file.split('/')[-1]
            if file.endswith('{}.sha256'.format(x)):
                if x not in comparison:
                    comparison[x] = {}
                shasumfile = open(file, 'r')
                comparison[x]['shasum'] = shasumfile.read().split(' ')[0]
                shasumfile.close()
    return comparison

def visual_checksum_comparison(comparison):
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
    return message_to_sign

def gpg_sign_checksums(message_to_sign):
        password = getpass.getpass()
        gpg = gnupg.GPG()
        signed_data = gpg.sign(message_to_sign, keyid=KEYID, passphrase=password)
        return str(signed_data)


def upload_release_checksum(signed_checksum, tag_name):
        release_checksum_name = 'release-checksum-{}.txt'.format(tag_name)
        release_checksum_path = os.path.join(directory, release_checksum_name)
        release_checksum = open(release_checksum_path, 'w')
        release_checksum.write(str(signed_checksum))
        release_checksum.close()
        try:
            release_checksum_asset_obj = get_release_asset_obj(release, release_checksum_name)
            release_checksum_asset_obj.delete_asset()
        finally:
            release.upload_asset(release_checksum_path, label=release_checksum_name)


def release_message_table(assets, comparison):
    message_table = {
            'Windows': {
                'ext': 'exe',
                'url': '',
                'sha': ''
                },
            'Mac': {
                'ext': 'dmg',
                'url': '',
                'sha': ''
                },
            'Linux (deb)': {
                'ext': 'deb',
                'url': '',
                'sha': ''
                },
            'Linux (AppImage)': {
                'ext': 'AppImage',
                'url': '',
                'sha': ''
                }
            }
    for platform in message_table.keys():
        for asset in assets:
            ext = message_table[platform]['ext']
            if ext in asset.name:
                message_table[platform]['url'] = asset.url
                message_table[platform]['sha'] = comparison[ext]['sha']
    return message_table



HEADERS = {"Authorization": "token " + GH_TOKEN}
PLATFORMS = ['Windows', 'Mac', 'Linux (.deb)', 'Linux (AppImage)']
FILE_EXTENSIONS = ['dmg', 'deb', 'exe', 'AppImage', 'zip']
KEYID = '4ABBBBE0'


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    args = args()
    g = Github(GH_TOKEN)
    repo = g.get_repo("augurproject/augur-app")
    all_versions = return_release_ids(repo)
    release_id = pick_release(all_versions)
    tag_name = repo.get_release(release_id).tag_name
    directory = tmp_local_dir(tag_name)
    release = repo.get_release(release_id)
    github_release_assets = release.get_assets()
    if not os.path.exists(directory):
        for assets in github_release_assets:
            download_asset(assets.name, assets.url, directory)
    comparison = compare_checksums_in_dir(directory)
    message_to_sign = visual_checksum_comparison(comparison)
    if args.sign:
        signed_message = gpg_sign_checksums(message_to_sign)
        print(signed_message)
        print('uploading to github releases')
        upload_release_checksum(signed_message, tag_name)
    message_table = release_message_table(github_release_assets, comparison)
    print(message_table)
