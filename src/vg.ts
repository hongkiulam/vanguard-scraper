import axios from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from "tough-cookie";
import jsdom from "jsdom";

const { JSDOM } = jsdom;

axiosCookieJarSupport(axios);

const SCRAPING_ANT_API_KEY = process.env.SCRAPING_ANT_API_KEY;
const VG_USERNAME = process.env.VG_USERNAME;
const VG_PASSWORD = process.env.VG_PASSWORD;
const VG_USERID = process.env.VG_USERID;

class Vanguard {
  _cookieJar = new tough.CookieJar();
  async _scrape(url: string) {
    console.log("⌛ " + url);
    const serialisedCookies = this._cookieJar.serializeSync();
    const cookies = serialisedCookies.cookies
      .map((cookie) => {
        return `${cookie.key}=${cookie.value}`;
      })
      .join(";");
    const response = await axios.post(
      "https://api.scrapingant.com/v1/general",
      { url, cookies },
      {
        headers: {
          "x-api-key": SCRAPING_ANT_API_KEY,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    this._cookieJar.setCookieSync(response.data.cookies, "", {});
    console.log("👌 " + url);
    return new JSDOM(response.data.content).window.document;
  }
  async login() {
    console.log("⌛ " + "logging in");
    await axios.post(
      "https://secure.vanguardinvestor.co.uk/en-GB/Api/Session/Login/Post",
      {
        request: {
          Password: VG_PASSWORD,
          Username: VG_USERNAME,
          isFromPublicSite: false,
        },
      },
      { jar: this._cookieJar }
    );
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

export default Vanguard;
