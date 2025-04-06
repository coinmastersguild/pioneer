SHELL=/bin/bash

env=prod
debug=false
coin=false

.DEFAULT_GOAL := build

clean::
	find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \; &&\
	sh scripts/clean.sh

build::
	pnpm install && pnpm -r run build

test::
	sh scripts/test.sh $(env) $(debug) $(coin)

bump::
	pnpm changeset

publish::
	pnpm version && pnpm publish

## TODO start application
up::
	echo "todo"
