import puppeteer from "puppeteer";
import express from "express";
import basicAuth from "express-basic-auth";
import { ResponseData } from "./types";
import { authorizer } from "./utils/auth";
import scrapeVanguard from "./scraper";
require("dotenv").config();

const app = express();
app.listen(process.env.PORT || 2308);

app.use(
  basicAuth({
    challenge: true,
    authorizeAsync: true,
    authorizer,
  })
);

app.get("/", async (req, res) => {
  let data: ResponseData = {
    success: false,
    errorMsg: ["Basic auth not provided"],
  };
  const {
    user: username,
    password,
  } = (req as basicAuth.IBasicAuthedRequest).auth;
  if (
    username &&
    password &&
    typeof username === "string" &&
    typeof password === "string"
  ) {
    data = await scrapeVanguard(username, password);
    res.send(data);
  } else {
    res.send(data);
  }
});
