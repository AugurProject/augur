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


def get_github_release_info():
    request = requests.get('https://api.github.com/repos/AugurProject/augur-app/releases', headers=headers)
    if request.status_code == 200:
        return request.json()


def get_current_version():
    data = {}
    with open('package.json') as json_file:
        data = json.load(json_file)
    return data['version']


def get_version_release_info(result, version):
    for project in result:
        if version in project['tag_name']:
            return project


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
        headers['Content-Type'] = 'application/octet-stream, multipart/form-data'
        request = requests.post('https://uploads.github.com/repos/AugurProject/augur-app/releases/%s/assets?name=%s' % (id, name),
                  data=data,
                  headers=headers
                  )
        request.raise_for_status()
        pprint(request.headers)
    except requests.exceptions.HTTPError as err:
        print(err)


current_version = get_current_version()
result = get_github_release_info()
release_info = get_version_release_info(result, current_version)
release_id = ''

# set up build dir paths
build_dir = 'dist/'
full_path = os.path.abspath(build_dir)
file_extensions = ['dmg', 'deb', 'exe', 'AppImage', 'zip']

# change to build dir
os.chdir(full_path)

# gather sha256 sums of all files in package dir
shasums = ''
for fname in os.listdir(full_path):
    if any(fname.endswith(x) for x in file_extensions):
        print(fname)
        sha = hashlib.sha256(open(fname, 'rb').read()).hexdigest()
        shasums_file = fname + '.sha256'
        with open(shasums_file, "w") as shafile:
            shasums = '{} {}'.format(sha, fname)
            print(shasums)
            shafile.write(shasums)
        if release_info:
            release_id = release_info['id']
            delete_asset_if_exists(release_info, shasums_file)
        upload_release_asset(release_id, shasums, shasums_file)


