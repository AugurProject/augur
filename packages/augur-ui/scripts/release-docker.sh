#!/bin/bash
set -x

args=("$@")
augur_env=${args[0]}
version=$(date -u +%Y-%m-%d-%H%M)
build_environment="dev"

aws_preconfigure () {
    # we need aws cli tools to deploy
    python --version
    sudo apt-get install libssl-dev python-pyasn1 python3-pyasn1
    sudo pip install awscli
}

aws_deploy () {
    aws --region=us-east-1 ecs update-service  --service "$augur_service" --cluster "${cluster}" --force-new-deployment
}

case ${augur_env} in
    dev)
        network="rinkeby"
        cluster="rinkeby-v2"
        augur_service="augur-ui-v2-rinkeby"
        ;;
    kovan)
        network="kovan"
        cluster="kovan-v2-ecs"
        augur_service="augur-ui-kovan"
        version=kovan-$(date -u +%Y-%m-%d-%H%M)
        ;;
    dev-optimized)
        network="rinkeby"
        cluster="try-augur-net"
        augur_service="try-augur-ui"
        build_environment="dev-optimized"
        ;;
    release)
        network="rinkeby"
        cluster=""
        augur_service=""
        build_environment="release"
        version = "$(node scripts/get-version.js)"
        ;;
    *)
        network=${augur_env}
        ;;
esac

docker build . --build-arg ethereum_network=${network} --build-arg build_environment=${build_environment} --cache-from augurproject/augur-ui:${augur_env} --tag augurproject/augur-ui:${augur_env} --tag augurproject/augur-ui:$version

docker push augurproject/augur-ui:$version
docker push augurproject/augur-ui:${augur_env}

# install packages needed to deploy to aws, then deploy
if [[ -n "$cluster" ]]; then
    echo "deploy";
    aws_preconfigure
    aws_deploy
else
    echo "no deploy";
fi
