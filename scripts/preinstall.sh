#!/bin/bash
set -e
set -x

if [[ $TRAVIS_OS_NAME == 'osx' ]]; then
    brew install yarn --without-node
else
    sudo apt install -y libusb-dev
fi
