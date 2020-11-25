async function login(page) {
  await openPage(page);
  await enterCredentials(page);
  await logIn(page);
}

async function openPage(page) {
  const url = "https://app.codesignal.com/login";
  await page.goto(url, { waitUntil: "networkidle0" });
}

async function enterCredentials(page) {
  console.log("Got to login page. Entering credential...");
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

async function logIn(page) {
  const signIN = 'div[data-name="signup"]';
  await page.waitForSelector(signIN);
  console.log("Trying to log in!");
  await page.click(signIN);
  await page.waitForNavigation({ waitUntil: "networkidle0" });
}

module.exports = {
  login,
};
