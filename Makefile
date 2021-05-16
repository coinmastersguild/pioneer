SHELL=/bin/bash

env=skunkworks

.DEFAULT_GOAL := build

clean::
	find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \; &&\
	sh scripts/clean.sh

build::
	yarn && cd services/pioneer-server && yarn && npx lerna run deploy \— since HEAD~1

test::
	cd e2e/sdk-swaps/etherum-e2e-swap && npm run run-dev
	#npm install -g codeclimate-test-reporter && CODECLIMATE_REPO_TOKEN=${CODECLIMATE_REPO_TOKEN} codeclimate-test-reporter < coverage/lcov.info

publish::
	yarn publish:lerna

## deployment
up::
	echo "todo"
