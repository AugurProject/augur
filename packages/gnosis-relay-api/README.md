# Gnosis Relay API

Gnosis Relay API

## How To Test

### Rinkeby

To test against Rinkeby, switch the commented-out portion at the top of `GnosisRelayAPI.test.ts`.
You'll be editing these constants: `RELAY_API`, `SAFE_FUNDER_PRIVATE_KEY`, `SAFE_FUNDER_PUBLIC_KEY`, `URL`.

Then run the test: `yarn test`.

### Local

Testing against local requires first setting up the local Relay.
Note that it also requires Docker and Docker-Compose.

Clone the repo: `git clone git@github.com:gnosis/safe-relay-service.git`.
Then enter the repo's directory: `cd safe-relay-service`.

Edit `requirements.txt`, adding these two lines:

    django-debug-toolbar
    django-debug-toolbar-force

Build the Relay's docker ecosystem: `docker-compose build`.

Then run the ecosystem: `docker-compose up`.

Now run the test: `yarn test`.

#### Tips

* To be certain of a clean state _between_ runs, run `docker-compose down` before `docker-compose up`.
