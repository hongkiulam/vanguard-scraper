import mongoose from "mongoose";
import config from "./config";

const connect = () => {
  mongoose.connect(
    `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}`,
    { dbName: "prod" },
    (err) => {
      err && console.log('failed to connect to db', err);
      console.log("connected to db");
    }
  );
};
export default connect;
interface Performance {
  value: number;
  amountChange: number;
  percentageChange: number;
  date: Date;
}
const PerformanceSchema = new mongoose.Schema<Performance>({
  value: Number,
  amountChange: Number,
  percentageChange: Number,
  date: Date,
});
export const Performance = mongoose.model("performance", PerformanceSchema);
