const axios = require("axios").default;
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

axiosCookieJarSupport(axios);

const SCRAPING_ANT_API_KEY = process.env.SCRAPING_ANT_API_KEY;
const VG_USERNAME = process.env.VG_USERNAME;
const VG_PASSWORD = process.env.VG_PASSWORD;
const VG_USERID = process.env.VG_USERID;

class Vanguard {
  _cookies = "";
  /**
   * @param {string} url
   */
  async _scrape(url) {
    console.log("⌛ " + url);
    const response = await axios.post(
      "https://api.scrapingant.com/v1/general",
      { url, cookies: this._cookies },
      {
        headers: {
          "x-api-key": SCRAPING_ANT_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    this._cookies = response.data.cookies;
    console.log("👌 " + url);
    return new JSDOM(response.data.content).window.document;
  }
  async login() {
    console.log("⌛ " + "logging in");
    const jar = new tough.CookieJar();
    await axios.post(
      "https://secure.vanguardinvestor.co.uk/en-GB/Api/Session/Login/Post",
      {
        request: {
          Password: VG_PASSWORD,
          Username: VG_USERNAME,
          isFromPublicSite: false,
        },
      },
      { jar }
    );
    const serialisedCookies = jar.serializeSync();
    this._cookies = serialisedCookies.cookies
      .map((cookie) => {
        return `${cookie.key}=${cookie.value}`;
      })
      .join(";");
    console.log("👌 " + "logged in");
  }
  async homepage() {
    return await this._scrape(
      "https://secure.vanguardinvestor.co.uk/en-GB/Customer/Home"
    );
  }
  async performance() {
    return await this._scrape(
      `https://secure.vanguardinvestor.co.uk/en-gb/customer/home/${VG_USERID}/investments/personals`
    );
  }
}

module.exports = Vanguard;
