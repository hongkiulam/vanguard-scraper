import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  port: Number(process.env.PORT) || 3000,
  mysqlPassword: process.env.MYSQLPASSWORD,
  mysqlHost: process.env.MYSQLHOST,
  mysqlPort: Number(process.env.MYSQLPORT),
  mysqlUrl: process.env.MYSQL_URL,
  mysqlUser: process.env.MYSQLUSER,
  mysqlDatabase: process.env.MYSQLDATABASE,
  basicAuthUser: process.env.BASIC_AUTH_USER,
  basicAuthPassword: process.env.BASIC_AUTH_PASSWORD,
  scrapingAntKey: process.env.SCRAPING_ANT_API_KEY || "",
  vgUsername: process.env.VG_USERNAME || "",
  vgPassword: process.env.VG_PASSWORD || "",
  vgUserId: process.env.VG_USERID || "",
};
