# Members Only

An exclusive clubhouse where members write anonymous posts. Inside the club, members can see who wrote each message and when. Outside, visitors only see the stories and are left wondering who wrote them.

Built as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-nodejs-members-only) Node.js curriculum, to practice authentication, sessions, and role-based permissions.

## Features

- Sign up with server-side validation and sanitization (express-validator)
- Passwords hashed with bcrypt, never stored in plain text
- Log in / log out with Passport.js (local strategy)
- Sessions persisted in PostgreSQL, so users stay logged in across server restarts
- Join the club with a secret passcode
- Become an admin with a second passcode
- Admins can delete any message
- Custom 404 / 403 / 500 error pages

## Roles and permissions

| | See messages | See author & date | Post a message | Delete messages |
|---|:---:|:---:|:---:|:---:|
| Visitor | ✅ | ❌ | ❌ | ❌ |
| Logged-in user | ✅ | ❌ | ✅ | ❌ |
| Member | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

Permissions are enforced on the server, not just hidden in the UI:

- Route access is guarded by middleware (`isAuth`, `isGuest`, `isAdmin`).
- Author names and dates are never queried from the database for non-members.

## Tech stack

- **Runtime:** Node.js (ES modules)
- **Server:** Express 5
- **Views:** EJS
- **Database:** PostgreSQL (`pg`)
- **Auth:** Passport.js, passport-local, bcryptjs
- **Sessions:** express-session, connect-pg-simple
- **Validation:** express-validator

## Getting started

### Prerequisites

- Node.js 20.11 or later
- PostgreSQL

### Installation

```bash
git clone <your-repo-url>
cd members-only
npm install
```

### Environment variables

Create a `.env` file at the root of the project:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/members_only
SESSION_SECRET=a_long_random_string
MEMBER_PASSCODE=your_member_passcode
ADMIN_PASSCODE=your_admin_passcode
```

Generate a strong session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Database

```bash
createdb members_only
npm run db:init
```

> ⚠️ `db:init` drops and recreates all tables, then seeds test data. Never run it against a production database.

### Run

```bash
npm run dev     # development, with auto-reload
npm start       # production
```

The app runs on [http://localhost:3000](http://localhost:3000).

### Test accounts (local seed only)

All seeded accounts use the password `password123`.

| Email | Role |
|---|---|
| `admin@club.test` | Admin |
| `member@club.test` | Member |
| `guest@club.test` | Logged-in user |

## Project structure

```
├── app.js              # Express setup and middleware order
├── config/             # Passport strategy and session store
├── controllers/        # Request handling logic
├── db/                 # Connection pool, queries, seed script
├── middleware/         # Auth guards, logger, HTTP errors
├── routes/             # Auth, club, and message routers
├── utils/              # Password hashing helpers
├── views/              # EJS templates and partials
└── public/             # Static assets (CSS)
```

## Deployment

In production, set these environment variables on your hosting platform:

- `DATABASE_URL`
- `SESSION_SECRET`
- `MEMBER_PASSCODE`
- `ADMIN_PASSCODE`
- `NODE_ENV=production`

With `NODE_ENV=production`, the app trusts the host's proxy, sends session cookies over HTTPS only, and hides internal error details from visitors.

Create the tables on the production database without the test seed.

## What I learned

- Designing a relational schema with foreign keys and `ON DELETE CASCADE`
- Hashing and verifying passwords with bcrypt, and why the salt lives inside the hash
- How Passport's `serializeUser` / `deserializeUser` turn a session ID into `req.user`
- The difference between guarding routes with middleware and adapting what a controller shows
- Never trusting IDs sent by the client