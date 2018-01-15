Augur | dev deployment

___
## Summary

Unlike production, Augur client is hosted for development. There are two domains available, dev.augur.net and ipfs-dev.augur.net. These sites are hosted from docker container from the dockerfile in augur repository. 

___

## Dockerfile

The dockerfile in augur repository hosts augur client in two ways; port 8001 hosts the build directory via nginx and port 80 is a pass through to the ipfs gateway internal port 8080.

___

## Docker cloud

When augur dev branch is updated docker cloud gets kicked off and redeploys two docker containers. dev.augur.net routes port 8001 and ipfs-dev.augur.net routes to port 80.

## ipfs 

ipfs-dev.augur.net can be tested by going to ipns hash

    https://ipfs-dev.augur.net/ipns/QmQBVeHLXPB7ifmCWZUw9PDktUoTEJfQLpR3bSVUgZgLR8/index.html

DNS will be updated to shortcut the ipns url 

    dnslink=/ipns/QmQBVeHLXPB7ifmCWZUw9PDktUoTEJfQLpR3bSVUgZgLR8

This will allow for https://ipfs-dev.augur.net to resolve like any other domain but ipfs is hosting Augur client on the back-end.


### Updating ipns using Key

In the docker container ipns hash is updated to point to the latest build directory hash. This is done for dev and production, using different keys. A base64 version of the key is passed into docker run via environment variable.

The key is copied to ~/.ipfs/keystore location then this command is run 

  ipfs name  publid --key=<key name> <new build hash>


This will re-point the ipns hash to the new build directory hash. The dnslink doesn't need to change, that is the awesomeness of ipns.

---
