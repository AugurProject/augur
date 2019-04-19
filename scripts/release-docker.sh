#!/bin/bash
set -x

args=("$@")
augur_env=${args[0]}
version=$(date -u +%Y-%m-%d-%H%M)
build_environment="dev"

aws_preconfigure () {
    # we need aws cli tools to deploy
    if [[ ${TRAVIS} = true ]]; then
        python --version
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
    kovan)
        network="kovan"
        cluster="kovan-augur-net"
        augur_service="kovan-augur-ui"
        ;;
    dev-optimized)
        network="rinkeby"
        cluster="try-augur-net"
        augur_service="try-augur-ui"
        build_environment="dev-optimized"
        ;;
    sneakpeak)
        network="rinkeby"
        cluster="sneakpeak-augur-net"
        augur_service="sneakpeak-ui"
        ;;
    *)
        network=${augur_env}
        ;;
esac

docker build . --build-arg ethereum_network=${network} --build-arg build_environment=${build_environment} --tag augurproject/augur:${augur_env} --tag augurproject/augur:$version || exit 1

docker push augurproject/augur:$version
docker push augurproject/augur:${augur_env}

# install packages needed to deploy to aws, then deploy
aws_preconfigure
aws_deploy
