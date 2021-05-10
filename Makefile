SHELL=/bin/bash

env=skunkworks

clean::
	git clean -d -f && find . -name "node_modules" -type d -prune -print | xargs du -chs && find . -name 'node_modules' -type d -prune -print -exec rm -rf '{}' \;

install::
	yarn && yarn build

publish::
	yarn publish:lerna

