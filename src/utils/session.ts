import puppeteer from "puppeteer";
import { login } from "./actions";

export const startSession = async (username: string, password: string) => {
  let browser;
  console.log("Launch Browser...");
  browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  console.log("Goto Vanguard Login...");
  await page.goto("https://secure.vanguardinvestor.co.uk", {
    waitUntil: "networkidle2",
    timeout: 60000, // wait for 1 minute before timing out
  });
  await login(page, username, password);
  await page.waitForNavigation();
  const pageUrl = page.url();
  const userId = pageUrl
    .replace("https://secure.vanguardinvestor.co.uk/en-GB/Customer/Home/", "")
    .replace("/Dashboard", "");
  return { page, userId, browser };
};
