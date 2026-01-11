#!/bin/bash

if [ "$VERCEL_ENV" = "production" ]; then
  echo "BETTER_AUTH_URL=https://$VERCEL_PROJECT_PRODUCTION_URL" > .env
  echo "NEXT_PUBLIC_APP_URL=https://$VERCEL_PROJECT_PRODUCTION_URL" >> .env
else
  echo "BETTER_AUTH_URL=https://$VERCEL_BRANCH_URL" > .env
  echo "NEXT_PUBLIC_APP_URL=https://$VERCEL_BRANCH_URL" >> .env
fi

pnpm run db:generate
pnpm run db:migrate
pnpm run build
