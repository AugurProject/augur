#!/usr/bin/env python3

import argparse
import getpass
import hashlib
import os
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
    print('args')
    parser = argparse.ArgumentParser(
        description='augur-app release tool')
    parser.set_defaults(sign=True)
    sign = parser.add_mutually_exclusive_group()
    sign.add_argument('--sign',
                      dest='sign',
                      action='store_true',
                      help='sign releases')
    sign.add_argument('--no-sign',
                      dest='sign',
                      action='store_false',
                      help='don\'t sign releases')
    args = parser.parse_args()
    print(args)
    print(args.sign)


def return_release_array(repo):
    release_array = []
    for release in repo.get_releases():
        release_array.append(release.title)
    return release_array


def pick_release(releases):
    if 'cursesmenu' in sys.modules:
        selection = SelectionMenu.get_selection(releases, title='Pick a release to verify')
        if selection < len(releases):
            version = releases[selection]
        else:
            sys.exit(0)
    else:
        print('  '.join(releases))
        version = input('enter version to sanity check: ')
    return version


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)
    args()
    g = Github(GH_TOKEN)
    repo = g.get_repo("augurproject/augur-app")
    version = pick_release(return_release_array(repo))
