# augur | IPFS Build Pinning

## Prerequisites
* Git -- https://git-scm.com/downloads
* Node -- https://nodejs.org/en/download/
* IPFS -- https://ipfs.io/docs/install/
 * Recommend installation via `ipfs-update` (makes subsequent upgrades easier)

## Repository Procurement

    git clone https://github.com/AugurProject/augur.git

## Building Client

    cd <augur repository>
    npm i
    npm run build

This will result in the `build` directory being create.  You'll ultimately point IPFS at this directory.

## Pin Build

Before you add the files to IPFS, confirm that you have the current version pointed to by the IP_NS_ hash value.

You can find this value on the landing page of [augur.net](augur.net)

    ipfs name resolve <ipns hash>

Note this value, as you'll use it to compare against the result of the following command.

    cd <augur repository>
    ipfs add -r -n build/

Compare the final hash value of the directory against the value returned from the name resolution.  If they match, then go ahead and pin the files to your IPFS daemon.

    ipfs add -r build/

**DONE**
