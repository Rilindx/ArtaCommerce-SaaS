import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 3306),
  dbUser: process.env.DB_USER || 'root',
  dbPassword: process.env.DB_PASSWORD || '',
  dbName: process.env.DB_NAME || 'arta_ceramics_wms',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
};
