#!/bin/bash

# comment out the commands below since the geth docker image
# already is running
#cd /
#./start.sh &

export NVM_DIR="/usr/local/nvm"
if [[ -d $NVM_DIR ]]; then
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
    nvm use --delete-prefix $NODE_VERSION
fi

which node

echo "Resting for a bit"
sleep 10s

# couldn't get dp deploy to work had to split it up, contract addresses were reloaded
node /augur/packages/augur-tools/scripts/dp upload
node /augur/packages/augur-tools/scripts/dp create-markets

$(kill -TERM $(pidof geth))
