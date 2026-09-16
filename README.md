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
1. Log in using the default credentials.
2. To create a new character, upload an image, fill in the name, gender, status, and species, and click the "Create character" button.
3. To edit a character, click the "Edit" button next to the character and change the values ​​you wish to adjust.
4. To remove a character, click the "Delete" button next to the character.

## How it works
This is a Next.js/React app for browsing a Planet Express Academy-style directory of Futurama characters. It has:<br>
- A public character catalogue
- Free-text search
- Pagination
- Individual character dossier pages
- A protected admin area for creating, editing, and deleting characters
- SQL Server persistence backed by `data/FuturamaCharacters.mdf`



The main public page is rendered by `app/page.tsx`, which mounts the client-side `CharactersManager`.

## Public character catalogue

When the home page loads:

1. `CharactersManager` requests `GET /api/characters`.
2. The API route in `app/api/characters/route.ts` reads all characters from the database.
3. Characters are displayed as cards with:
   - Image
   - Name
   - “View Dossier” link

The catalogue displays eight characters per page. Pagination is stored in the URL as `?page=N`, so browser navigation and refreshes preserve the current page.

The search box filters the already-loaded character list in the browser. It performs a case-insensitive substring search against:

- Name
- Gender
- Status
- Species

Typing a new search resets the page to page 1. If filtering makes the current page invalid, the app adjusts the URL and page state to the last valid page.

The styling and responsive layout are defined in `app/globals.css`.

## Character dossier pages

Each card links to `/characters/[id]`, handled by `app/characters/[id]/page.tsx`.

The page:

1. Parses the route ID.
2. Rejects invalid IDs with Next.js `notFound()`.
3. Reads the matching character from the database.
4. Also returns `notFound()` if no character exists.
5. Passes the character to `CharacterDossier`.

The tagged `CharacterDossier` component is presentational. It renders:

- A “Back to characters” link pointing to `/#characters`
- The character image
- The character name
- Name, gender, status, and species details

It receives one strongly typed `Character` object and does not fetch data or maintain local state itself. Its data comes from `lib/characters.ts`.

## Database layer

The shared database code is in `lib/characters.ts`.

It uses `mssql/msnodesqlv8` and defaults to:

- SQL Server: `localhost`
- Instance: `SQLEXPRESS`
- Windows authentication
- Database: `FuturamaCharacters`
- MDF file: `data/FuturamaCharacters.mdf`

On first connection, the app:

1. Connects to the SQL Server `master` database.
2. Attaches the MDF file if the database does not already exist.
3. Connects to the application database.
4. Creates the `dbo.Characters` table if necessary.
5. Ensures the `image` column supports large values.

The character record contains:

```text
id
name
gender
status
species
createdAt
image
```

The database functions support reading all characters, reading one character, creating, updating, and deleting.

## Admin area

The `/admin` route mounts `AdminManager`.

Initially it shows the login form from `admin-login.tsx`. Credentials are checked by `POST /api/admin/login` against `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

On successful login:

- The server creates an HMAC-signed HTTP-only cookie.
- The browser switches to the admin dashboard.
- The session lasts up to eight hours.

Session logic is implemented in `lib/auth.ts`.

The admin dashboard allows the user to:

- Add a character
- Edit an existing character
- Delete a character
- Sign out
- Reload the current character list after each mutation

The editor in `character-editor.tsx` provides:

- Name input
- Gender selection
- Status selection
- Species selection
- Image upload
- Client-side image type validation
- A 5 MB image-size limit
- Image preview

Images are converted to data URLs in the browser and stored directly in the database as text.

The admin API in `app/api/admin/characters/route.ts` protects create, update, and delete operations with the signed session cookie.

## Overall request flow

```text
Browser
  |
  | GET /
  v
CharactersManager
  |
  | GET /api/characters
  v
Next.js API route
  |
  v
SQL Server / FuturamaCharacters.mdf
```

For a dossier:

```text
/characters/42
  |
  v
Server-rendered CharacterPage
  |
  v
readCharacter(42)
  |
  v
CharacterDossier
```

For administration:

```text
/admin
  |
  v
AdminManager
  |
  +-- POST /api/admin/login
  +-- POST /api/admin/characters
  +-- PUT  /api/admin/characters
  +-- DELETE /api/admin/characters?id=...
  +-- POST /api/admin/logout
```

The app’s configured environment variables and startup instructions are documented in `README.md`.

