import puppeteer from "puppeteer";
import { login } from "./actions";

export const startSession = async (username: string, password: string) => {
  let browser;
  console.log("Launch Browser...");
  browser = await puppeteer.launch({});
  const page = await browser.newPage();
  console.log("Goto Vanguard Login...");
  await page.goto("https://secure.vanguardinvestor.co.uk");

  await login(page, username, password);
  await page.waitForNavigation();
  const pageUrl = page.url();
  const userId = pageUrl
    .replace("https://secure.vanguardinvestor.co.uk/en-GB/Customer/Home/", "")
    .replace("/Dashboard", "");
  await page.goto("about:blank");
  return { page, userId, browser };
};
