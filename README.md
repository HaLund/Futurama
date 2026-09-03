# Futurama
Main branch for the Futurama App - an app for finding Futurama characters by filtering by gender, status, species, and name (free-text search).

## Admin

Copy `.env.example` to `.env.local`, set the admin credentials, then open `/admin`.
By default, local development uses Windows authentication with the `SQLEXPRESS` instance.
Set `SQL_USER` and `SQL_PASSWORD` to use SQL authentication instead.
The admin page supports creating, editing, and deleting characters. Changes are persisted to `data/FuturamaCharacters.mdf` through the configured SQL Server instance.

## Development

Start the app with `npm run dev`. The startup hook clears Next.js' generated `.next` chunks to avoid stale `Cannot find module './611.js'` errors. If a server is already running, stop it before restarting.
