# Futurama
Main branch for the Futurama App - an app for finding Futurama characters by filtering by gender, status, species, and name (free-text search).

## Admin

Copy `.env.example` to `.env.local`, set the admin credentials, then open `/admin`.
By default, local development uses Windows authentication with the `SQLEXPRESS` instance.
Set `SQL_USER` and `SQL_PASSWORD` to use SQL authentication instead.
The admin page supports creating, editing, and deleting characters. Changes are persisted to `data/FuturamaCharacters.mdf` through the configured SQL Server instance.

## Development

(You may be able to skip some of the steps below, depending on what is already installed and configured on your system)
Download Node from the Node.js website.
Install Node on your computer.
Verify in the terminal that both Node and npm have been installed by running "node -v" and "npm -v".
Initialize the project with the command "npm init -y". If you prefer, you can skip the "-y" flag and answer the questions you are asked instead.
Install TypeScript in the project with "npm install typescript --save-dev"
Configure TypeScript with "npx tsc --init"
Start the app with `npm run dev`. The startup hook clears Next.js' generated `.next` chunks to avoid stale `Cannot find module './611.js'` errors. If a server is already running, stop it before restarting.
