#!/bin/zsh
set -e

npx supabase start

trap 'npx supabase stop' EXIT SIGINT SIGTERM

npm run dev:next
