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

## Installation
1. Clone the repository:
git clone
2. Go to the project folder:
cd futurama
3. Install dependencies:
npm install
4. Start the development server:
npm run dev

In detail:
(You may be able to skip some of the steps below, depending on what is already installed and configured on your system)<br>
1. Download Node from the Node.js website.
2. Install Node on your computer.
3. Verify in the terminal that both Node and npm have been installed by running "node -v" and "npm -v".
4. Initialize the project with the command "npm init -y". If you prefer, you can skip the "-y" flag and answer the questions you are asked instead.
5. Install TypeScript in the project with "npm install typescript --save-dev"
6. Configure TypeScript with "npx tsc --init"
7. Start the app with `npm run dev`. The startup hook clears Next.js' generated `.next` chunks to avoid stale `Cannot find module './611.js'` errors. If a server is already running, stop it before restarting.

Log in as administrator:<br>
1. Copy `.env.example` to `.env.local`, set the admin credentials, then open `/admin`.<br>
2. By default, local development uses Windows authentication with the `SQLEXPRESS` instance.<br>
3. Specify `SQL_USER` and `SQL_PASSWORD` to use SQL authentication instead if you want to run the app on a Linux server.<br>
4. The admin page supports creating, editing, and deleting characters. Changes are persisted to `data/FuturamaCharacters.mdf` through the configured SQL Server instance.<br>

## Usage
End user
Search
1. Start searching for a character by typing a letter. The more letters you type, the more precise the match becomes.
2. Click on one of the displayed characters to go to the details page.

Admin
1. Log in using the default credentials: username "admin", password "admin1234".
2. To create a new character, upload an image, fill in the name, gender, status, and species, and click the "Create character" button.
3. To edit a character, click the "Edit" button next to the character and change the values ​​you wish to adjust.
4. To remove a character, click the "Delete" button next to the character.


