# Futurama
The Futurama App is an app for finding Futurama characters by filtering by gender, status, species, and name (free-text search).

<img width="1891" height="903" alt="Futurama" src="https://github.com/user-attachments/assets/1f07dc7b-dce2-4fa1-ab72-02eb3b665f06" />

## Demo
End user:
![Demo of Futurama](https://github.com/HaLund/Futurama/blob/main/demo_futurama_end_user.gif)

Admin:
![Demo of Futurama](https://github.com/HaLund/Futurama/blob/main/demo_futurama_admin.gif)

## Features
- 🔎 Search for Futurama characters
- 🎬 Show detailed information
- 📱 Responsive design
- 🖋️ Create, Update and Delete characters (admin)

## Technologies
- HTML
- CSS
- TypeScript
- React
- Next.js
- SQL-Server
- Git
- GitHub

## Usage
End user


Admin

## Admin

Copy `.env.example` to `.env.local`, set the admin credentials, then open `/admin`.
By default, local development uses Windows authentication with the `SQLEXPRESS` instance.
Set `SQL_USER` and `SQL_PASSWORD` to use SQL authentication instead.
The admin page supports creating, editing, and deleting characters. Changes are persisted to `data/FuturamaCharacters.mdf` through the configured SQL Server instance.

## Development

(You may be able to skip some of the steps below, depending on what is already installed and configured on your system)<br>
Download Node from the Node.js website.<br>
Install Node on your computer.<br>
Verify in the terminal that both Node and npm have been installed by running "node -v" and "npm -v".<br>
Initialize the project with the command "npm init -y". If you prefer, you can skip the "-y" flag and answer the questions you are asked instead.<br>
Install TypeScript in the project with "npm install typescript --save-dev"<br>
Configure TypeScript with "npx tsc --init"<br>
Start the app with `npm run dev`. The startup hook clears Next.js' generated `.next` chunks to avoid stale `Cannot find module './611.js'` errors. If a server is already running, stop it before restarting.
