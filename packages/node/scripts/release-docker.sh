#!/bin/bash
set -x
set -e

args=("$@")
augur_repo=augur-node
augur_env=${args[0]}
version=$(date -u +%Y-%m-%d-%H%M)

aws_preconfigure () {
    # we need aws cli tools to deploy
    if [[ ${TRAVIS} = true ]]; then
        sudo apt-get install libssl-dev
        sudo pip install awscli
    fi
}

aws_deploy () {
    aws --region=us-east-1 ecs update-service  --service "$augur_service" --cluster "${cluster}" --force-new-deployment
}


push_core_tag=false

case ${augur_env} in
    dev)
        network="rinkeby"
        cluster="dev-augur-net"
        augur_service="dev-augur-node"
        push_core_tag=true
        ;;
    stable)
        network="stable"
        cluster="stable-augur-net"
        augur_service="stable-augur-node"
        ;;
    *)
        network=${augur_env}
        ;;
esac

docker build . --build-arg ethereum_network=${network} \
    --tag augurproject/${augur_repo}:${augur_env} \
    --tag augurproject/${augur_repo}:$version \
    --tag augurproject/${augur_repo}:core-$(npm explore augur.js -- npm run --silent core:version)

docker push augurproject/${augur_repo}:${version}
docker push augurproject/${augur_repo}:${augur_env}

if [[ $push_core_tag ]]; then
    docker push augurproject/${augur_repo}:core-$(npm explore augur.js -- npm run --silent core:version)
fi

# install packages needed to deploy to aws, then deploy
aws_preconfigure
aws_deploy

