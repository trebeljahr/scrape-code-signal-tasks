require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const util = require("util");

const mkdir = util.promisify(fs.mkdir);
const url = "https://app.codesignal.com/login";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const now = new Date().toLocaleTimeString("en-gb", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  console.log(now);

  await mkdir(`screenshots/${now}`);
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `screenshots/${now}/loaded-page.png` });

  await enterCredentials(page);
  await page.screenshot({ path: `screenshots/${now}/entered-credentials.png` });

  await logIn(page);
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.screenshot({ path: `screenshots/${now}/logged-in.png` });

  const tasksUrl = "https://app.codesignal.com/profile/trebeljahr/tasks";
  await page.goto(tasksUrl, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `screenshots/${now}/tasks-page.png` });

  const linkSelector = "a.card-task-link";
  await page.waitForSelector(linkSelector);
  const links = await page.$$eval(linkSelector, (am) =>
    am.filter((e) => e.href).map((e) => e.href)
  );
  console.log(links);

  await browser.close();
})();

async function logIn(page) {
  const signIN =
    "body > div:nth-child(11) > div > main > div > div > div > div > form > div.-layout-v.-space-v-16 > div.-layout-v.-space-v-8 > div > div";
  await page.waitForSelector(signIN);
  console.log("Trying to log in!");
  await page.click(signIN);
}

async function enterCredentials(page) {
  console.log("Got to login page. Entering credentials now...");
  await page.type("input[name=username]", process.env.USER_NAME, {
    delay: 40,
  });
  await page.type("input[name=password]", process.env.PASSWORD, {
    delay: 40,
  });
  console.log("Entered credentials!");
  console.log("Username:", process.env.USER_NAME);
  console.log(
    "Using password:",
    process.env.PASSWORD.split("")
      .map((char, index) => ([0, 1, 2].includes(index) ? char : "*"))
      .join("")
  );
}
