SHELL=/bin/bash

env=skunkworks

.DEFAULT_GOAL := build

clean::
	git clean -d -f && find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;

build::
	yarn && cd services/pioneer-server && yarn &&\


install::
	yarn && yarn build

test::
	yarn test && yarn coverage &&\
	npm install -g codeclimate-test-reporter && CODECLIMATE_REPO_TOKEN=${CODECLIMATE_REPO_TOKEN} codeclimate-test-reporter < coverage/lcov.info

publish::
	yarn publish:lerna

