#!/bin/bash

set -e

git config user.email "circlciBot@dontemailme.com"
git config user.name "cibot"

#yarn add lerna -g --ignore-workspace-root-check
lerna version minor

lerna publish from-package --no-private --yes
