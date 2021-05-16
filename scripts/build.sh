#!/bin/bash

set -e
#yarn add lerna -g --ignore-workspace-root-check
#lerna version minor
lerna publish from-package --no-private --yes
