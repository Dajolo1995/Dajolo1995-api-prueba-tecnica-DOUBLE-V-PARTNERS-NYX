import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  database: process.env.DATABASE_URL,
    nodemailer: {
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: process.env.NODEMAILER_SECURE,
    user: process.env.NODEMAILER_USER,
    password: process.env.NODEMAILER_PASSWORD,
  },
}));
