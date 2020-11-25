const puppeteer = require("puppeteer");

const clickButtonWithText = async (page, text) => {
  const [button] = await page.$x(`//button[contains(., ${text})]`);
  if (button) {
    await button.click();
  } else {
    throw new Error(`Button with "${text}" as text not found!`);
  }
};

const url = "https://app.codesignal.com/arcade/intro/level-2/yuGuHvcCaFCKk56rJ";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });

  await page.screenshot({ path: "login-debug-screenshot.png" });
  await clickButtonWithText(page, "Log In");
  await trySigningIn(page);
  await browser.close();
})();

async function trySigningIn(page) {
  console.log("Trying to log in!");
  await page.type("input[name=password]", "test comment", {
    delay: 20,
  });
  await page.type("input[name=username]", "test comment", {
    delay: 20,
  });

  const signInButton = await page.$(
    ".button--content .-layout-h .-center-center .-space-h-8"
  );
  if (signInButton) {
    await signInButton.click();
  }
}
