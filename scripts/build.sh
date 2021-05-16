#!/bin/bash

set -e
yarn add lerna -g --ignore-workspace-root-check
lerna run publish --since HEAD~1
