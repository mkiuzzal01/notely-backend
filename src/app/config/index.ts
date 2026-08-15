import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
    // server configuration:
    port: process.env.PORT,
    node_env: process.env.APP_MODE,
    database_url: process.env.DATABASE_URL,
    // jwt configuration:
    jwt_secret: process.env.ACCESS_TOKEN,
    jwt_expiration: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_secret: process.env.REFRESH_TOKEN,
    jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRES_IN,
    jwt_forget_password_expiration: process.env.JWT_FORGET_PASSWORD_EXPIRES_IN,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,

 // email configuration:
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  client_site_port: process.env.CLIENT_SITE_PORT, 
  
    // default user credentials:
    admin_pass: process.env.DEFAULT_ADMIN_PASS,
    super_admin_pass: process.env.SUPER_ADMIN_PASS,
    cors_origin: process.env.CORS_ORIGIN,
};