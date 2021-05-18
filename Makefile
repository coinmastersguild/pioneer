SHELL=/bin/bash

env=skunkworks

.DEFAULT_GOAL := build

clean::
	find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \; &&\
	sh scripts/clean.sh

#TODO build tsoa server based on env
#TODO build pubkey worker
build::
	yarn && yarn add lerna -G --ignore-workspace-root-check &&\
	lerna run build --include-dependencies
#	&&/
#	cd services/pioneer-server &&/
#	yarn && npm run build:all-local

test::
	cd e2e/sdk-swaps/thorchain-e2e-swap && npm run run-dev
#	cd e2e/sdk-swaps/thorchain-e2e-swap && npm run test
#	cd e2e/sdk-swaps/etherum-e2e-swap && npm run run-dev
#	cd e2e/sdk-swaps/etherum-e2e-swap && npm run test
#	cd e2e/sdk-swaps/tokens-e2e-swap && npm run run-dev
#	cd e2e/sdk-swaps/tokens-e2e-swap && npm run test

publish::
	yarn publish:lerna

## TODO start application
up::
	echo "todo"
