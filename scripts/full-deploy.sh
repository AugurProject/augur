#!/bin/bash
set -ex pipefail

NPM_VERSION=${NPM_VERSION:-prerelease}
NPM_TAG=${NPM_TAG:-dev}
PRODUCTION=${PRODUCTION:-false}
GAS_PRICE_IN_NANOETH=${GAS_PRICE_IN_NANOETH:-20}
BUMP_AUGUR_CORE=${BUMP_AUGUR_CORE:-false}

NETWORKS_TO_DEPLOY=${NETWORKS_TO_DEPLOY:-"ROPSTEN RINKEBY KOVAN"}

SCRIPT_DIR=$(dirname "$(realpath "$0")")

TMP_DIR=$(mktemp -d)
echo $TMP_DIR
GET_VERSION="node $SCRIPT_DIR/get-version.js"

cd $TMP_DIR

function preflightCheck()
{
	npm whoami 2> /dev/null || echo "npm auth failed."\nYou need to authorize this machine using `npm adduser`; exit 1
}

function checkSolidityVersion()
{
	if [ -z "$1" ]; then
		echo "Please specify version of solc to check"
		exit 1
	fi
	if ! solc --version | grep "^Version: $1"; then
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
	npm version $NPM_VERSION
	VERSION=$($GET_VERSION $TMP_DIR/augur-core/package.json)
	git push -u origin version-bump
	git push origin v$VERSION
	npm publish --tag $NPM_TAG
	)
}

function deployAugurJsAndUploadContracts()
{
	(
	export PRODUCTION
	export GAS_PRICE_IN_NANOETH
	rm -rf augur.js
	git clone git@github.com:AugurProject/augur.js
	cd augur.js
	npm install
	git add package.json package-lock.json
	git commit -m "Updated dependencies" || true
	if [ "$BUMP_AUGUR_CORE" == true ]; then
		AUGUR_CORE_VERSION=$($GET_VERSION $TMP_DIR/augur-core/package.json)
		git checkout -b augur-core@$AUGUR_CORE_VERSION
		npm install --save-exact augur-core@$AUGUR_CORE_VERSION
		git add package.json package-lock.json
		git commit -m augur-core@$AUGUR_CORE_VERSION
		npm run docker:build-and-push
		git commit src/ -m 'geth-pop containers'
		deployContracts
	fi
	npm version $NPM_VERSION
	VERSION=$($GET_VERSION $TMP_DIR/augur.js/package.json)
	git push -u origin augur-core@$AUGUR_CORE_VERSION
	git push origin v$VERSION --no-verify
	npm publish --tag $NPM_TAG
	)
}

function deployAugurNode()
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
	npm version $NPM_VERSION
	VERSION=$($GET_VERSION $TMP_DIR/augur-node/package.json)
	git push -u origin augur.js@$AUGUR_JS_VERSION
	git push origin v$VERSION --no-verify
	npm publish --tag $NPM_TAG
	)
}

function deployAugurUi()
{
	(
	export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
	AUGUR_JS_VERSION=$($GET_VERSION $TMP_DIR/augur.js/package.json)
	rm -rf augur
	git clone git@github.com:AugurProject/augur-ui
	cd augur-ui
	git checkout -b augur.js@$AUGUR_JS_VERSION
	npm install
	npm install --save-exact augur.js@$AUGUR_JS_VERSION
	yarn
	git commit package.json package-lock.json yarn.lock -m augur.js@$AUGUR_JS_VERSION
	npm version $NPM_VERSION
	VERSION=$($GET_VERSION $TMP_DIR/augur-ui/package.json)
	git push -u origin augur.js@$AUGUR_JS_VERSION
	git push origin v$VERSION --no-verify
	npm publish --tag $NPM_TAG
	)
}

function deployAugurApp()
{
	(
	AUGUR_CORE_VERSION=$($GET_VERSION $TMP_DIR/augur.js/node_modules/augur-core/package.json)
	AUGUR_JS_VERSION=$($GET_VERSION $TMP_DIR/augur.js/package.json)
	AUGUR_UI_VERSION=$($GET_VERSION $TMP_DIR/augur-ui/package.json)
	AUGUR_NODE_VERSION=$($GET_VERSION $TMP_DIR/augur-node/package.json)
	rm -rf augur-app
	git clone git@github.com:AugurProject/augur-app
	cd augur-app
	git checkout -b augur.js@$AUGUR_JS_VERSION
	npm install
	npm install --save-exact augur-core@$AUGUR_CORE_VERSION
	npm install --save-exact augur.js@$AUGUR_JS_VERSION
	npm install --save-exact augur-ui@$AUGUR_UI_VERSION
	npm install --save-exact augur-node@$AUGUR_NODE_VERSION
	npm install
	git commit package.json package-lock.json -m augur.js@$AUGUR_JS_VERSION
	git push -u origin augur.js@$AUGUR_JS_VERSION
	)
}

# This happens within the subshell of the augur.js deploy
function deployContracts()
{
	for NETWORK in $NETWORKS_TO_DEPLOY; do
		PRIVATE_KEY_ENV_NAME=${NETWORK}_PRIVATE_KEY
		if [ -z "${!PRIVATE_KEY_ENV_NAME}" ]; then
			echo "Skipping $NETWORK"
			continue
		fi
		echo Deploying $NETWORK
		export $PRIVATE_KEY_ENV_NAME
		if [ $NETWORK == "ETHEREUM" ]; then
			NPM_TARGET=upload:environment
		else
			NPM_TARGET=deploy:environment
		fi
		ETHEREUM_HTTP=http://$NETWORK.augur.net/ethereum-http \
			npm run $NPM_TARGET
		git commit src/ -m '$NETWORK contracts'
	done
}

preflightCheck
if [ "$BUMP_AUGUR_CORE" == true ]; then
	checkSolidityVersion 0.4.20
	deployAugurCore
fi
deployAugurJsAndUploadContracts
deployAugurUi
deployAugurNode
deployAugurApp
