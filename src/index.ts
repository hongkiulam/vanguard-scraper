import puppeteer from "puppeteer";
import express from "express";
require("dotenv").config();

const app = express();
app.listen(process.env.PORT || 3000);

// app.get('/', async (req,res) => {
//   const browser = await puppeteer.launch({});
//   const page = await browser.newPage();
//   await page.goto('https://secure.vanguardinvestor.co.uk')
//   const login = await page.evaluate(async () => {
//     await page.focus('__GUID_1007');
//     await page.keyboard.type('hongkiulam');
//   })

//   await page.screenshot({path: 'image.png'})
//   res.send('hi')
// });

(async () => {
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
  await page.waitForSelector(
    "body > div:nth-child(7) > div > div > div > div:nth-child(3) > div > div:nth-child(2) > section > div > div.container.container-heading > div > div.col-valuation-date.col-xxs-6.col-sm-4.content-middle > div "
  );
  console.log("-- Reached Dashboard");
  await page.screenshot({ path: "image.png" });
  await browser.close();
})();
