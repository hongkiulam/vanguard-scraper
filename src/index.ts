import puppeteer from "puppeteer";
import express from "express";
import {
  INVESTMENTSRETURNED,
  ISAVALUE,
  PERFORMANCEBUTTON,
  RATEOFRETURN,
} from "./dashboardSelectors";
require("dotenv").config();

const app = express();
app.listen(process.env.PORT || 3000);

const getTextContent = (el: Element) => {
  return el.textContent;
};
const main = async () => {
  console.log("Launch Browser...");
  const browser = await puppeteer.launch({});
  console.log("-- Browser Launched");
  const page = await browser.newPage();
  console.log("Goto Vanguard Login...");
  await page.goto("https://secure.vanguardinvestor.co.uk");
  console.log("-- Reached Vanguard Page");
  await page.focus("#__GUID_1007");
  await page.keyboard.type(process.env.VANGUARD_USERNAME!);
  await page.focus("#__GUID_1008");
  await page.keyboard.type(process.env.VANGUARD_PASSWORD!);
  await page.$eval(".submit button", (btn) =>
    (btn as HTMLButtonElement).click()
  );
  console.log("Attempting Login...");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForSelector(ISAVALUE);
  console.log("-- Reached Dashboard");
  const isaValue = await page.$eval(ISAVALUE, getTextContent);
  const rateOfReturn = await page.$eval(RATEOFRETURN, (el) => {
    const val = el.textContent;
    const isNegative = el.classList.contains("text-negative");
    return isNegative ? "-" : "+" + val;
  });

  // goto performance page
  await page.$eval(PERFORMANCEBUTTON, (btn) =>
    (btn as HTMLAnchorElement).click()
  );
  await page.waitForSelector(INVESTMENTSRETURNED);
  const investmentsReturned = await page.$eval(
    INVESTMENTSRETURNED,
    getTextContent
  );
  const data = { isaValue, rateOfReturn, investmentsReturned };
  console.log(data);
  await browser.close();
  return data;
};

app.get("/", async (req, res) => {
  const data = await main();
  res.send(data);
});
