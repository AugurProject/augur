# augur | IPFS Production Deploy

---

## Note

Augur **_does not_** serve **_any_** of the files required to run the client, but rather hashes the build and updates the signature to point to the latest build hash.  

It's up to third parties to pin the corresponding build files to their IPFS daemon or for the end user to build/serve/run the client themselves as they see fit.

If you are a party interested in pinning augur's production builds, please reference our IPFS pinning instructions [here](./third-party-ipfs-pinning-instructions.md).

---

## Prerequisites

* IPFS installed locally
 * Installation guide: https://ipfs.io/docs/install/
   * Recommend installation via `ipfs-update` (makes subsequent upgrades easier)
* Access to the IPFS signing key

---

## Setup
**NOTE** -- These steps only need to be performed once

### IPFS Initialization

    ipfs init

### Keypair Placement

This will depend on your environment, but consistently within the ipfs configuration directory, you'll find the `keystore` directory.  

Copy the keystore file into this directory.  

The name used for the `--key` flag during the publish step corresponds to the name of the file.

Confirm that the key is placed properly by running

    ipfs key list

---

## Deployment

**NOTE** -- deployment instructions assume you've already built the latest client locally

Start the IPFS Daemon

    ipfs daemon

Confirm the existence of peers

    ipfs swarm peers


Generate the Build's Hash

    ipfs add -r <path/to/build/directory>

* Note the final hash value, you'll use this in the next step

Update Signed Pointer

    ipfs name publish --key=<key name> <build hash>

* This will update the IPNS pointer to the new build hash + broadcast this to peers
