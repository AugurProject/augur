#!/bin/bash
set -e
set -x

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    npm install
    npm run make -- --mac
else
    rm -rf node_modules/*
    apt update
    apt install -y libusb-{dev,1.0-0-dev} rpm curl tzdata
    export NVM_DIR="$HOME/.nvm"
    mkdir -p $HOME/.nvm
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install v9.11.2
    nvm use v9.11.2
    npm install
    npm run make -- --linux
fi

