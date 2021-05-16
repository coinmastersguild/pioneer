#!/bin/bash

set -e

git config user.email "circlciBot@dontemailme.com"
git config user.name "cibot"

lerna version patch --yes
git add -A && git commit -m "version bump"
lerna publish from-package --no-private --yes
