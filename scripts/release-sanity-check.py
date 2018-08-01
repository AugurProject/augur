#!/usr/bin/env python

import hashlib
import json
import os
import requests

from pprint import pprint

# headers
try:
    GH_TOKEN = os.environ['GH_TOKEN']
except KeyError:
    print('no github token')
    print(os.environ)
    exit(0)

headers = {"Authorization": "token " + GH_TOKEN}


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



all_release_info = augur_app_all_releases()

file_extensions = ['dmg', 'deb', 'exe', 'snap']
#print(all_release_versions(all_release_info))
#pprint(all_release_info['assets'])
#pprint(assets_for_version(all_release_info, '1.1.0-snapshot'))
assets = assets_for_version(all_release_info, '1.1.0-snapshot')

headers['Accept-Encoding'] = 'gzip, deflate, br'
headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
comparison = {}
for asset in assets:
    for x in file_extensions:
        if asset['name'].endswith(x):
            if x not in comparison:
                comparison[x] = {}
            url = asset['browser_download_url']
            print(url)
            r = requests.get(url, headers=headers, stream=True)
            pprint(r.headers)
            r.raise_for_status()


            #response = requests.get('http://www.example.com/image.jpg', stream=True)
# Throw an error for bad status codes
            #response.raise_for_status()
#            with open('output.jpg', 'wb') as handle:
#                for block in response.iter_content(1024):
#                    handle.write(block)


            print(r.headers)
            comparison[x]['sha'] = sha = hashlib.sha256(r.content).hexdigest()
#            print('==asset=={}'.format(x))
#            print(asset['name'])
        if asset['name'].endswith('{}.sha256'.format(x)):
            if x not in comparison:
                comparison[x] = {}
            comparison[x]['shasum'] = ''

    #if any(asset['name'].endswith(x) for x in file_extensions):


pprint(comparison)
