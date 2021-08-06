for dir in modules/*; do (cd "$dir" && npm audit fix --force); done
