for dir in modules/*; do $(cd "$dir" && npm update) &; done &
