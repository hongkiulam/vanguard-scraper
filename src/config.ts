import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  port: Number(process.env.PORT) || 3000,
  mongoPassword: process.env.MONGOPASSWORD || "",
  mongoHost: process.env.MONGOHOST || "",
  mongoUser: process.env.MONGOUSER || "",
  mongoPort: process.env.MONGOPORT || "",
  basicAuthUser: process.env.BASIC_AUTH_USER,
  basicAuthPassword: process.env.BASIC_AUTH_PASSWORD,
  scrapingAntKey: process.env.SCRAPING_ANT_API_KEY || "",
  vgUsername: process.env.VG_USERNAME || "",
  vgPassword: process.env.VG_PASSWORD || "",
  vgUserId: process.env.VG_USERID || "",
};
