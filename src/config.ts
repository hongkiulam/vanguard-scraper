import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

export default {
  port: Number(process.env.PORT) || 3000,
  mongoPassword: process.env.MONGOPASSWORD || '',
  mongoHost: process.env.MONGOHOST || '',
  mongoUser: process.env.MONGOUSER || '',
  mongoPort: process.env.MONGOPORT || '',
 
}