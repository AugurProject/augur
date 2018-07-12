#!/usr/bin/env python

import os
import hashlib

# set up build dir paths
build_dir = 'dist/'
full_path = os.path.abspath(build_dir)
file_extensions = ['dmg', 'deb', 'exe']

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
