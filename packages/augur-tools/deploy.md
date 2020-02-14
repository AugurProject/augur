# contract deploy to kovan
git checkout -b kovan-deploy-YYY-MM-DD
source ~/bin/kovan_deploy_env.sh
yarn && yarn build
yarn workspace @augurproject/core build #optional, contracts should be checked in compiled
yarn flash run deploy --write-artifacts
# cp local-environments.json
yarn workspace @augurproject/tools deploy:merge
git status
# commit changes and push PR
# rebuild addresses file
yarn build
yarn workspace @augurproject/tools flash run create-canned-markets

# update safe relay services in aws with GnosisSafe and ProxyFactory addresses
# fund the relayer account
# PG: I believe this happens now as part of create-canned-markets
yarn flash run faucet -a 100000 -t 0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6
