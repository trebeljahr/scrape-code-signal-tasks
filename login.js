async function login(page, now) {
  await openPage(page, now);
  await enterCredentials(page, now);
  await logIn(page, now);
}

async function openPage(page, now) {
  const url = "https://app.codesignal.com/login";
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.screenshot({ path: `screenshots/${now}/loaded-page.png` });
}

async function enterCredentials(page, now) {
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
  await page.screenshot({
    path: `screenshots/${now}/entered-credentials.png`,
  });
}

async function logIn(page, now) {
  const signIN = 'div[data-name="signup"]';
  await page.waitForSelector(signIN);
  console.log("Trying to log in!");
  await page.click(signIN);
  await page.waitForNavigation({ waitUntil: "networkidle0" });
  await page.screenshot({ path: `screenshots/${now}/logged-in.png` });
}

module.exports = {
  login,
};
