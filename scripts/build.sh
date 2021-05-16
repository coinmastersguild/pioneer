#!/bin/bash

set -e

git config user.email "circlciBot@dontemailme.com"
git config user.name "cibot"

git add -A && git commit -m "version bump"
#yarn add lerna -g --ignore-workspace-root-check
lerna version patch

lerna publish from-package --no-private --yes
