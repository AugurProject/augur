#!/usr/bin/env python

import hashlib
import json
import os
import requests

# headers
GH_TOKEN = os.environ['GH_TOKEN']
headers = {"Authorization": "token " + GH_TOKEN}

# get tag
#if os.environ['TRAVIS_TAG']:
#    RELEASE_TAG = os.environ['TRAVIS_TAG']
#if os.environ['APPVEYOR_REPO_TAG_NAME']:
#    RELEASE_TAG = os.environ['APPVEYOR_REPO_TAG_NAME']
RELEASE_TAG = '1.0.3'

# set up build dir paths
build_dir = 'dist/'
full_path = os.path.abspath(build_dir)
file_extensions = ['dmg', 'deb', 'exe']


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
        #print(project)
        print(project['tag_name'])
        if version in project['tag_name']:
            return project


current_version = get_current_version()
print(current_version)


result = get_github_release_info()
release_info = get_version_release_info(result, current_version)
print(release_info)

exit(0)


exit(0)
# change to build dir
os.chdir(full_path)

# gather sha256 sums of all files in package dir
shasums = ''
for fname in os.listdir(full_path):
    if any(x in fname for x in file_extensions):
        print(fname)
        sha = hashlib.sha256(open(fname, 'rb').read()).hexdigest()
        shasums_file = fname + '.sha256'
        with open(shasums_file, "w") as shafile:
            shasums = '{} {}'.format(sha, fname)
            shafile.write(shasums)


