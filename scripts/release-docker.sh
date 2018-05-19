#!/bin/bash
set -x

args=("$@")
augur_env=${args[0]}
version=$(date -u +%Y-%m-%d-%H%M)

aws_preconfigure () {
    # we need aws cli tools to deploy
    if [[ ${TRAVIS} = true ]]; then
        sudo apt-get install libssl-dev python-pyasn1 python3-pyasn1
        sudo pip install awscli
    fi
}

aws_deploy () {
    aws --region=us-east-1 ecs update-service  --service "$augur_service" --cluster "${cluster}" --force-new-deployment
}

case ${augur_env} in
    dev)
        network="rinkeby"
        cluster="dev-augur-net"
        augur_service="dev-augur-ui"
        ;;
    stable)
        network="stable"
        cluster="stable-augur-net"
        augur_service="stable-augur-ui"
        ;;
    *)
        network=${augur_env}
        ;;
esac

docker build . --build-arg ethereum_network=${network} --tag augurproject/augur:${augur_env} --tag augurproject/augur:$version || exit 1

docker push augurproject/augur:$version
docker push augurproject/augur:${augur_env}

# install packages needed to deploy to aws, then deploy
aws_preconfigure
aws_deploy
