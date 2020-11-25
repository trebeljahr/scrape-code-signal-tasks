const { setUp } = require("./setup");
const { fetchLinks } = require("./fetchLinks");
const { login } = require("./login");

(async () => {
  const { page, now, browser } = await setUp();
  await login(page, now);
  await fetchLinks(page, now);
  await browser.close();
})();
