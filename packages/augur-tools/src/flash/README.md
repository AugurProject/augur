# Flash Scripts

## Running a local node with canned markets

First, enter interactive mode: `yarn flash interactive`
In interactive mode (It will show `augur$` in the terminl):

    ganache
    deploy
    create-canned-markets-and-orders

The local ganache node is now running in your terminal. You can interact with it using flash commands.
Type `help` for a list.

## FAQ

Pro Tip: Interactive mode has tab-completion so instead of

    create-canned-markets-and-orders

you can type

    cr <TAB> c

# Flash Session on local node

To use flash for a session to push time report or dispute. use interactive mode

## Connect
This connects the session to ethereum node, connect as a specific user and/or start SDK in order to use getters

for options `connect --help`
`-u` to connect the SDK
`-a` to specify an account address to use, if not contract owner account is used.
`-n` for network, don't specify this for local node on port 8545

Some scripts need SDK getters to get MarketInfo for example. The script that need SDK will print a message if the SDK isn't wired up.


## push-timestamp

for options `push-timestamp --help`

## initial-report

Will initial report for a market, it's possible to add pre-emptive stake, check `--help` for details.

## dispute

Will dispute a market that has a tentive winning outcome
