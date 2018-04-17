# Augur | Manual IPFS Configuration

Audience: For those community members that are already familiar with ipfs and want to manually pin files.

## Prerequisites
* Git -- https://git-scm.com/downloads
* Node -- https://nodejs.org/en/download/
* IPFS -- https://ipfs.io/docs/install/
 * Recommend installation via `ipfs-update` (makes subsequent upgrades easier)

## Repository Procurement

    git clone https://github.com/AugurProject/augur.git

## Building Augur Client

    cd <augur repository>
    npm i
    npm run build

## Setup for ipfs and pinning

### IPFS Initialization (only run once)

    ipfs init
    
Start the IPFS Daemon, ('&' indicates, run in background)

    ipfs daemon & 

Confirm the existence of peers, just for good measure

    ipfs swarm peers


## Pinning

Verify the `build` directory was created as a result of running the above npm run build command.  

## Pin Build

Make sure to note the build directory hash, you'll use it to publish.

    cd <augur repository>
    ipfs add -r -n build/

* Note the final hash value, you'll use this in the next step

Signal to the ipfs swarm that you have Augur build directory

    ipfs name publish <build hash>

## Note -- 

ipfs name publish command has a default time-to-live of 24 hours, this command needs to be run every 24 hours so swarm knows your still available. There are many ways to run this command based on your os, simple one is a cron job. 

**DONE**
