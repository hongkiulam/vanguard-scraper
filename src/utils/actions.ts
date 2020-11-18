import puppeteer from "puppeteer";
import { LOGINBUTTON, PASSWORDINPUT, USERNAMEINPUT } from "./document";

export const attemptLogin = async (
  page: puppeteer.Page,
  username: string,
  password: string
) => {
  try {
    await page.focus(USERNAMEINPUT);
    await page.keyboard.type(username);
    await page.focus(PASSWORDINPUT);
    await page.keyboard.type(password);
    await page.$eval(LOGINBUTTON, (btn) => (btn as HTMLButtonElement).click());
    console.log("Attempting Login...");
  } catch {
    // this shouldnt happen as we pre-authenticate beforehand
    throw new Error("Failed to login");
  }
};

export const getPersonalDetails = async (page: puppeteer.Page) => {
  try {
    const response = await page.waitForResponse((res) =>
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Customer\/CustomerPersonalDetails\/Get/.test(
        res.url()
      )
    );
    const personalDetails = (await response.json()) as { Result: any };
    return personalDetails.Result;
  } catch {
    throw new Error("Failed to get personal details");
  }
};

export const getPerformance = async (page: puppeteer.Page) => {
  try {
    const response = await page.waitForResponse((res) =>
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Performance\/SubaccountPerformance\/Get/.test(
        res.url()
      )
    );
    const performance = (await response.json()) as { Result: any };
    return performance.Result;
  } catch {
    throw new Error("Failed to get performance");
  }
};

export const getIsaDetails = async (page: puppeteer.Page) => {
  try {
    const response = await page.waitForResponse((res) =>
      /https:\/\/secure.vanguardinvestor.co.uk\/.*\/Api\/Allowance\/IsaAllowance\/Get/.test(
        res.url()
      )
    );
    const isaDetails = (await response.json()) as { Result: any };
    return isaDetails.Result;
  } catch {
    throw new Error("Failed to get ISA Details");
  }
};
