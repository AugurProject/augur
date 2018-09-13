#!/bin/bash
set -e
set -x

#IFS='' cat  <<EOF > build/release-notes.md
### Release Notes
#Automatic Build for Commit: $(git rev-parse --verify HEAD)
#
#### Changes since last version
#$(git log $(git describe --tags --abbrev=0)..HEAD --oneline | while read l; do echo " - $l"; done)
#EOF

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    echo "running 'npm run make-mac'"
    npm run make-mac
    echo "creating virtualenv"
    virtualenv augur-venv
    echo "sourcing virtualenv"
    source augur-venv/bin/activate
    echo "running 'pip install requests'"
    pip3 install requests

else
    rm -rf node_modules/*
    sudo apt-get update
    sudo apt-get install -y libusb-{dev,1.0-0-dev} rpm curl tzdata python-pip
    npm install --quiet
    npm run make-linux
    sudo pip3 install requests
fi

echo "running post_build.py"
echo "travis branch: $TRAVIS_BRANCH"
python3 scripts/post_build.py
cat dist/*.sha256
