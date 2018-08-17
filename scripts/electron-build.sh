#!/bin/bash
set -e
set -x

IFS='' cat  <<EOF > build/release-notes.md
## Release Notes
Automatic Build for Commit: $(git rev-parse --verify HEAD)

### Changes since last version
$(git log $(git describe --tags --abbrev=0)..HEAD --oneline | while read l; do echo " - $l"; done)
EOF

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    npm run make-mac
    virtualenv augur-venv
    source augur-venv/bin/activate
    pip install requests

else
    rm -rf node_modules/*
    apt update
    apt install -y libusb-{dev,1.0-0-dev} rpm curl tzdata python-pip
    export NVM_DIR="$HOME/.nvm"
    mkdir -p $HOME/.nvm
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install v9.11.2
    nvm use v9.11.2
    npm install
    npm run make -- --linux
    pip install requests
fi

python scripts/post_build.py
cat dist/*.sha256
