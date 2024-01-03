#!/bin/bash

# Loop through each directory in modules/*
for dir in modules/*; do
  if [ -d "$dir" ]; then
    echo "Updating @pioneer-platform packages in $dir"
    # Change to the directory and update @pioneer-platform packages
    (cd "$dir" && yarn upgrade --scope @pioneer-platform) &
  fi
done

# Wait for all background processes to finish
wait
