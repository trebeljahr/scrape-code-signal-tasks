const puppeteer = require("puppeteer");

const url = "https://app.codesignal.com/arcade/intro/level-2/yuGuHvcCaFCKk56rJ";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.screenshot({ path: "loaded-page-screenshot.png" });

  const logIN =
    "body > div:nth-child(11) > div > header > nav > div > div.-layout-h.-center.-space-h-8.-padding-h-16 > div.button.-type-primary.-size-28";
  await page.click(logIN);
  await page.screenshot({ path: "clicked-login-button-screenshot.png" });

  await enterCredentials(page);
  await page.screenshot({ path: "entered-credentials-screenshot.png" });

  const signIN =
    "body > div:nth-child(11) > div > main > div > div > div > div > form > div.-layout-v.-space-v-16 > div.-layout-v.-space-v-8 > div > div";
  await page.click(signIN);
  await page.screenshot({ path: "signed-in-screenshot.png" });

  await browser.close();
})();

async function enterCredentials(page) {
  console.log("Trying to log in!");
  await page.type("input[name=password]", process.env.PASSWORD, {
    delay: 20,
  });
  await page.type("input[name=username]", process.env.USER_NAME, {
    delay: 20,
  });
}
