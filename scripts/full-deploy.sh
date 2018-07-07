#!/bin/bash
set -ex

SCRIPT_DIR=$(dirname "$(realpath "$0")")

TMP_DIR=$(mktemp -d)
echo $TMP_DIR
GET_VERSION="node $SCRIPT_DIR/get-version.js"

cd $TMP_DIR

function checkSolidityVersion()
{
	solc --version | grep "^Version: $1"
	if [ $? -ne 0 ]; then
		echo "Error: solc version $1 not found";
		exit 1
	fi
}

function deployAugurCore()
{
	(
	git clone git@github.com:AugurProject/augur-core
	cd augur-core
	npm install
	git add package*
	git commit -m "Updated dependencies" || true
	git checkout -b version-bump
	npm version prerelease
	VERSION=$($GET_VERSION $TMP_DIR/augur-core/package.json)
	git push origin v$VERSION
	git push
	npm publish
	)
}

function deployAugurJs()
{
	(
	AUGUR_CORE_VERSION=$($GET_VERSION $TMP_DIR/augur-core/package.json)
	rm -rf augur.js
	git clone git@github.com:AugurProject/augur.js
	cd augur.js
	git checkout -b augur-core@$AUGUR_CORE_VERSION
	npm install
	npm install --save-exact augur-core@$AUGUR_CORE_VERSION
	git add package.json package-lock.json
	git commit -m augur-core@$AUGUR_CORE_VERSION
	npm run docker:build-and-push
	git commit src/ -m 'geth-pop containers'
	ETHEREUM_PRIVATE_KEY=$(cat ~/augur/keys/deploy_keys/rinkeby.prv ) npm run deploy:environment
	git commit src/ -m 'rinkeby contracts'
	git push
	npm run release:dev
	)
}


function deployAugurUi()
{
	(
	AUGUR_JS_VERSION=$($GET_VERSION $TMP_DIR/augur.js/package.json)
	rm -rf augur-node
	git clone git@github.com:AugurProject/augur-node
	cd augur-node
	git checkout -b augur.js@$AUGUR_JS_VERSION
	npm install
	npm install --save-exact augur.js@$AUGUR_JS_VERSION
	yarn
	git commit package.json package-lock.json yarn.lock -m augur.js@$AUGUR_JS_VERSION
	git push
	// TODO: publish for augur-app?
	)
}

function deployAugurNode()
{
	(
	AUGUR_JS_VERSION=$($GET_VERSION $TMP_DIR/augur.js/package.json)
	rm -rf augur
	git clone git@github.com:AugurProject/augur
	cd augur
	git checkout -b augur.js@$AUGUR_JS_VERSION
	npm install
	npm install --save-exact augur.js@$AUGUR_JS_VERSION
	yarn
	git commit package.json package-lock.json yarn.lock -m augur.js@$AUGUR_JS_VERSION
	git push
	// TODO: publish for augur-app?
	)
}


checkSolidityVersion 0.4.20
deployAugurCore
deployAugurJs
deployAugurUi
deployAugurNode
