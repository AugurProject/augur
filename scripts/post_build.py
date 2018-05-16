#!/usr/bin/env python3

import os
import hashlib

# set up build dir paths
build_dir = 'out/make'
full_path = os.path.abspath(build_dir)

# travis tag
travis_tag = os.environ['TRAVIS_TAG']

# shasums file based on tag
shasums_file = 'augur-app-' + travis_tag + '-SHASUMS'

# change to build dir
os.chdir(full_path)

# gather sha256 sums of all files in package dir
shasums = ''
for fname in os.listdir(full_path):
    sha = hashlib.sha256(open(fname, 'rb').read()).hexdigest()
    shasums += '{} {}'.format(sha, fname)

# write out sha sums
with open(shasums_file, "a") as shafile:
    shafile.write(shasums)
