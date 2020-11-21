import puppeteer from "puppeteer";
const paths = (userId: string) => {
  return {
    DASHBOARD: `https://secure.vanguardinvestor.co.uk/en-GB/Customer/Home/${userId}/Dashboard`,
    HOLDINGS: `https://secure.vanguardinvestor.co.uk/en-GB/Customer/Home/${userId}/Investments/Holdings`,
    PERSONALS: `https://secure.vanguardinvestor.co.uk/en-GB/Customer/Home/${userId}/Investments/Personals`,
  };
};

export const navigate = async (page: puppeteer.Page, to: string) => {
  // if we are already on the page, force a refresh
  if (page.url() === to) {
    await page.goto("about:blank");
    await page.goto(to);
  } else {
    await page.goto(to);
  }
};

export default paths;
