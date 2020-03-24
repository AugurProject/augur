# Deploy using flash

## Kovan with key in a file
yarn flash -n kovan --keyfile /absolue/path/to/keyfile deploy

## Kovan with private key in the `PRIVATE_KEY` env var
yarn flash -n kovan --key $PRIVATE_KEY /absolue/path/to/keyfile deploy

