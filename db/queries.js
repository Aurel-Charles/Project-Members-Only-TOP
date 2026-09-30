import pool from "./pool.js";



export async function usernameExists(username) {
    const { rows } = await pool.query(
      `SELECT 1 FROM users 
      WHERE username = $1`,
      [username]
    );
    return rows.length > 0;
  }

export async function createUser({firstname, lastname, username, passwordHash}) {
    await pool.query(
        `INSERT INTO users (firstname, lastname, username, password)
        VALUES ($1, $2, $3, $4)`,
        [firstname, lastname, username, passwordHash]
    )
}

export async function getUserByUsername(username) {
  const {rows} = await pool.query(
    `SELECT * FROM users 
    WHERE username = $1`,
    [username]
  )
  return rows[0]
}

export async function getUserById(id) {
  const {rows} = await pool.query(
    `SELECT id, firstname, lastname, username, is_member, is_admin FROM users
    WHERE id = $1`,
    [id]
  )
  return rows[0]
}

export async function setMember(id) {
  await pool.query(
    `UPDATE users
    SET is_member = true
    WHERE id = $1`,
    [id]
  ) 
}

export async function setAdmin(id) {
  await pool.query(
    `UPDATE users
    SET is_admin = true,
        is_member = true
    WHERE id = $1`,
    [id]
  ) 
}

export async function createMessage({title, text, user_id}) {
  await pool.query(
    `INSERT INTO messages (title, text, user_id)
    VALUES ($1, $2, $3)`,
    [title, text, user_id]
  )
}

export async function getAllMessages() {
  const {rows} = await pool.query(
    `SELECT title, text
    FROM messages
    ORDER BY created_at desc`
  )
  return rows
}

export async function getAllMessagesWithAuthor() {
  const {rows} = await pool.query(
    `SELECT messages.id, title, text, users.firstname AS author_firstname, users.lastname AS author_lastname, created_at
    FROM messages
    INNER JOIN users
    ON messages.user_id = users.id
    ORDER BY created_at desc`
  )
  return rows
}

export async function deleteMessage(id){
  await pool.query(
    `DELETE FROM messages
    WHERE id = $1`,
    [id]
  )
}