#!/bin/sh


cd /app

# npm config list

# npm install -g pnpm
npm install
npm run build

# yarn install --registry="http://192.168.13.79/repository/node-group/"
# yarn build
# pnpm install
# pnpm run build