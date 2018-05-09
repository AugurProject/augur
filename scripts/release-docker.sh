#!/bin/bash
set -x

args=("$@")
augur_env=${args[0]}
version=$(date -u +%Y-%m-%d-%H%M)

case ${augur_env} in
    dev)
        network="rinkeby"
        cluster="dev-augur-net"
        ;;
    *)
        network=${augur_env}
        ;;
esac

docker build . --build-arg ethereum_network=${network} --tag augurproject/augur:${augur_env} --tag augurproject/augur:$version || exit 1

docker push augurproject/augur:$version
docker push augurproject/augur:${augur_env}

# for use in travis-ci
# aws deploy
if [[ ${TRAVIS} = true && ${augur_env} == "dev" ]]; then
    sudo apt-get install libssl-dev pyasn1
    # we need aws cli tools to deploy
    sudo pip install requests[security]
    sudo pip install awscli
    aws --region=us-east-1 ecs update-service  --service dev-augur-ui --cluster ${cluster} --force-new-deployment
fi

