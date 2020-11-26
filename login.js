const ora = require("ora");
const url = "https://app.codesignal.com/login";

async function login(page) {
  const spinner = ora(`Opening Login Page: ${url}`).start();
  await openPage(page);
  spinner.succeed("Opening Login Page successful");
  await enterCredentials(page);
  await logIn(page);
}

async function openPage(page) {
  await page.goto(url, { waitUntil: "networkidle0" });
}

async function enterCredentials(page) {
  ora().info(`Using username: ${process.env.USER_NAME}`);
  ora().info(
    `Using password: ${process.env.PASSWORD.split("")
      .map((char, index) => ([0, 1, 2].includes(index) ? char : "*"))
      .join("")}`
  );
  const spinner = ora("Entering credentials...").start();
  await page.type("input[name=username]", process.env.USER_NAME, {
    delay: 20,
  });
  await page.type("input[name=password]", process.env.PASSWORD, {
    delay: 20,
  });
  spinner.succeed("Entering Credentials successful!");
}

async function logIn(page) {
  const signIN = 'div[data-name="signup"]';
  await page.waitForSelector(signIN);
  const spinner = ora("Now logging in...").start();
  await page.click(signIN);
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  spinner.succeed("Login successful!");
}

module.exports = {
  login,
};
