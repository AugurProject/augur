# Augur | Non-Linking Local Node Configuration

This is for developers already familiar with the code repositories and want to run everything local without linking to augur.js.  This is the easist and fastest way to spin up augur client using local augur-node on populated docker image.

## Requirements

You'll need to clone the following repositories prior to starting:

* [augur-node](https://github.com/AugurProject/augur-node)
* [augur](https://github.com/AugurProject/augur)
* node and npm installed
* yarn installed

## Running Ethereum Local Node

The populated docker image, already has contracts deployed with canned data. It's version is determined by the augur-core version being referenced by augur.js. Since this is the non-linking version we are relying on augur-node and augur ui referencing the same version of augur.js. To confirm this look in package.json for each project. 

Make sure this command's result is the same version in augur-node and augur UI. 

    npm explore augur.js -- npm run core:version

### augur-node

Here are the commands to get docker running and augur-node connected. 

    cd augur-node
    npm install
    
    # start populated docker image in the background
    npm explore augur.js -- npm run docker:geth:pop

    # sanity check
    npm explore augur.js -- npm run core:version

    # quick commmand to clean augur-node env and build and start
    npm run clean-start

### augur (ui)

Link augur.js:

    cd augur
    npm install

    # sanity check
    npm explore augur.js -- npm run core:version

    #Start the augur development server:
    yarn dev

for more details on flash, disco parrot or meta mask go [Here](./dev-local-node.md)

## Summary

This was meant to be a super short highlights to get developers rolling
