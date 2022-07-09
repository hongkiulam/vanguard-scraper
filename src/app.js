const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Vanguard = require("./vg");
const http = require("http");
const Router = require("router");

const router = Router();

router.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

router.get("/performance", async (req, res, next) => {
  try {
    res.statusCode = 200;
    const vg = new Vanguard();
    await vg.login();
    const performance = await vg.performance();
    const value = Number(
      performance
        .querySelector(".stat-ended .figure span")
        ?.textContent.replace("£", "")
        .replace(",", "")
    );
    const amountChange = Number(
      performance
        .querySelector(".stat-row.last .figure span")
        ?.textContent.replace("£", "")
        .replace(",", "")
    );
    const percentageChange =
      Number(
        performance
          .querySelector(".stat-return .figure")
          ?.textContent.replace("%", "")
          .replace("-", "")
          .replace("+", "")
          .replace(",", "")
      ) / 100;
    res.end(JSON.stringify({ value, amountChange, percentageChange }));
  } catch (err) {
    next(err);
  }
});

router.get("/graph", async (req, res, next) => {
  try {
    const vg = new Vanguard();
    await vg.login();
    const performance = await vg.performance();
    const graph = performance.querySelector("#highcharts-0");
    res.statusCode = 200;
    res.setHeader("Content-Type", "image/svg+xml");
    res.end(graph.innerHTML);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.setHeader("Content-Type", "text/html; charset=UTF-8");
  res.end(err ? err.message : "🤷 Something went wrong");
});

const server = http.createServer(async (req, res) => {
  router(req, res, () => {
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.end("🤷 Page not found");
  });
});

const port = process.env.PORT || 3000;
server.listen(port);
console.log(`Listening on port ${port}`);
