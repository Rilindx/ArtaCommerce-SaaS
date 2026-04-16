import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME || 'Arta Ceramics Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@artaceramics.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES (?, ?, ?, 'admin')
     ON DUPLICATE KEY UPDATE
       name = VALUES(name),
       password_hash = VALUES(password_hash),
       role = VALUES(role)`,
    [name, email, passwordHash]
  );

  console.log(`Admin user seeded: ${email}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  console.error('Failed to seed admin user', error);
  process.exit(1);
});
