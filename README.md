# Notes Sharing — Cloud Notes Hub

A web app that gives class notes one searchable home, instead of letting them
scroll away in chat groups. Students upload notes with a subject and semester,
and anyone can find them by title, subject or semester.

## What it does

- **Upload notes** — title, subject, semester and description, plus the file.
  The file goes to Firebase Storage under a timestamped name
  (`notes/<timestamp>_<filename>`), so two uploads never clash. The note's
  details are then saved to the Firestore `notes` collection in the same flow.
- **Explore and search** — notes are listed newest first and can be searched
  by title, subject or semester.
- **Dashboard** — shows the 10 newest notes.
- **Note cards** — each note shows its semester tag, subject, uploader and
  download count, with a View / Download link to the stored file.
- **Auth** — email/password sign-in and sign-up with Firebase Auth.
- **Sample data** — `src/seed.js` holds five sample notes (Physics, Computer
  Science, Chemistry, Blockchain, Statistics) so the search has something to
  find on a fresh setup. The download counts in the seed data are demo values.

## Tech stack

- React 19 + Vite
- Firebase Auth, Firestore and Storage
- react-router-dom v7, Framer Motion, lucide-react
- Deployed with Vercel (`vercel.json`)

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/auth` | Sign in / sign up |
| `/dashboard` | 10 newest notes |
| `/upload` | Upload a note |
| `/explorer` | Search and browse notes |
| `/profile` | Profile |

## Run locally

```bash
npm install
npm run dev
```

The app reads its Firebase config from `src/firebase.js`. Add your own
Firebase project config there; never commit real production keys.

## What it does not do yet

- No ratings, comments or subject filter chips — search is the only filter.
- No note preview; notes open through the stored file link.
- No live demo URL is listed here.

## Project structure

- `src/pages/` — Landing, Auth, Dashboard, Upload, Explorer, Profile pages
- `src/components/` — NoteCard, Navbar, Footer, CustomCursor,
  BackgroundParticles
- `src/firebase.js` — Firebase app, Auth, Firestore and Storage setup
- `src/seed.js` — five sample notes for a fresh setup
