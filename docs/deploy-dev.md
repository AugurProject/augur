Augur | dev deployment

___
## Summary

Unlike production, Augur client is hosted for development. There are two domains available, dev.augur.net and ipfs-dev.augur.net. These sites are hosted from a docker container, built from the dockerfile in augur repository. 

___

## Dockerfile

The dockerfile in augur repository hosts augur client in two ways; port 80 hosts the build directory via nginx and port 8001 is a pass through to the IPFS gateway.

___

## Docker cloud

When augur dev branch is updated docker cloud gets kicked off and redeploys two docker containers. One container for dev.augur.net and one for ipfs-dev.augur.net.

## IPFS

ipfs-dev.augur.net can be tested by going to IPNS hash

    https://ipfs-dev.augur.net/ipns/QmQBVeHLXPB7ifmCWZUw9PDktUoTEJfQLpR3bSVUgZgLR8/index.html

This uses https://ipfs-dev.augur.net as an IPFS gateway to resolve to the build directory hash which changes per build. The ipns hash doesn't not change from build to build. 


### Updating IPNS using Key

In the docker container IPNS hash is updated to point to the latest build directory hash. This is done for dev and production, using different keys. A base64 version of the key is passed into docker run via environment variable.

The key is copied to ~/.ipfs/keystore location then this command is run 

  ipfs name publish --key=<key name> <new build hash>


This will re-point the IPNS hash to the new build directory hash. The dnslink doesn't need to change, that is the awesomeness of IPNS.

---
