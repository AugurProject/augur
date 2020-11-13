.PHONY: all ipfs-publish ipfs-pin build-typescript watch-typescript build-ui watch-ui build-contracts docker-all download-packages test build-clean clean python-deps virtualenv requests python3 yarn ipfs ipfs-envvars

all: build-ui

ipfs-publish: ipfs ipfs-envvars build-ui python-deps
	. venv/bin/activate; \
	python3 packages/augur-ui/support/dnslink-cloudflare.py -d augur.net -r _dnslink.v2-ipfs  -l `ipfs add -r -Q -n --pin=false packages/augur-ui/build`

ipfs-pin: ipfs build-ui
	ipfs add -r --pin=true packages/augur-ui/build

ipfs-hash: ipfs build-ui
	ipfs add -r -Q -n --pin=false packages/augur-ui/build

build-typescript: download-packages
	yarn build

watch-typescript: download-packages
	yarn build:watch

build-ui: build-typescript
	yarn workspace @augurproject/ui build

watch-ui: build-typescript
	yarn workspace @augurproject/ui watch

build-contracts: build-typescript venv
	. venv/bin/activate; \
	python3 -m pip install -r packages/augur-core/requirements.txt; \
	yarn workspace @augurproject/core build:contracts; \
	deactivate

build-artifacts: build-typescript venv
	. venv/bin/activate; \
	python3 -m pip install -r packages/augur-core/requirements.txt; \
	yarn workspace @augurproject/core build:artifacts; \
	deactivate

docker-all: build-typescript
	yarn docker:all

download-packages: yarn
	yarn

test: build-typescript
	yarn test

build-clean: yarn
	yarn build:clean

clean: yarn
	yarn clean


python-deps: venv requests

# NOTE: not phony
venv: python3 virtualenv
	python3 -m venv venv

virtualenv: python3
	python3 -m pip install virtualenv

requests: venv
	. venv/bin/activate; \
	python3 -m pip install requests




PYTHON3_INSTALLED := $(shell python3 --version >/dev/null 2>&1; echo $$?)
python3:
ifneq ($(PYTHON3_INSTALLED),0)
	$(error Must install python3)
endif

YARN_INSTALLED := $(shell yarn --version >/dev/null 2>&1; echo $$?)
yarn:
ifneq ($(YARN_INSTALLED),0)
	$(error Must install yarn)
endif

IPFS_AVAILABLE := $(shell ipfs version >/dev/null 2>&1; echo $$?)
ipfs:
ifneq ($(IPFS_AVAILABLE),0)
	$(error Must install ipfs daemon with CLI)
endif

ipfs-envvars:
ifndef CF_API_KEY
	$(error Must specify CF_API_KEY)
endif
ifndef CF_API_EMAIL
	$(error Must specify CF_API_EMAIL)
endif
