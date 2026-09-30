// db/populatedb.js
// Usage : npm run db:init
// ⚠️ Supprime et recrée les tables à chaque exécution (données perdues).

import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pg;

const SQL_SCHEMA = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL UNIQUE,
  password CHAR(60) NOT NULL,
  is_member BOOLEAN NOT NULL DEFAULT false,
  is_admin BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
`;

// Trois comptes de test, un par rôle. Mot de passe commun : "password123"
const USERS = [
  { firstname: 'Ada', lastname: 'Lovelace', username: 'admin@club.test', isMember: true, isAdmin: true },
  { firstname: 'Alan', lastname: 'Turing', username: 'member@club.test', isMember: true, isAdmin: false },
  { firstname: 'Grace', lastname: 'Hopper', username: 'guest@club.test', isMember: false, isAdmin: false },
];

const MESSAGES = [
  { title: 'Bienvenue', text: 'Premier message du club. Qui suis-je ?', author: 'admin@club.test' },
  { title: 'Question existentielle', text: 'Une machine peut-elle penser ?', author: 'member@club.test' },
  { title: 'Bug trouvé', text: 'Il y avait littéralement un papillon de nuit dans le relais.', author: 'guest@club.test' },
];

async function main() {
  console.log('Connexion à la base…');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    await client.query('BEGIN');

    console.log('Création des tables…');
    await client.query(SQL_SCHEMA);

    console.log('Insertion des users…');
    const hash = await bcrypt.hash('password123', 10);
    for (const u of USERS) {
      await client.query(
        `INSERT INTO users (firstname, lastname, username, password, is_member, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [u.firstname, u.lastname, u.username, hash, u.isMember, u.isAdmin]
      );
    }

    console.log('Insertion des messages…');
    for (const m of MESSAGES) {
      await client.query(
        `INSERT INTO messages (title, text, user_id)
         VALUES ($1, $2, (SELECT id FROM users WHERE username = $3))`,
        [m.title, m.text, m.author]
      );
    }

    await client.query('COMMIT');
    console.log('Terminé ✅');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur, rien n’a été modifié :', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();